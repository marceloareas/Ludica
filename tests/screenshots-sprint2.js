const { chromium, request } = require("playwright");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

/*
 * ============================================================
 * CONFIGURAÇÃO
 * ============================================================
 */

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:3000";

const OUTPUT_DIR = path.join(
  __dirname,
  "screenshots",
  "sprint2"
);

/*
 * Mantém os usuários criados no banco após a execução.
 *
 * Recomendado para as evidências oficiais da Sprint 2,
 * pois permite repetir manualmente os testes com as
 * mesmas contas.
 */
const KEEP_TEST_USERS = true;


/*
 * ============================================================
 * DADOS DOS USUÁRIOS
 * ============================================================
 */

const timestamp = Date.now();

const aluno = {
  nome: "Aluno Teste Sprint 2",
  gamertag: `aluno_sprint2_${timestamp}`,
  email: `aluno.sprint2.${timestamp}@teste.com`,
  nascimento: "2000-05-10",
  senha: "Teste123!",
  perfil: "Aluno",
  tipo_usuario: "Usuario",
};

const professor = {
  nome: "Professor Teste Sprint 2",
  gamertag: `professor_sprint2_${timestamp}`,
  email: `professor.sprint2.${timestamp}@teste.com`,
  nascimento: "1985-03-15",
  senha: "Teste123!",
  perfil: "Professor",
  tipo_usuario: "Usuario",
};


/*
 * ============================================================
 * UTILITÁRIOS
 * ============================================================
 */

function logStep(texto) {
  console.log(
    "\n============================================================"
  );

  console.log(texto);

  console.log(
    "============================================================"
  );
}


function ensureOutputDirectory() {
  fs.mkdirSync(
    OUTPUT_DIR,
    {
      recursive: true,
    }
  );
}


async function screenshot(
  page,
  filename,
  fullPage = true
) {
  const filePath = path.join(
    OUTPUT_DIR,
    filename
  );

  await page.screenshot({
    path: filePath,
    fullPage,
  });

  console.log(
    `SCREENSHOT: ${filename}`
  );
}


async function waitPage(page) {
  await page.waitForLoadState(
    "domcontentloaded"
  );

  await page.waitForTimeout(500);
}


/*
 * ============================================================
 * LOCALIZADORES FLEXÍVEIS
 * ============================================================
 */

async function firstVisible(
  page,
  selectors
) {
  for (const selector of selectors) {
    const locator =
      page.locator(selector).first();

    if (
      await locator
        .isVisible()
        .catch(() => false)
    ) {
      return locator;
    }
  }

  return null;
}


async function preencherNome(
  page,
  value
) {
  const input =
    await firstVisible(
      page,
      [
        'input[name="name"]',
        'input[name="nome"]',
        'input[name="nome_completo"]',
        'input[placeholder*="Nome completo" i]',
        'input[placeholder*="nome completo" i]',
      ]
    );

  if (!input) {
    throw new Error(
      "Campo Nome completo não encontrado."
    );
  }

  await input.fill(value);
}


async function preencherGamertag(
  page,
  value
) {
  const input =
    await firstVisible(
      page,
      [
        'input[name="userName"]',
        'input[name="username"]',
        'input[name="nome_usuario"]',
        'input[placeholder*="Gamertag" i]',
        'input[placeholder*="usuário" i]',
        'input[placeholder*="usuario" i]',
      ]
    );

  if (!input) {
    throw new Error(
      "Campo Gamertag não encontrado."
    );
  }

  await input.fill(value);
}


async function preencherEmail(
  page,
  value
) {
  const input =
    await firstVisible(
      page,
      [
        'input[type="email"]',
        'input[name="email"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="e-mail" i]',
      ]
    );

  if (!input) {
    throw new Error(
      "Campo e-mail não encontrado."
    );
  }

  await input.fill(value);
}


async function preencherNascimento(
  page,
  value
) {
  const input =
    await firstVisible(
      page,
      [
        'input[type="date"]',
        'input[name="birthDate"]',
        'input[name="data_nascimento"]',
        'input[placeholder*="nascimento" i]',
      ]
    );

  if (!input) {
    throw new Error(
      "Campo data de nascimento não encontrado."
    );
  }

  await input.fill(value);
}


