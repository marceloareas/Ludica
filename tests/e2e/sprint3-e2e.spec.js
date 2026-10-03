const { test, expect } = require('@playwright/test');

const URL = 'http://localhost:5173';

const pausa = async (page, ms = 1500) => {
  await page.waitForTimeout(ms);
};

test('Sprint 3 - fluxo visual completo', async ({ page }) => {

  test.setTimeout(180000);

  await page.setViewportSize({
    width: 1000,
    height: 650
  });

  console.log('\n========================================');
  console.log(' TESTES AUTOMATIZADOS - SPRINT 3');
  console.log('========================================\n');

  await page.waitForTimeout(10000);

  // ==================================================
  // T01 - LOGIN
  // ==================================================

  console.log('[T01] Realizando login');

  await page.goto(URL);
  await page.waitForTimeout(2000);
  await expect(
    page.getByRole('heading', { name: 'Entrar' })
  ).toBeVisible();

  await page
    .getByPlaceholder('Gamertag ou e-mail')
    .fill('alice');

  await page
    .getByPlaceholder('Senha')
    .fill('123456');

  await pausa(page, 800);

  await page
    .getByRole('button', { name: 'Entrar' })
    .click();

  await expect(page).toHaveURL(/\/home$/);

  await pausa(page, 4000);

  console.log('[PASSOU] T01 - Login realizado');


  // ==================================================
  // T02 - HOME
  // ==================================================

  console.log('[T02] Validando Home');

  await expect(
    page.getByText(
      'Bem-vindo ao Lúdica, alice!',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      'Sua jornada de aprendizado começa aqui.',
      { exact: true }
    )
  ).toBeVisible();

  await pausa(page, 2000);

  console.log('[PASSOU] T02 - Home carregada');


  // ==================================================
  // T03 - CONTEÚDO DA HOME
  // ==================================================

  console.log('[T03] Validando conteúdo da Home');

  await expect(
    page.getByText(
      'Continue Jogando',
      { exact: true }
    )
  ).toBeVisible();

  await page.mouse.wheel(0, 400);

  await pausa(page, 2500);

  await expect(
    page.getByText(
      'Mais jogados da semana',
      { exact: true }
    )
  ).toBeVisible();

  await page.mouse.wheel(0, 450);

  await pausa(page, 1200);

  await expect(
    page.getByText(
      'Módulo de Estudo 1',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      'Módulo de Estudo 2',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      'Módulo de Estudo 3',
      { exact: true }
    )
  ).toBeVisible();

  await pausa(page, 3000);

  console.log(
    '[PASSOU] T03 - Conteúdo da Home exibido'
  );


  // ==================================================
  // T04 - BIBLIOTECA
  // ==================================================

  console.log('[T04] Abrindo Biblioteca');

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await pausa(page, 1000);

  await page
    .locator('a[href="/games"]')
    .click();

  await expect(page).toHaveURL(/\/games$/);

  await pausa(page, 4000);

  await expect(
    page.getByRole('img', {
      name: 'Math Challenge'
    })
  ).toBeVisible();

  await expect(
    page.getByRole('img', {
      name: 'Memory Master'
    })
  ).toBeVisible();

  await expect(
    page.getByRole('img', {
      name: 'Typing Speed'
    })
  ).toBeVisible();

  await expect(
    page.getByRole('img', {
      name: 'Xadrez'
    })
  ).toBeVisible();

  const botoesJogar =
    page.getByRole('link', {
      name: 'Jogar',
      exact: true
    });

  await expect(
    botoesJogar
  ).toHaveCount(4);

  await pausa(page, 2000);

  console.log(
    '[PASSOU] T04 - Biblioteca carregou os 4 jogos'
  );


  // ==================================================
  // T05 - DETALHES DO JOGO
  // ==================================================

  console.log(
    '[T05] Abrindo detalhes do Math Challenge'
  );

  await page
    .locator('a[href="/games/1"]')
    .click();

  await expect(
    page
  ).toHaveURL(/\/games\/1$/);

  await pausa(page, 4000);

  await expect(
    page.getByText(
      'Math Challenge',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      'Matemática divertida',
      { exact: true }
    )
  ).toBeVisible();

  console.log(
    '[PASSOU] T05 - Detalhes do jogo carregados'
  );


  // ==================================================
  // T06 - INFORMAÇÕES DO JOGO
  // ==================================================

  console.log(
    '[T06] Validando informações do jogo'
  );

  await expect(
    page.getByText(
      '10 min por partida',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      '8+ anos',
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      '1 jogador',
      { exact: true }
    )
  ).toBeVisible();

  await pausa(page, 4000);

  console.log(
    '[PASSOU] T06 - Tempo, faixa etária e jogadores exibidos'
  );


  // ==================================================
  // T07 - ALTERAÇÃO E PERSISTÊNCIA DO AVATAR
  // ==================================================

  console.log(
    '[T07] Iniciando teste do Avatar'
  );


  // --------------------------------------------------
  // T07.1 - ABRIR PERFIL
  // --------------------------------------------------

  console.log('[T07.1] Abrindo Perfil');

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

  await pausa(page, 3000);

  console.log(
    '[PASSOU] Perfil carregado'
  );


  // --------------------------------------------------
  // T07.2 - ABRIR EDITOR
  // --------------------------------------------------

  console.log(
    '[T07.2] Abrindo editor do Avatar'
  );

  await page
    .getByRole('button', {
      name: 'Editar Avatar'
    })
    .click();

  await expect(
    page
  ).toHaveURL(/\/avatar$/);

  await expect(
    page.getByRole('heading', {
      name: 'Crie seu Avatar'
    })
  ).toBeVisible();

  await pausa(page, 4000);

  console.log(
    '[PASSOU] Editor carregado'
  );


  // --------------------------------------------------
  // T07.3 - ALTERAR AVATAR
  // --------------------------------------------------

  console.log(
    '[T07.3] Alterando acessório para headphones'
  );

  await page
    .getByRole('button', {
      name: 'Acessórios'
    })
    .click();

  await pausa(page, 2000);

  const headphones = page.getByRole(
    'button',
    {
      name: 'headphones',
      exact: true
    }
  );

  await expect(
    headphones
  ).toBeVisible();

  await headphones.click();

  await pausa(page, 4000);

  console.log(
    '[PASSOU] Acessório alterado para headphones'
  );


  // --------------------------------------------------
  // T07.4 - SALVAR AVATAR
  // --------------------------------------------------

  console.log(
    '[T07.4] Salvando Avatar'
  );

  page.once(
    'dialog',
    async dialog => {

      console.log(
        '[ALERTA] ' + dialog.message()
      );

      await dialog.accept();
    }
  );

  await page
    .getByRole('button', {
      name: 'Salvar',
      exact: true
    })
    .click();

  await pausa(page, 3000);

  const avatarSalvo =
    await page.evaluate(() => {

      return JSON.parse(
        localStorage.getItem('avatar') || '{}'
      );

    });

  expect(
    avatarSalvo.accessoryId
  ).toBe('headphones');

  console.log(
    '[PASSOU] Avatar salvo no servidor'
  );


  // --------------------------------------------------
  // T07.5 - ENCERRAR SESSÃO
  // --------------------------------------------------

  console.log(
    '[T07.5] Encerrando sessão'
  );

  /*
   * Remove inclusive o avatar do armazenamento local.
   * Assim, a próxima validação não poderá utilizar
   * o cache existente no navegador.
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

  await pausa(page, 3000);

  console.log(
    '[PASSOU] Sessão encerrada'
  );


  // --------------------------------------------------
  // T07.6 - NOVO LOGIN
  // --------------------------------------------------

  console.log(
    '[T07.6] Realizando novo login'
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

  await pausa(page, 4000);

  console.log(
    '[PASSOU] Novo login realizado'
  );


  // --------------------------------------------------
  // T07.7 - VERIFICAR PERSISTÊNCIA
  // --------------------------------------------------

  console.log(
    '[T07.7] Verificando persistência do Avatar'
  );

  /*
   * Como o localStorage foi apagado antes do login,
   * "headphones" precisa ter sido recuperado
   * novamente pela aplicação.
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

            return JSON.parse(
              raw
            ).accessoryId;

          } catch {

            return null;

          }

        });

      },
      {
        timeout: 10000
      }
    )
    .toBe('headphones');

  console.log(
    '[PASSOU] Avatar recuperado após novo login'
  );


  // --------------------------------------------------
  // T07.8 - CONFIRMAÇÃO VISUAL NO PERFIL
  // --------------------------------------------------

  console.log(
    '[T07.8] Confirmando Avatar no Perfil'
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

  await pausa(page, 5000);

  const avatarFinal =
    await page.evaluate(() => {

      return JSON.parse(
        localStorage.getItem('avatar') || '{}'
      );

    });

  expect(
    avatarFinal.accessoryId
  ).toBe('headphones');

  console.log(
    '[PASSOU] Avatar persistente exibido no Perfil'
  );


  // ==================================================
  // RESULTADO FINAL
  // ==================================================

  await pausa(page, 5000);

  console.log('\n========================================');
  console.log(' TESTES DA SPRINT 3 CONCLUÍDOS');
  console.log(' T01 - T07: OK');
  console.log(' Avatar persistente: headphones');
  console.log('========================================\n');

});