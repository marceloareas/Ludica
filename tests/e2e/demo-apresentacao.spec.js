const { test, expect } = require('@playwright/test');

// Execute Docker e seed externamente antes deste teste.
// O seed fornece alice@email.com, prof_ana e admin, todos com senha 123456.
const URL = 'http://localhost:5173';
// Defina DEMO_PREPARAR_AVATAR=0 para pular a restauração antes da gravação.
const RESTAURAR_AVATAR_ANTES_DA_DEMO = process.env.DEMO_PREPARAR_AVATAR !== '0';
const pausa = (page, ms = 4000) => page.waitForTimeout(ms);

// Mostra a etapa no título da aba do navegador, fora do conteúdo da aplicação.
async function instalarTituloDaEtapa(page) {
  await page.addInitScript(() => {
    const chave = 'DEMO_ETAPA:';
    const atualizarTitulo = () => {
      if (window.name.startsWith(chave)) {
        document.title = window.name.slice(chave.length);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', atualizarTitulo, { once: true });
    } else {
      atualizarTitulo();
    }
  });
}

async function mostrarEtapa(page, titulo) {
  await page.evaluate(texto => {
    window.name = `DEMO_ETAPA:${texto}`;
    document.title = texto;
  }, titulo);
}
test.use({
  viewport: { width: 1280, height: 720 },
  video: { mode: 'on', size: { width: 1280, height: 720 } },
  reducedMotion: 'no-preference',
});

async function scrollSuave(page, alvo) {
  if (alvo) {
    await expect(alvo).toBeAttached();
    await alvo.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  } else {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  await pausa(page, 2000);
  if (alvo) await expect(alvo).toBeInViewport();
}

async function rolarAteFim(page) {
  let topoAtual = await page.evaluate(() => window.scrollY);
  let tentativas = 0;
  while (tentativas < 20) {
    const proximoTopo = await page.evaluate(() => Math.min(
      document.documentElement.scrollHeight - window.innerHeight,
      window.scrollY + Math.round(window.innerHeight * 0.75),
    ));
    if (proximoTopo <= topoAtual) break;
    await page.evaluate(topo => window.scrollTo({ top: topo, behavior: 'smooth' }), proximoTopo);
    await pausa(page, 700);
    topoAtual = await page.evaluate(() => window.scrollY);
    tentativas += 1;
  }
  await pausa(page, 1800);
}

async function voltarAoTopo(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await pausa(page, 2500);
}
async function escrever(campo, texto, delay = 130) {
  await campo.fill('');
  await campo.pressSequentially(texto, { delay });
}

async function login(page, usuario, { pausaMs = 2000, typingDelay = 130 } = {}) {
  await expect(page.getByRole('heading', { name: 'Entrar', exact: true })).toBeVisible();
  await escrever(page.getByPlaceholder('Gamertag ou e-mail'), usuario, typingDelay);
  await pausa(page, pausaMs);
  await escrever(page.getByPlaceholder('Senha', { exact: true }), '123456', typingDelay);
  await pausa(page, pausaMs);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  if (pausaMs > 0) await pausa(page, pausaMs * 2);
}

async function logout(page) {
  await scrollSuave(page);
  await page.getByRole('button', { name: 'Sair', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Entrar', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
  await pausa(page, 2000);
}

// Cada teste segue a sequência: Slide Início, demonstração e Slide Fim.
let numeroSlide = 0;

const informacoesDosSlides = {
  'Preparação: restaurar avatar padrão antes da demonstração': {
    objetivo: 'Garantir que o avatar comece em um estado visual conhecido em toda execução.',
    acao: ['Entrar como Alice.', 'Restaurar o avatar padrão.', 'Selecionar hat e salvar.', 'Encerrar a sessão para confirmar a recuperação do avatar.'],
  },
  'Login por e-mail e avatar recuperado': {
    objetivo: 'Demonstrar a autenticação por e-mail e os dados associados à conta.',
    acao: ['Informar o e-mail de Alice e a senha.', 'Entrar na aplicação.', 'Confirmar o avatar recuperado na interface.'],
  },
  'Home: busca, Mais populares e Continue jogando': {
    objetivo: 'Mostrar a busca, a descoberta de jogos e a navegação pelas páginas principais.',
    acao: ['Pesquisar Math Challenge e conferir o resultado.', 'Limpar a busca e mostrar Mais populares.', 'Exibir Continue jogando.', 'Abrir a Biblioteca e visualizar os jogos.', 'Abrir Amigos e visualizar a página.', 'Voltar à Home, rolar até o fim e retornar ao topo.'],
  },
  'Detalhe: desempenho, histórico e ranking dos amigos': {
    objetivo: 'Apresentar o acompanhamento do desempenho individual e social.',
    acao: ['Abrir Math Challenge.', 'Exibir Sobre o jogo e Meu desempenho.', 'Percorrer o histórico de partidas.', 'Mostrar o ranking dos amigos.'],
  },
  'Perfil: persistência e Gamertag duplicada sem distinguir caixa': {
    objetivo: 'Verificar a edição persistente dos dados e a proteção contra Gamertags repetidas.',
    acao: ['Editar e salvar um dado seguro do perfil.', 'Recarregar e entrar novamente para confirmar a persistência.', 'Tentar usar a Gamertag BOB, já existente.', 'Mostrar o erro e restaurar o nome original.'],
  },
  'Perfil da professora prof_ana e acesso ao mesmo jogo': {
    objetivo: 'Mostrar os dados e a experiência da conta de professora.',
    acao: ['Entrar como prof_ana.', 'Conferir nome, e-mail e tipo de perfil.', 'Abrir o mesmo jogo.', 'Exibir a área Atividades.'],
  },
  'Administrador no mesmo jogo': {
    objetivo: 'Mostrar a visão administrativa do jogo e distinguir seu desempenho de teste.',
    acao: ['Entrar como admin.', 'Abrir o mesmo jogo.', 'Exibir Desempenho de teste e a indicação de que não entra no ranking.'],
  },
};

function escaparHtml(texto) {
  return texto.replace(/[&<>"']/g, caractere => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[caractere]);
}

async function mostrarSlideInicializacao(page) {
  await test.step('Preparação do ambiente', async () => {
    console.log('[DEMONSTRAÇÃO] Preparação do ambiente — Docker, backend e front-end');
    await mostrarEtapa(page, 'Preparação do ambiente');
    await page.setContent(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Preparação do ambiente — Lúdica</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 36px; color: #14213d; font-family: Segoe UI, Arial, sans-serif; background: radial-gradient(circle at 85% 15%, #d9ccff 0, transparent 28%), linear-gradient(135deg, #f8f4f1, #edf3ff); }
            main { width: min(100%, 1080px); padding: 42px 52px; border: 1px solid #e9e4ef; border-radius: 26px; background: rgba(255,255,255,.97); box-shadow: 0 24px 80px #17255420; }
            .eyebrow { display: inline-block; margin-bottom: 14px; padding: 8px 14px; border-radius: 999px; color: #653dc3; background: #f0eaff; font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            h1 { margin: 0; font-size: clamp(34px, 4vw, 48px); letter-spacing: -.04em; }
            .intro { margin: 12px 0 24px; color: #626b7b; font-size: 17px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
            article { padding: 18px 20px; border-radius: 16px; background: #f8f7fb; }
            article:nth-child(even) { background: #fff7e8; }
            h2 { margin: 0 0 9px; font-size: 17px; }
            code { display: block; overflow-wrap: anywhere; padding: 9px 11px; border-radius: 9px; color: #f8fafc; background: #18243d; font: 14px Consolas, monospace; }
            .countdown { display: grid; place-items: center; width: 132px; height: 76px; margin: 22px auto 0; border-radius: 999px; color: #fff; background: #653dc3; font-size: 20px; font-weight: 800; white-space: nowrap; }
            footer { margin-top: 10px; color: #7c8492; text-align: center; font-size: 13px; }
            @media (max-width: 700px) { body { padding: 18px; } main { padding: 28px 22px; } .grid { grid-template-columns: 1fr; } }
          </style>
        </head>
        <body><main>
          <span class="eyebrow">Antes da demonstração</span>
          <h1>Inicialização do ambiente</h1>
          <p class="intro">Etapas de preparação executadas no terminal antes de iniciar a gravação.</p>
          <div class="grid">
            <article><h2>Docker Compose</h2><code>docker compose up --build</code></article>
            <article><h2>Seed do banco</h2><code>docker compose exec backend npm run seed</code></article>
            <article><h2>Backend</h2><code>http://localhost:3000</code></article>
            <article><h2>Front-end</h2><code>http://localhost:5173</code></article>
          </div>
          <div id="contagem" class="countdown" aria-live="polite">3</div>
          <footer>O teste começa em instantes</footer>
        </main></body>
      </html>
    `);
    const contador = page.locator('#contagem');
    for (const valor of ['4', '3', '2', '1', 'INÍCIO']) {
      await contador.evaluate((elemento, texto) => { elemento.textContent = texto; }, valor);
      await pausa(page, 1000);
    }
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(page.getByRole('heading', { name: 'Entrar', exact: true })).toBeVisible({ timeout: 15000 });
  });
}
async function etapa(page, titulo, segundos, executar) {
  await test.step(titulo, async () => {
    const numero = ++numeroSlide;
    const tituloSeguro = escaparHtml(titulo);
    const { objetivo, acao } = informacoesDosSlides[titulo] ?? {
      objetivo: 'Apresentar a próxima parte da demonstração.',
      acao: [titulo],
    };
    const acaoHtml = `<ol class="action-list">${acao.map(passo => `<li>${escaparHtml(passo)}</li>`).join('')}</ol>`;
    const rotaDeRetorno = page.url().startsWith(URL) ? page.url() : URL;

    await mostrarEtapa(page, `Teste ${numero}: ${titulo}`);
    console.log(`[DEMONSTRAÇÃO] Teste ${numero}: ${titulo}`);
    await page.setContent(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Teste ${numero} — Início</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 40px; color: #14213d; font-family: Segoe UI, Arial, sans-serif; background: radial-gradient(circle at 85% 15%, #d9ccff 0, transparent 28%), linear-gradient(135deg, #f8f4f1, #edf3ff); }
            main { width: min(100%, 1050px); padding: 48px 64px; border: 1px solid #e9e4ef; border-radius: 28px; background: rgba(255,255,255,.97); box-shadow: 0 24px 80px #17255420; }
            .eyebrow { display: inline-block; margin-bottom: 18px; padding: 9px 16px; border-radius: 999px; color: #653dc3; background: #f0eaff; font-size: 14px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            h1 { margin: 0; font-size: clamp(34px, 4.5vw, 54px); line-height: 1.08; letter-spacing: -.04em; }
            .intro { margin: 14px 0 28px; color: #626b7b; font-size: 19px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
            section { min-height: 132px; padding: 22px 24px; border-radius: 18px; background: #f8f7fb; }
            section:last-child { background: #fff7e8; }
            h2 { margin: 0 0 10px; font-size: 19px; }
            section p, .action-list { margin: 0; color: #4f596b; font-size: 16px; line-height: 1.45; }
            .action-list { padding-left: 22px; }
            .action-list li { margin: 0 0 5px; padding-left: 3px; }
            .countdown { display: grid; place-items: center; width: 132px; height: 76px; margin: 22px auto 0; padding: 0 14px; border-radius: 999px; color: #fff; background: #653dc3; font-size: 20px; font-weight: 800; white-space: nowrap; box-shadow: 0 8px 24px #653dc340; }
            footer { margin-top: 12px; color: #7c8492; text-align: center; font-size: 13px; }
            @media (max-width: 700px) { body { padding: 18px; } main { padding: 32px 24px; } .details { grid-template-columns: 1fr; } }
          </style>
        </head>
        <body>
          <main>
            <span class="eyebrow">Teste ${numero} · Início</span>
            <h1>${tituloSeguro}</h1>
            <p class="intro">Apresentação da próxima demonstração.</p>
            <div class="details">
              <section><h2>Objetivo</h2><p>${escaparHtml(objetivo)}</p></section>
              <section><h2>Ação</h2>${acaoHtml}</section>
            </div>
            <div id="contagem" class="countdown" aria-live="polite">3</div>
            <footer>A demonstração começa em instantes</footer>
          </main>
        </body>
      </html>
    `);

    const contador = page.locator('#contagem');
    for (const valor of ['4', '3', '2', '1', 'INÍCIO']) {
      await contador.evaluate((elemento, texto) => { elemento.textContent = texto; }, valor);
      await pausa(page, 1000);
    }

    await page.goto(rotaDeRetorno, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await mostrarEtapa(page, `Teste ${numero}: ${titulo}`);

    const inicio = Date.now();
    await executar();
    const restante = segundos * 1000 - (Date.now() - inicio);
    if (restante > 0) await pausa(page, restante);

    const ultimaEtapa = numero === 6 + (RESTAURAR_AVATAR_ANTES_DA_DEMO ? 1 : 0);
    const proxima = ultimaEtapa
      ? 'Demonstração concluída.'
      : `Aguarde o Slide Início do Teste ${numero + 1}.`;
    await mostrarEtapa(page, `Teste ${numero}: Fim`);
    await page.setContent(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Teste ${numero} — Fim</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 40px; color: #14213d; font-family: Segoe UI, Arial, sans-serif; background: linear-gradient(135deg, #edf7f2, #f4f0ff); }
            main { width: min(100%, 900px); padding: 64px; border: 1px solid #e2ece6; border-radius: 28px; background: #fff; text-align: center; box-shadow: 0 24px 80px #17255420; }
            .eyebrow { display: inline-block; margin-bottom: 22px; padding: 9px 16px; border-radius: 999px; color: #16734b; background: #e6f7ee; font-size: 14px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
            h1 { margin: 0; font-size: clamp(38px, 5vw, 60px); letter-spacing: -.04em; }
            p { margin: 18px auto 0; max-width: 700px; color: #626b7b; font-size: 20px; line-height: 1.55; }
            .check { display: grid; place-items: center; width: 76px; height: 76px; margin: 28px auto 0; border-radius: 50%; color: #fff; background: #21a366; font-size: 36px; font-weight: 800; }
          </style>
        </head>
        <body><main>
          <span class="eyebrow">Teste ${numero} · Fim</span>
          <h1>Etapa concluída</h1>
          <p>${tituloSeguro}</p>
          <div class="check">✓</div>
          <p>${escaparHtml(proxima)}</p>
        </main></body>
      </html>
    `);
    await pausa(page, 2500);
  });
}
async function salvarPerfil(page, mensagem, erro = false) {
  // O alerta real fica aberto no navegador headed. Diálogos nativos não
  // aparecem no WebM; o erro real também é exibido na página após aceitar.
  const dialogo = page.waitForEvent('dialog');
  const clique = page.getByRole('button', { name: 'Salvar informações', exact: true }).click();
  const dialog = await dialogo;
  const recebido = dialog.message();
  await pausa(page, erro ? 7000 : 3000);
  await dialog.accept();
  await clique;
  expect(recebido).toBe(mensagem);
  if (erro) {
    await page.evaluate(texto => {
      const aviso = document.createElement('div');
      aviso.id = 'demo-erro-gamertag';
      aviso.setAttribute('role', 'alert');
      aviso.textContent = texto;
      aviso.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:9999;padding:20px 32px;background:#fee2e2;color:#991b1b;border:2px solid #ef4444;border-radius:12px;font:600 22px system-ui;box-shadow:0 8px 30px #0004';
      document.body.appendChild(aviso);
    }, recebido);
    await expect(page.locator('#demo-erro-gamertag')).toHaveText(mensagem);
    await pausa(page, 8000);
    await page.locator('#demo-erro-gamertag').evaluate(el => el.remove());
  }
}

test('Demonstração da apresentação — Alice, Professor e Administrador', async ({ page }) => {
  test.setTimeout(480000);
  await instalarTituloDaEtapa(page);
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(45000);
  let jogoHref;
  let nomeOriginal;
  const tituloJogo = 'Math Challenge';
  const heading = nome => page.getByRole('heading', { name: nome, exact: true });
  const abrirMesmoJogo = async () => {
    await scrollSuave(page);
    await page.locator(`a[href="${jogoHref}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`${jogoHref}$`));
    await expect(heading(tituloJogo)).toBeVisible();
    await pausa(page, 5000);
  };

  // Fontes remotas podem bloquear o primeiro render quando a rede externa está lenta.
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());

  await mostrarSlideInicializacao(page);

  if (RESTAURAR_AVATAR_ANTES_DA_DEMO) {
    await etapa(page, 'Preparação: restaurar avatar padrão antes da demonstração', 0, async () => {
      await expect(heading('Entrar')).toBeVisible({ timeout: 15000 });
      await login(page, 'alice@email.com', { pausaMs: 300, typingDelay: 25 });
      await page.locator('a[href="/perfil"]').click();
      await page.getByRole('button', { name: 'Editar Avatar', exact: true }).click();
      await expect(page).toHaveURL(/\/avatar$/);
      await expect(heading('Crie seu Avatar')).toBeVisible();
      await page.getByRole('button', { name: 'Resetar', exact: true }).click();
      await pausa(page, 1500);
      await page.getByRole('button', { name: 'Acessórios', exact: true }).click();
      const hat = page.getByRole('button', { name: 'hat', exact: true });
      await expect(hat).toBeVisible();
      await hat.click();
      await pausa(page, 3000);
      const dialogo = page.waitForEvent('dialog');
      const salvar = page.getByRole('button', { name: 'Salvar', exact: true }).click();
      const dialog = await dialogo;
      expect(dialog.message()).toBe('✅ Avatar salvo com sucesso!');
      await dialog.accept();
      await salvar;
      await expect.poll(() => page.evaluate(() => {
        const avatar = JSON.parse(localStorage.getItem('avatar') || '{}');
        return avatar.accessoryId;
      })).toBe('hat');
      await pausa(page, 3000);
      await logout(page);
    });
  }
  await etapa(page, 'Login por e-mail e avatar recuperado', 30, async () => {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(heading('Entrar')).toBeVisible({ timeout: 15000 });
    await pausa(page, 7000);
    await login(page, 'alice@email.com');
    await expect.poll(() => page.evaluate(() => {
      const raw = localStorage.getItem('avatar');
      return raw ? Object.keys(JSON.parse(raw)).length : 0;
    })).toBeGreaterThan(0);
    const perfil = page.locator('a[href="/perfil"]');
    await expect(perfil).toContainText('alice');
    await expect(perfil.locator('svg[viewBox="0 0 200 200"]')).toBeVisible();
    await perfil.hover();
    await pausa(page, 6000);
  });

  await etapa(page, 'Home: busca, Mais populares e Continue jogando', 65, async () => {
    const busca = page.getByPlaceholder('Buscar jogos, temas ou disciplinas...');
    await escrever(busca, tituloJogo);
    await pausa(page, 2000);
    await busca.press('Enter');
    await expect(page).toHaveURL(/busca=Math%20Challenge/);
    await scrollSuave(page, page.getByRole('heading', { name: /Resultados para/ }));
    await expect(heading(tituloJogo)).toBeVisible();
    await pausa(page, 5000);

    await voltarAoTopo(page);
    await busca.fill('');
    await busca.press('Enter');
    await expect(page).toHaveURL(/\/home$/);
    await scrollSuave(page, heading('Mais populares'));
    await pausa(page, 5000);
    jogoHref = await page.locator('a').filter({ has: heading(tituloJogo) }).getAttribute('href');
    expect(jogoHref).toMatch(/^\/games\/\d+$/);
    await scrollSuave(page, heading('Continue jogando'));
    await pausa(page, 5000);

    await voltarAoTopo(page);
    await page.getByRole('link', { name: 'Biblioteca', exact: true }).click();
    await expect(page).toHaveURL(/\/games$/);
    await expect(page.getByRole('img', { name: 'Math Challenge' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Memory Master' })).toBeVisible();
    await pausa(page, 5000);

    await voltarAoTopo(page);
    await page.locator('a[href="/amigos"]').click();
    await expect(page).toHaveURL(/\/amigos$/);
    await expect(page.getByRole('heading', { name: /Amigos/ })).toBeVisible();
    await expect(page.getByPlaceholder('Buscar usuário pelo gamertag...')).toBeVisible();
    await pausa(page, 5000);

    await page.locator('a[href="/home"]').first().click();
    await expect(page).toHaveURL(/\/home$/);
    await expect(heading('Mais populares')).toBeVisible();
    await voltarAoTopo(page);
    await rolarAteFim(page);
    await voltarAoTopo(page);
  });

  await etapa(page, 'Detalhe: desempenho, histórico e ranking dos amigos', 50, async () => {
    await abrirMesmoJogo();
    await scrollSuave(page, heading('Sobre o jogo'));
    await pausa(page, 6000);
    await scrollSuave(page, heading('Meu desempenho'));
    await expect(page.getByText('Partidas', { exact: true })).toBeVisible();
    await pausa(page, 8000);
    await scrollSuave(page, heading('Histórico de partidas'));
    await expect(page.getByText('500 pts', { exact: true })).toBeVisible();
    await pausa(page, 8000);
    await scrollSuave(page, heading('Ranking dos amigos'));
    await expect(page.getByText('@bob', { exact: true })).toBeVisible();
    await expect(page.getByText('@carol', { exact: true })).toBeVisible();
    await pausa(page, 8000);
  });

  await etapa(page, 'Perfil: persistência e Gamertag duplicada sem distinguir caixa', 75, async () => {
    await scrollSuave(page);
    await page.locator('a[href="/perfil"]').click();
    const nome = page.getByPlaceholder('Nome completo', { exact: true });
    const gamertag = page.getByPlaceholder('Nome de usuário', { exact: true });
    await expect(nome).toBeDisabled();
    nomeOriginal = await nome.inputValue();
    const nomeDemo = nomeOriginal === 'Alice Silva Demonstração' ? 'Alice Silva' : 'Alice Silva Demonstração';
    await pausa(page, 4000);
    await page.getByRole('button', { name: 'Editar informações', exact: true }).click();
    await escrever(nome, nomeDemo);
    await pausa(page, 3000);
    await salvarPerfil(page, 'Dados atualizados com sucesso!');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
    await expect(nome).toHaveValue(nomeDemo);
    await pausa(page, 5000);
    // Novo login prova recuperação do servidor, além do cache após reload.
    await logout(page);
    await login(page, 'alice@email.com');
    await page.locator('a[href="/perfil"]').click();
    await expect(nome).toHaveValue(nomeDemo);
    await pausa(page, 5000);
    await page.getByRole('button', { name: 'Editar informações', exact: true }).click();
    await escrever(gamertag, 'BOB'); // bob já existe no seed; ALICE seria a própria conta.
    await pausa(page, 3000);
    await salvarPerfil(page, 'Gamertag já está em uso', true);
    await expect(gamertag).toBeEnabled();
    // Descarta a tentativa e restaura o nome para permitir novas gravações.
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 45000 });
    await expect(gamertag).toHaveValue('alice');
    await page.getByRole('button', { name: 'Editar informações', exact: true }).click();
    await nome.fill(nomeOriginal);
    await salvarPerfil(page, 'Dados atualizados com sucesso!');
    await expect(nome).toHaveValue(nomeOriginal);
  });

  await etapa(page, 'Perfil da professora prof_ana e acesso ao mesmo jogo', 40, async () => {
    await logout(page);
    await login(page, 'prof_ana');
    await expect(page.locator('a[href="/perfil"]')).toContainText('prof_ana');
    await page.locator('a[href="/perfil"]').click();
    await expect(page).toHaveURL(/\/perfil$/);
    await expect(page.getByPlaceholder('Nome completo', { exact: true })).toHaveValue('Ana Ribeiro');
    await expect(page.getByPlaceholder('E-mail', { exact: true })).toHaveValue('ana@email.com');
    await expect(page.getByPlaceholder('Nome de usuário', { exact: true })).toHaveValue('prof_ana');
    expect(await page.evaluate(() => localStorage.getItem('perfil_usuario'))).toBe('Professor');
    await pausa(page, 8000);
    await page.goto(`${URL}/home`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await expect(page).toHaveURL(/\/home$/);
    await abrirMesmoJogo();
    await scrollSuave(page, heading('Atividades'));
    await expect(page.getByRole('button', { name: 'Criar atividade', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Jogar', exact: true })).toHaveCount(0);
    await pausa(page, 7000);
  });
  await etapa(page, 'Administrador no mesmo jogo', 30, async () => {
    await logout(page);
    await login(page, 'admin');
    await expect(page.locator('a[href="/perfil"]')).toContainText('admin');
    await abrirMesmoJogo();
    await expect(page.getByRole('button', { name: 'Testar jogo', exact: true })).toBeVisible();
    await scrollSuave(page, heading('Desempenho de teste'));
    await expect(page.getByText('Pontuações do Administrador servem apenas para teste e não entram no ranking.', { exact: true })).toBeVisible();
    await expect(heading('Ranking dos amigos')).toHaveCount(0);
    await pausa(page, 7000);
  });

});