async function preencherSenhas(
  page,
  value
) {
  const inputs =
    page.locator(
      'input[type="password"]'
    );

  const count =
    await inputs.count();

  if (count === 0) {
    throw new Error(
      "Campo de senha não encontrado."
    );
  }

  for (
    let i = 0;
    i < count;
    i++
  ) {
    await inputs
      .nth(i)
      .fill(value);
  }
}


async function selecionarPerfil(
  page,
  perfil
) {
  const select =
    await firstVisible(
      page,
      [
        'select[name="perfil_usuario"]',
        'select[name="perfilUsuario"]',
        "select",
      ]
    );

  if (!select) {
    throw new Error(
      "Seleção de perfil não encontrada."
    );
  }

  await select.selectOption(
    perfil
  );
}


async function preencherCadastro(
  page,
  usuario
) {
  await preencherNome(
    page,
    usuario.nome
  );

  await preencherGamertag(
    page,
    usuario.gamertag
  );

  await preencherEmail(
    page,
    usuario.email
  );

  await preencherNascimento(
    page,
    usuario.nascimento
  );

  await preencherSenhas(
    page,
    usuario.senha
  );

  await selecionarPerfil(
    page,
    usuario.perfil
  );
}


async function botaoCadastrar(
  page
) {
  const candidates = [
    page.getByRole(
      "button",
      {
        name:
          /cadastrar|criar conta|registrar/i,
      }
    ),

    page.locator(
      'button[type="submit"]'
    ),
  ];

  for (
    const candidate of candidates
  ) {
    if (
      await candidate
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      return candidate.first();
    }
  }

  throw new Error(
    "Botão de cadastro não encontrado."
  );
}


async function abrirCadastro(page) {
  await page.goto(
    `${FRONTEND_URL}/register`
  );

  await waitPage(page);

  const hasEmail =
    await page
      .locator(
        'input[type="email"]'
      )
      .count();

  if (hasEmail === 0) {
    await page.goto(
      FRONTEND_URL
    );

    await waitPage(page);

    const link =
      page.getByText(
        /criar uma conta|cadastre-se|cadastrar|registro/i
      ).first();

    if (
      await link
        .isVisible()
        .catch(() => false)
    ) {
      await link.click();

      await waitPage(page);
    }
  }
}


/*
 * ============================================================
 * LOGIN
 * ============================================================
 */

async function abrirLogin(page) {
  await page.goto(
    `${FRONTEND_URL}/login`
  );

  await waitPage(page);

  const passwords =
    await page
      .locator(
        'input[type="password"]'
      )
      .count();

  if (passwords === 0) {
    await page.goto(
      FRONTEND_URL
    );

    await waitPage(page);
  }
}


async function preencherLogin(
  page,
  usuario
) {
  const gamertag =
    await firstVisible(
      page,
      [
        'input[name="userName"]',
        'input[name="username"]',
        'input[name="nome_usuario"]',
        'input[placeholder*="Gamertag" i]',
        'input[placeholder*="usuário" i]',
        'input[placeholder*="usuario" i]',
        'input[type="text"]',
      ]
    );

  if (!gamertag) {
    throw new Error(
      "Campo Gamertag do login não encontrado."
    );
  }

  await gamertag.fill(
    usuario.gamertag
  );

  const password =
    page
      .locator(
        'input[type="password"]'
      )
      .first();

  if (
    !await password
      .isVisible()
      .catch(() => false)
  ) {
    throw new Error(
      "Campo de senha do login não encontrado."
    );
  }

  await password.fill(
    usuario.senha
  );
}


async function clicarLogin(page) {
  const button =
    page
      .getByRole(
        "button",
        {
          name:
            /entrar|login|acessar/i,
        }
      )
      .first();

  if (
    await button
      .isVisible()
      .catch(() => false)
  ) {
    await button.click();
  } else {
    await page
      .locator(
        'button[type="submit"]'
      )
      .first()
      .click();
  }

  await page.waitForTimeout(1000);
}


/*
 * ============================================================
 * CADASTRO PELA INTERFACE
 * ============================================================
 */

