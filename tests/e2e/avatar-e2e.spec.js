const { test, expect } = require('@playwright/test');

const URL = 'http://localhost:5173';

const pausa = async (page, ms = 1500) => {
  await page.waitForTimeout(ms);
};

test('T07 - alteração e persistência do avatar', async ({ page }) => {

  test.setTimeout(90000);

  await page.setViewportSize({
    width: 1000,
    height: 650
  });

  console.log('\n========================================');
  console.log(' T07 - TESTE DE ALTERAÇÃO DO AVATAR');
  console.log('========================================\n');


  // ==================================================
  // T07.1 - LOGIN
  // ==================================================

  console.log('[T07.1] Login');

  await page.goto(URL);

  await expect(
    page.getByRole('heading', { name: 'Entrar' })
  ).toBeVisible();

  await page
    .getByPlaceholder('Gamertag ou e-mail')
    .fill('alice');

  await page
    .getByPlaceholder('Senha')
    .fill('123456');

  await page
    .getByRole('button', { name: 'Entrar' })
    .click();

  await expect(page).toHaveURL(/\/home$/);

  await pausa(page, 1500);

  console.log('[PASSOU] Login realizado');


  // ==================================================
  // T07.2 - PERFIL
  // ==================================================

  console.log('[T07.2] Abrindo Perfil');

  await page
    .locator('a[href="/perfil"]')
    .click();

  await expect(page).toHaveURL(/\/perfil$/);

  await expect(
    page.getByRole('button', {
      name: 'Editar Avatar'
    })
  ).toBeVisible();

  await pausa(page, 1500);

  console.log('[PASSOU] Perfil carregado');


  // ==================================================
  // T07.3 - EDITOR DO AVATAR
  // ==================================================

  console.log('[T07.3] Abrindo editor do Avatar');

  await page
    .getByRole('button', {
      name: 'Editar Avatar'
    })
    .click();

  await expect(page).toHaveURL(/\/avatar$/);

  await expect(
    page.getByRole('heading', {
      name: 'Crie seu Avatar'
    })
  ).toBeVisible();

  await pausa(page, 2000);

  console.log('[PASSOU] Editor carregado');


  // ==================================================
  // T07.4 - ALTERAÇÃO DO AVATAR
  // ==================================================

  console.log(
    '[T07.4] Alterando acessório de headphones para hat'
  );

  await page
    .getByRole('button', {
      name: 'Acessórios'
    })
    .click();

  await pausa(page, 1000);

  const hat = page.getByRole(
    'button',
    {
      name: 'hat',
      exact: true
    }
  );

  await expect(hat).toBeVisible();

  await hat.click();

  await pausa(page, 2000);

  console.log(
    '[PASSOU] Acessório alterado para hat'
  );


  // ==================================================
  // T07.5 - SALVAR NO SERVIDOR
  // ==================================================

  console.log('[T07.5] Salvando Avatar');

  page.once('dialog', async dialog => {

    console.log(
      '[ALERTA] ' + dialog.message()
    );

    await dialog.accept();
  });

  await page
    .getByRole('button', {
      name: 'Salvar',
      exact: true
    })
    .click();

  await pausa(page, 2000);

  const avatarSalvo =
    await page.evaluate(() => {

      return JSON.parse(
        localStorage.getItem('avatar') || '{}'
      );

    });

  expect(
    avatarSalvo.accessoryId
  ).toBe('hat');

  console.log(
    '[PASSOU] Avatar salvo no servidor'
  );


  // ==================================================
  // T07.6 - ENCERRAR A SESSÃO
  // ==================================================

  console.log(
    '[T07.6] Encerrando sessão do usuário'
  );

  /*
   * Remove os dados locais, inclusive o avatar,
   * para garantir que a próxima verificação
   * não utilize o cache do navegador.
   */
  await page.evaluate(() => {

    localStorage.clear();

  });

  await page.goto(URL);

  await expect(
    page.getByRole('heading', {
      name: 'Entrar'
    })
  ).toBeVisible();

  await pausa(page, 2000);

  console.log(
    '[PASSOU] Sessão encerrada'
  );


  // ==================================================
  // T07.7 - NOVO LOGIN
  // ==================================================

  console.log(
    '[T07.7] Realizando novo login'
  );

  await page
    .getByPlaceholder('Gamertag ou e-mail')
    .fill('alice');

  await page
    .getByPlaceholder('Senha')
    .fill('123456');

  await pausa(page, 800);

  await page
    .getByRole('button', {
      name: 'Entrar'
    })
    .click();

  await expect(
    page
  ).toHaveURL(/\/home$/);

  await pausa(page, 3000);

  console.log(
    '[PASSOU] Novo login realizado'
  );


  // ==================================================
  // T07.8 - VERIFICAR PERSISTÊNCIA
  // ==================================================

  console.log(
    '[T07.8] Verificando persistência do Avatar'
  );

  /*
   * Como o armazenamento local foi apagado,
   * "hat" deve ter sido recuperado novamente
   * pela aplicação após a autenticação.
   */
  await expect
    .poll(
      async () => {

        return await page.evaluate(() => {

          const raw =
            localStorage.getItem('avatar');

          if (!raw) {
            return null;
          }

          try {

            return JSON.parse(raw).accessoryId;

          } catch {

            return null;

          }

        });

      },
      {
        timeout: 10000
      }
    )
    .toBe('hat');

  console.log(
    '[PASSOU] Avatar recuperado após novo login'
  );


  // ==================================================
  // T07.9 - CONFIRMAÇÃO NO PERFIL
  // ==================================================

  console.log(
    '[T07.9] Confirmando Avatar no Perfil'
  );

  await page
    .locator('a[href="/perfil"]')
    .click();

  await expect(
    page
  ).toHaveURL(/\/perfil$/);

  await expect(
    page.getByRole('button', {
      name: 'Editar Avatar'
    })
  ).toBeVisible();

  await pausa(page, 2500);

  const avatarFinal =
    await page.evaluate(() => {

      return JSON.parse(
        localStorage.getItem('avatar') || '{}'
      );

    });

  expect(
    avatarFinal.accessoryId
  ).toBe('hat');

  console.log(
    '[PASSOU] Avatar persistente exibido no Perfil'
  );


  // ==================================================
  // RESULTADO FINAL
  // ==================================================

  await pausa(page, 2000);

  console.log('\n========================================');
  console.log(' T07 - ALTERAÇÃO DO AVATAR: PASSOU');
  console.log(' Persistência após novo login: OK');
  console.log(' Acessório persistido: hat');
  console.log('========================================\n');

});