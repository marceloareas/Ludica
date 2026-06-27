const db = require('./src/db/db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log('🌱 Iniciando seed avançado...');

    // ---------------- CLEAN ----------------
    await db.query(`
      TRUNCATE amizade,
      historico_partida,
      pontuacao,
      avatare,
      jogo,
      usuario
      RESTART IDENTITY CASCADE;
    `);

    console.log('🧹 Banco limpo');

    const senha = await bcrypt.hash('123456', 10);

    // ---------------- USUÁRIOS ----------------
    const usuario = await db.query(`
      INSERT INTO usuario (
        nome_usuario,
        email,
        data_nascimento,
        senha,
        nome_completo,
        tipo_usuario,
        flag_usuario
      )
      VALUES
      ('alice', 'alice@email.com', '2000-01-01', $1, 'Alice Silva', 'Jogador', 'A'),
      ('bob', 'bob@email.com', '2001-02-10', $1, 'Bob Santos', 'Jogador', 'A'),
      ('carol', 'carol@email.com', '1999-05-20', $1, 'Carol Lima', 'Jogador', 'A'),
      ('david', 'david@email.com', '2002-08-15', $1, 'David Souza', 'Jogador', 'A'),
      ('admin', 'admin@email.com', '1990-01-01', $1, 'Admin Master', 'Administrador', 'A')
      RETURNING *;
    `, [senha]);

    const [alice, bob, carol, david, admin] = usuario.rows;

    console.log('👤 Usuários criados');

    // ---------------- AVATARE ----------------
    await db.query(`
      INSERT INTO avatare (id_usuario, aparencia_json)
      VALUES
      ($1, '{"cabelo":"azul","roupa":"armadura","olhos":"verde"}'),
      ($2, '{"cabelo":"preto","roupa":"casual","olhos":"castanho"}'),
      ($3, '{"cabelo":"loiro","roupa":"mago","olhos":"azul"}'),
      ($4, '{"cabelo":"ruivo","roupa":"ninja","olhos":"preto"}'),
      ($5, '{"cabelo":"branco","roupa":"terno","olhos":"vermelho"}');
    `, [
      alice.id_usuario,
      bob.id_usuario,
      carol.id_usuario,
      david.id_usuario,
      admin.id_usuario
    ]);

    console.log('🎭 Avatare criados');

    // ---------------- JOGO ----------------
    const jogo = await db.query(`
      INSERT INTO jogo (
        codigo_jogo,
        titulo,
        descricao,
        url_recurso,
        url_imagem,

        id_admin_criador,
        data_criacao
      )
      VALUES
      ('G001', 'Math Challenge', 'Matemática divertida', 'https://game1.com', '\\images\\1.jpeg', $1, NOW()),
      ('G002', 'Memory Master', 'Jogo de memória avançado', 'https://game2.com', '\\images\\2.jpeg', $1, NOW()),
      ('G003', 'Typing Speed', 'Teste de digitação', 'https://game3.com', '\\images\\3.jpeg', $1, NOW()),
      RETURNING *;
    `, [admin.id_usuario]);

    const [game1, game2, game3] = jogo.rows;

    console.log('🎮 Jogo criados');

    // ---------------- PONTUAÇÃO ----------------
    await db.query(`
      INSERT INTO pontuacao (id_usuario, id_jogo, pontos_acumulados)
      VALUES
      ($1, $5, 1500),
      ($2, $5, 2300),
      ($3, $5, 900),
      ($4, $5, 1800),

      ($1, $6, 1200),
      ($2, $6, 3000),
      ($3, $6, 1100),
      ($4, $6, 500),

      ($1, $7, 700),
      ($2, $7, 400),
      ($3, $7, 2500),
      ($4, $7, 1900),

      ($1, $8, 1000),
      ($2, $8, 800),
      ($3, $8, 600),
      ($4, $8, 2700);
    `, [
      alice.id_usuario,
      bob.id_usuario,
      carol.id_usuario,
      david.id_usuario,
      game1.id_jogo,
      game2.id_jogo,
      game3.id_jogo,
    ]);

    console.log('🏆 Pontuação criada');

    // ---------------- HISTÓRICO (MUITO COMPLETO) ----------------
    await db.query(`
      INSERT INTO historico_partida (
        id_usuario,
        id_jogo,
        pontos_obtidos
      )
      VALUES

      -- GAME 1
      ($1, $5, 200),
      ($1, $5, 500),
      ($2, $5, 800),
      ($3, $5, 300),
      ($4, $5, 700),

      -- GAME 2
      ($1, $6, 600),
      ($2, $6, 1000),
      ($3, $6, 400),
      ($4, $6, 200),

      -- GAME 3
      ($1, $7, 300),
      ($2, $7, 150),
      ($3, $7, 1200),
      ($4, $7, 900),

      -- GAME 4
      ($1, $8, 500),
      ($2, $8, 450),
      ($3, $8, 350),
      ($4, $8, 1400),

      -- PARTIDAS EXTRAS (REALISMO)
      ($1, $5, 100),
      ($2, $6, 200),
      ($3, $7, 300),
      ($4, $8, 600);
    `, [
      alice.id_usuario,
      bob.id_usuario,
      carol.id_usuario,
      david.id_usuario,
      game1.id_jogo,
      game2.id_jogo,
      game3.id_jogo,
    ]);

    console.log('📜 Histórico completo criado');
    process.exit();

  } catch (err) {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
  }
}

seed();