async function cadastrarUsuario(
  page,
  usuario,
  prefix
) {
  logStep(
    `CADASTRO: ${usuario.perfil}`
  );

  await abrirCadastro(page);

  await screenshot(
    page,
    `${prefix}-01-cadastro-vazio.png`
  );

  await preencherCadastro(
    page,
    usuario
  );

  await screenshot(
    page,
    `${prefix}-02-cadastro-preenchido.png`
  );

  const registerButton =
    await botaoCadastrar(page);

  const responsePromise =
    page.waitForResponse(
      response =>
        response.url()
          .includes("/users/register") &&
        response.request()
          .method() === "POST",
      {
        timeout: 10000,
      }
    );

  await registerButton.click();

  const response =
    await responsePromise;

  const status =
    response.status();

  if (
    status < 200 ||
    status >= 300
  ) {
    const body =
      await response.text();

    throw new Error(
      `Falha no cadastro de ${usuario.perfil}: ` +
      `HTTP ${status} - ${body}`
    );
  }

  const body =
    await response
      .json()
      .catch(() => ({}));

  usuario.id =
    body.id_usuario ||
    body.id ||
    body.user?.id ||
    null;

  console.log(
    `${usuario.perfil} cadastrado com sucesso.`
  );

  console.log(
    `Gamertag: ${usuario.gamertag}`
  );

  console.log(
    `E-mail: ${usuario.email}`
  );

  console.log(
    `Senha: ${usuario.senha}`
  );

  if (usuario.id) {
    console.log(
      `ID: ${usuario.id}`
    );
  }

  await page.waitForTimeout(700);

  await screenshot(
    page,
    `${prefix}-03-cadastro-concluido.png`
  );
}


/*
 * ============================================================
 * LOGIN E VALIDAÇÃO DA SESSÃO
 * ============================================================
 */

async function loginUsuario(
  page,
  usuario,
  prefix
) {
  logStep(
    `LOGIN: ${usuario.perfil}`
  );

  await abrirLogin(page);

  await screenshot(
    page,
    `${prefix}-04-login-vazio.png`
  );

  await preencherLogin(
    page,
    usuario
  );

  await screenshot(
    page,
    `${prefix}-05-login-preenchido.png`
  );

  await clicarLogin(page);

  await waitPage(page);

  const session =
    await page.evaluate(() => ({
      id:
        localStorage.getItem(
          "id_user"
        ),

      tipo:
        localStorage.getItem(
          "tipo_usuario"
        ),

      perfil:
        localStorage.getItem(
          "perfil_usuario"
        ),

      token:
        localStorage.getItem(
          "token"
        ),

      avatar:
        localStorage.getItem(
          "avatar"
        ),
    }));

  console.log(
    "Sessão:",
    session
  );

  assert.ok(
    session.id,
    "id_user não foi salvo no localStorage."
  );

  assert.ok(
    session.token,
    "Token não foi salvo no localStorage."
  );

  assert.strictEqual(
    session.tipo,
    "Usuario",
    `${usuario.perfil}: tipo_usuario incorreto.`
  );

  assert.strictEqual(
    session.perfil,
    usuario.perfil,
    `${usuario.perfil}: perfil_usuario incorreto.`
  );

  if (!usuario.id) {
    usuario.id =
      Number(session.id);
  }

  usuario.avatar_localstorage =
    session.avatar;

  await screenshot(
    page,
    `${prefix}-06-home.png`
  );
}


/*
 * ============================================================
 * CRIAR HISTÓRICO PARA O ALUNO
 * ============================================================
 */

async function prepararHistoricoAluno(
  api,
  usuario,
  idJogo = 1
) {
  logStep(
    "PREPARANDO HISTÓRICO DO ALUNO"
  );

  const pontos = [
    200,
    500,
    350,
  ];

  for (
    const pontuacao of pontos
  ) {
    const response =
      await api.post(
        `${BACKEND_URL}/history`,
        {
          data: {
            id_usuario:
              usuario.id,

            id_jogo:
              idJogo,

            pontos_obtidos:
              pontuacao,
          },
        }
      );

    assert.strictEqual(
      response.status(),
      201,
      `Não foi possível registrar ` +
      `a partida ${pontuacao}. ` +
      `HTTP ${response.status()}`
    );

    console.log(
      `Partida criada: ${pontuacao} pontos`
    );
  }
}


/*
 * ============================================================
 * BIBLIOTECA DO ALUNO
 * ============================================================
 */

async function validarBibliotecaAluno(
  page
) {
  logStep(
    "VALIDAÇÃO: BIBLIOTECA DO ALUNO"
  );

  await page.goto(
    `${FRONTEND_URL}/games`
  );

  await waitPage(page);

  const body =
    await page
      .locator("body")
      .innerText();

  assert.match(
    body,
    /Melhor pontuação/i,
    "Biblioteca do Aluno não apresenta Melhor pontuação."
  );

  assert.match(
    body,
    /Jogar/i,
    "Biblioteca do Aluno não apresenta botão Jogar."
  );

  assert.ok(
    !body.includes(
      "Ambiente de atividades"
    ),
    "Aluno não deveria visualizar Ambiente de atividades."
  );

  await screenshot(
    page,
    "aluno-07-biblioteca.png"
  );
}


/*
 * ============================================================
 * DETALHE DO JOGO - ALUNO
 * ============================================================
 */

async function validarDetalheAluno(
  page
) {
  logStep(
    "VALIDAÇÃO: DETALHAMENTO DO ALUNO"
  );

  await page.goto(
    `${FRONTEND_URL}/games/1`
  );

  await waitPage(page);

  const body =
    await page
      .locator("body")
      .innerText();

  assert.match(
    body,
    /Tempo estimado/i
  );

  assert.match(
    body,
    /Faixa etária/i
  );

  assert.match(
    body,
    /Jogadores/i
  );

  assert.match(
    body,
    /Seu Desempenho/i
  );

  assert.match(
    body,
    /Histórico de Partidas/i
  );

  assert.match(
    body,
    /Ranking de Amigos/i
  );

  assert.match(
    body,
    /Melhor pontuação/i
  );

  assert.match(
    body,
    /Partidas realizadas/i
  );

  assert.match(
    body,
    /500/,
    "Melhor pontuação 500 não encontrada."
  );

  await screenshot(
    page,
    "aluno-08-detalhe-topo.png",
    false
  );

  await screenshot(
    page,
    "aluno-09-detalhe-completo.png",
    true
  );

  const desempenho =
    page.getByText(
      "Seu Desempenho"
    ).first();

  if (
    await desempenho
      .isVisible()
      .catch(() => false)
  ) {
    await desempenho
      .scrollIntoViewIfNeeded();

    await page.waitForTimeout(300);

    await screenshot(
      page,
      "aluno-10-desempenho.png",
      false
    );
  }

  const historico =
    page.getByText(
      "Histórico de Partidas"
    ).first();

  if (
    await historico
      .isVisible()
      .catch(() => false)
  ) {
    await historico
      .scrollIntoViewIfNeeded();

    await page.waitForTimeout(300);

    await screenshot(
      page,
      "aluno-11-historico.png",
      false
    );
  }

  const ranking =
    page.getByText(
      "Ranking de Amigos"
    ).first();

  if (
    await ranking
      .isVisible()
      .catch(() => false)
  ) {
    await ranking
      .scrollIntoViewIfNeeded();

    await page.waitForTimeout(300);

    await screenshot(
      page,
      "aluno-12-ranking.png",
      false
    );
  }
}


/*
 * ============================================================
 * PERFIL DO ALUNO
 * ============================================================
 */

async function capturarPerfilAluno(
  page
) {
  logStep(
    "CAPTURA: PERFIL DO ALUNO"
  );

  await page.goto(
    `${FRONTEND_URL}/games`
  );

  await waitPage(page);

  const perfilLink =
    page.getByText(
      /^PERFIL$/i
    ).first();

  if (
    await perfilLink
      .isVisible()
      .catch(() => false)
  ) {
    await perfilLink.click();

    await waitPage(page);

    await screenshot(
      page,
      "aluno-13-perfil.png"
    );
  } else {
    console.log(
      "AVISO: link PERFIL não localizado."
    );
  }
}


/*
 * ============================================================
 * TESTE DE ERRO - GAMERTAG DUPLICADA
 * ============================================================
 */

async function validarGamertagDuplicada(
  page,
  usuario
) {
  logStep(
    "VALIDAÇÃO DE ERRO: GAMERTAG DUPLICADA"
  );

  await page.evaluate(() => {
    localStorage.clear();
  });

  await abrirCadastro(page);

  const duplicado = {
    ...usuario,

    nome:
      "Aluno Gamertag Duplicada",

    email:
      `duplicado.${Date.now()}@teste.com`,
  };

  await preencherCadastro(
    page,
    duplicado
  );

  await screenshot(
    page,
    "aluno-14-gamertag-duplicada-preenchido.png"
  );

  const registerButton =
    await botaoCadastrar(page);

  const responsePromise =
    page.waitForResponse(
      response =>
        response.url()
          .includes(
            "/users/register"
          ) &&
        response.request()
          .method() === "POST",
      {
        timeout: 10000,
      }
    );

  await registerButton.click();

  const response =
    await responsePromise;

  console.log(
    `HTTP recebido: ${response.status()}`
  );

  assert.strictEqual(
    response.status(),
    400,
    "Gamertag duplicada deveria retornar HTTP 400."
  );

  const responseBody =
    await response
      .text()
      .catch(() => "");

  console.log(
    `Resposta: ${responseBody}`
  );

  /*
   * A interface deve apresentar:
   *
   * <div role="alert">
   *   Gamertag já está em uso
   * </div>
   *
   * A screenshot do erro só é realizada
   * depois que o alerta estiver visível.
   */
  const mensagemErro =
    page
      .getByRole("alert")
      .first();

  await mensagemErro.waitFor({
    state: "visible",
    timeout: 5000,
  });

  const textoErro =
    (
      await mensagemErro.innerText()
    ).trim();

  console.log(
    `Mensagem exibida na interface: ${textoErro}`
  );

  assert.match(
    textoErro,
    /Gamertag já está em uso/i,
    "A mensagem correta de Gamertag duplicada não foi apresentada na interface."
  );

  assert.match(
    page.url(),
    /\/register/,
    "A aplicação não permaneceu na tela de cadastro após o erro."
  );

  await screenshot(
    page,
    "aluno-15-gamertag-duplicada-bloqueada.png"
  );

  console.log(
    "PASSOU: Gamertag duplicada bloqueada com HTTP 400."
  );

  console.log(
    "PASSOU: erro exibido visualmente ao usuário."
  );

  console.log(
    "PASSOU: evidência visual capturada após a apresentação do erro."
  );
}


/*
 * ============================================================
 * BIBLIOTECA DO PROFESSOR
 * ============================================================
 */

async function validarBibliotecaProfessor(
  page
) {
  logStep(
    "VALIDAÇÃO: BIBLIOTECA DO PROFESSOR"
  );

  await page.goto(
    `${FRONTEND_URL}/games`
  );

  await waitPage(page);

  const body =
    await page
      .locator("body")
      .innerText();

  assert.match(
    body,
    /Ambiente de atividades/i,
    "Professor não visualiza Ambiente de atividades."
  );

  assert.match(
    body,
    /Entrar/i,
    "Professor não visualiza botão Entrar."
  );

  assert.ok(
    !body.includes(
      "Melhor pontuação:"
    ),
    "Professor não deveria visualizar pontuação na Biblioteca."
  );

  await screenshot(
    page,
    "professor-07-biblioteca.png"
  );
}


/*
 * ============================================================
 * DETALHE DO PROFESSOR
 * ============================================================
 */

async function validarDetalheProfessor(
  page
) {
  logStep(
    "VALIDAÇÃO: DETALHAMENTO DO PROFESSOR"
  );

  await page.goto(
    `${FRONTEND_URL}/games/1`
  );

  await waitPage(page);

  const body =
    await page
      .locator("body")
      .innerText();

  assert.match(
    body,
    /Tempo estimado/i
  );

  assert.match(
    body,
    /Faixa etária/i
  );

  assert.match(
    body,
    /Jogadores/i
  );

  assert.match(
    body,
    /Atividades/i
  );

  assert.match(
    body,
    /Criar atividade/i
  );

  assert.ok(
    !body.includes(
      "Seu Desempenho"
    ),
    "Professor não deveria visualizar desempenho."
  );

  assert.ok(
    !body.includes(
      "Histórico de Partidas"
    ),
    "Professor não deveria visualizar histórico."
  );

  assert.ok(
    !body.includes(
      "Ranking de Amigos"
    ),
    "Professor não deveria visualizar ranking."
  );

  const createButton =
    page.getByRole(
      "button",
      {
        name:
          /Criar atividade/i,
      }
    ).first();

  if (
    await createButton
      .isVisible()
      .catch(() => false)
  ) {
    const disabled =
      await createButton.isDisabled();

    if (!disabled) {
      console.log(
        "AVISO: botão Criar atividade está habilitado. " +
        "A funcionalidade não será acionada pelo teste da Sprint 2."
      );
    } else {
      console.log(
        "Botão Criar atividade está preparado e desabilitado."
      );
    }
  }

  await screenshot(
    page,
    "professor-08-detalhe-topo.png",
    false
  );

  await screenshot(
    page,
    "professor-09-detalhe-completo.png",
    true
  );

  const atividades =
    page.getByText(
      /^Atividades$/i
    ).first();

  if (
    await atividades
      .isVisible()
      .catch(() => false)
  ) {
    await atividades
      .scrollIntoViewIfNeeded();

    await page.waitForTimeout(300);

    await screenshot(
      page,
      "professor-10-atividades.png",
      false
    );
  }
}


/*
 * ============================================================
 * TESTE DE ERRO DE API
 * PROFESSOR NÃO PODE REGISTRAR PARTIDA
 * ============================================================
 */

async function validarBloqueioProfessor(
  api,
  usuario
) {
  logStep(
    "VALIDAÇÃO DE ERRO: PROFESSOR NÃO PODE JOGAR"
  );

  const response =
    await api.post(
      `${BACKEND_URL}/history`,
      {
        data: {
          id_usuario:
            usuario.id,

          id_jogo:
            1,

          pontos_obtidos:
            9999,
        },
      }
    );

  console.log(
    `Status HTTP: ${response.status()}`
  );

  const body =
    await response.text();

  console.log(
    `Resposta: ${body}`
  );

  assert.strictEqual(
    response.status(),
    403,
    "Professor deveria ser bloqueado com HTTP 403."
  );

  assert.match(
    body,
    /Professor não pode participar de partidas/i,
    "Mensagem de bloqueio do Professor não encontrada."
  );

  console.log(
    "PASSOU: Professor bloqueado corretamente pela API."
  );
}


/*
 * ============================================================
 * PERFIL DO PROFESSOR
 * ============================================================
 */

async function capturarPerfilProfessor(
  page
) {
  logStep(
    "CAPTURA: PERFIL DO PROFESSOR"
  );

  await page.goto(
    `${FRONTEND_URL}/games`
  );

  await waitPage(page);

  const perfilLink =
    page.getByText(
      /^PERFIL$/i
    ).first();

  if (
    await perfilLink
      .isVisible()
      .catch(() => false)
  ) {
    await perfilLink.click();

    await waitPage(page);

    await screenshot(
      page,
      "professor-11-perfil.png"
    );
  } else {
    console.log(
      "AVISO: link PERFIL não localizado."
    );
  }
}


/*
 * ============================================================
 * LIMPEZA OPCIONAL
 * ============================================================
 */

async function removerUsuario(
  api,
  usuario
) {
  if (!usuario.id) {
    return;
  }

  const response =
    await api.delete(
      `${BACKEND_URL}/users/${usuario.id}`
    );

  console.log(
    `Remoção ${usuario.gamertag}: ` +
    `HTTP ${response.status()}`
  );
}


/*
 * ============================================================
 * MANIFESTO DAS EVIDÊNCIAS
 * ============================================================
 */

function salvarManifesto() {
  const files =
    fs.readdirSync(
      OUTPUT_DIR
    )
      .filter(
        file =>
          file.endsWith(
            ".png"
          )
      )
      .sort();

  const manifest = {
    sprint:
      "Sprint 2",

    projeto:
      "Lúdica",

    gerado_em:
      new Date()
        .toISOString(),

    frontend:
      FRONTEND_URL,

    backend:
      BACKEND_URL,

    usuarios: {
      aluno: {
        id:
          aluno.id,

        nome:
          aluno.nome,

        gamertag:
          aluno.gamertag,

        email:
          aluno.email,

        data_nascimento:
          aluno.nascimento,

        tipo_usuario:
          aluno.tipo_usuario,

        perfil:
          aluno.perfil,

        senha:
          aluno.senha,
      },

      professor: {
        id:
          professor.id,

        nome:
          professor.nome,

        gamertag:
          professor.gamertag,

        email:
          professor.email,

        data_nascimento:
          professor.nascimento,

        tipo_usuario:
          professor.tipo_usuario,

        perfil:
          professor.perfil,

        senha:
          professor.senha,
      },
    },

    requisitos_sprint2: [
      "Unicidade da Gamertag",

      "Uso do usuário autenticado no histórico e ranking",

      "Persistência das alterações dos dados do Perfil",

      "Recuperação automática do avatar no login",

      "Melhorias na tela de detalhamento do jogo",

      "Diferenciação entre os perfis Aluno e Professor",

      "Permissões de participação em partidas",

      "Regras de participação no ranking",

      "Biblioteca diferenciada conforme o perfil",

      "Preparação da área de atividades do Professor"
    ],

    dados_teste_aluno: {
      jogo:
        1,

      pontuacoes: [
        200,
        500,
        350
      ],

      quantidade_partidas:
        3,

      melhor_pontuacao:
        500,
    },

    validacoes_erro: {
      gamertag_duplicada: {
        status_http_esperado:
          400,

        mensagem_interface_esperada:
          "Gamertag já está em uso",

        screenshot_antes:
          "aluno-14-gamertag-duplicada-preenchido.png",

        screenshot_depois:
          "aluno-15-gamertag-duplicada-bloqueada.png",

        observacao:
          "A evidência principal é capturada somente após a mensagem de erro estar visível na interface."
      },

      professor_registro_partida: {
        status_http_esperado:
          403,

        mensagem_esperada:
          "Professor não pode participar de partidas",

        tipo_validacao:
          "API",

        screenshot:
          false,

        observacao:
          "Não há screenshot porque o erro é validado diretamente na API e não é apresentado pela interface."
      },
    },

    validacoes_professor: {
      pode_registrar_partida:
        false,

      status_esperado_registro_partida:
        403,

      participa_ranking:
        false,

      visualiza_historico:
        false,

      visualiza_desempenho:
        false,

      ambiente_atividades:
        true,

      criar_atividade_implementado:
        false,
    },

    trabalhos_futuros_indicados_professor: [
      "Visualização dos perfis dos amigos, podendo visualizar avatares e pontuações nos jogos",

      "Implementação do comportamento específico do perfil Administrador",

      "Integração dos jogos como aplicações separadas por API",

      "Loja de itens para Avatar utilizando pontos",

      "Sistema de conquistas"
    ],

    melhorias_identificadas_sprint2: [
      "Melhorar a identificação persistente do usuário autenticado no cabeçalho global, exibindo avatar, Gamertag e perfil"
    ],

    observacoes: [
      "Os usuários criados são exclusivamente contas locais de teste.",

      "As credenciais foram mantidas para permitir a reprodução manual das evidências.",

      "Em testes de erro da interface, a screenshot de evidência é realizada somente depois que a mensagem de erro está visível.",

      "Erros validados exclusivamente pela API não geram screenshots artificiais da interface.",

      "As funcionalidades futuras indicadas pelo professor não fazem parte da validação funcional desta Sprint."
    ],

    screenshots:
      files,
  };

  fs.writeFileSync(
    path.join(
      OUTPUT_DIR,
      "manifest.json"
    ),

    JSON.stringify(
      manifest,
      null,
      2
    ),

    "utf8"
  );

  console.log(
    "Manifesto salvo: manifest.json"
  );
}


/*
 * ============================================================
 * EXECUÇÃO PRINCIPAL
 * ============================================================
 */

async function main() {
  ensureOutputDirectory();

  logStep(
    "SPRINT 2 - VALIDAÇÃO VISUAL AUTOMATIZADA"
  );

  console.log(
    `Frontend: ${FRONTEND_URL}`
  );

  console.log(
    `Backend: ${BACKEND_URL}`
  );

  console.log(
    `Saída: ${OUTPUT_DIR}`
  );

  const api =
    await request.newContext();

  const browser =
    await chromium.launch({
      headless: true,
    });

  const context =
    await browser.newContext({
      viewport: {
        width: 1600,
        height: 900,
      },
    });

  const page =
    await context.newPage();

  try {

    /*
     * ========================================================
     * TELA INICIAL
     * ========================================================
     */

    logStep(
      "CAPTURA DA TELA INICIAL"
    );

    await page.goto(
      FRONTEND_URL
    );

    await waitPage(page);

    await screenshot(
      page,
      "00-tela-inicial.png"
    );


    /*
     * ========================================================
     * ALUNO
     * ========================================================
     */

    await cadastrarUsuario(
      page,
      aluno,
      "aluno"
    );

    await loginUsuario(
      page,
      aluno,
      "aluno"
    );

    await prepararHistoricoAluno(
      api,
      aluno,
      1
    );

    await validarBibliotecaAluno(
      page
    );

    await validarDetalheAluno(
      page
    );

    await capturarPerfilAluno(
      page
    );


    /*
     * ========================================================
     * TESTE DE ERRO - GAMERTAG DUPLICADA
     * ========================================================
     */

    await validarGamertagDuplicada(
      page,
      aluno
    );


    /*
     * ========================================================
     * PROFESSOR
     * ========================================================
     */

    await page.evaluate(() => {
      localStorage.clear();
    });

    await cadastrarUsuario(
      page,
      professor,
      "professor"
    );

    await loginUsuario(
      page,
      professor,
      "professor"
    );

    await validarBibliotecaProfessor(
      page
    );

    await validarDetalheProfessor(
      page
    );

    await validarBloqueioProfessor(
      api,
      professor
    );

    await capturarPerfilProfessor(
      page
    );


    /*
     * ========================================================
     * FINALIZAÇÃO
     * ========================================================
     */

    salvarManifesto();

    logStep(
      "TODAS AS VALIDAÇÕES DA SPRINT 2 PASSARAM"
    );

    console.log(
      "\nUSUÁRIOS UTILIZADOS NA SPRINT 2"
    );

    console.log(
      "\n--- ALUNO ---"
    );

    console.log(
      `ID: ${aluno.id}`
    );

    console.log(
      `Nome: ${aluno.nome}`
    );

    console.log(
      `Gamertag: ${aluno.gamertag}`
    );

    console.log(
      `E-mail: ${aluno.email}`
    );

    console.log(
      `Data de nascimento: ${aluno.nascimento}`
    );

    console.log(
      `Tipo: ${aluno.tipo_usuario}`
    );

    console.log(
      `Perfil: ${aluno.perfil}`
    );

    console.log(
      `Senha: ${aluno.senha}`
    );


    console.log(
      "\n--- PROFESSOR ---"
    );

    console.log(
      `ID: ${professor.id}`
    );

    console.log(
      `Nome: ${professor.nome}`
    );

    console.log(
      `Gamertag: ${professor.gamertag}`
    );

    console.log(
      `E-mail: ${professor.email}`
    );

    console.log(
      `Data de nascimento: ${professor.nascimento}`
    );

    console.log(
      `Tipo: ${professor.tipo_usuario}`
    );

    console.log(
      `Perfil: ${professor.perfil}`
    );

    console.log(
      `Senha: ${professor.senha}`
    );


    console.log(
      "\nScreenshots salvos em:"
    );

    console.log(
      OUTPUT_DIR
    );

    console.log(
      "\nManifesto da execução:"
    );

    console.log(
      path.join(
        OUTPUT_DIR,
        "manifest.json"
      )
    );

  } catch (error) {

    console.error(
      "\nERRO NA VALIDAÇÃO:"
    );

    console.error(
      error
    );

    await screenshot(
      page,
      "ERRO-validacao.png"
    ).catch(() => {});

    process.exitCode = 1;

  } finally {

    if (!KEEP_TEST_USERS) {

      logStep(
        "LIMPANDO USUÁRIOS DE TESTE"
      );

      await removerUsuario(
        api,
        aluno
      ).catch(() => {});

      await removerUsuario(
        api,
        professor
      ).catch(() => {});
    }

    await context.close();

    await browser.close();

    await api.dispose();
  }
}


main();