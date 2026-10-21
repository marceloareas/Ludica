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
      avatar,
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
        flag_usuario,
        perfil_usuario
      )
      VALUES
      ('alice', 'alice@email.com', '2000-01-01', $1, 'Alice Silva', 'Usuario', 'A', 'Aluno'),
      ('bob', 'bob@email.com', '2001-02-10', $1, 'Bob Santos', 'Usuario', 'A', 'Aluno'),
      ('carol', 'carol@email.com', '1999-05-20', $1, 'Carol Lima', 'Usuario', 'A', 'Aluno'),
      ('david', 'david@email.com', '2002-08-15', $1, 'David Souza', 'Usuario', 'A', 'Aluno'),
      ('admin', 'admin@email.com', '1990-01-01', $1, 'Admin Master', 'Administrador', 'A', NULL),
      ('prof_ana', 'ana@email.com', '1985-03-12', $1, 'Ana Ribeiro', 'Usuario', 'A', 'Professor')
      RETURNING *;
    `, [senha]);

    const [alice, bob, carol, david, admin] = usuario.rows;

    console.log('👤 Usuários criados');

    // ---------------- AVATAR ----------------
        await db.query(`
      INSERT INTO avatar (id_usuario, aparencia_json)
      VALUES
      ($1, '{"skinColor":"#f1c8a4","bgColor":"#bae6fd","hairId":"curto","hairColor":"#06b6d4","eyesId":"redondos","eyesColor":"#166534","mouthId":"sorriso","noseId":"redondo","outfitId":"moletom","outfitColor":"#3b82f6","accessoryId":"headphones"}'),
      ($2, '{"skinColor":"#a87248","bgColor":"#fef3c7","hairId":"raspado","hairColor":"#222","eyesId":"felizes","eyesColor":"#111","mouthId":"risada","noseId":"grande","outfitId":"t-shirt","outfitColor":"#f97316","accessoryId":"glasses"}'),
      ($3, '{"skinColor":"#fde4cf","bgColor":"#fbcfe8","hairId":"longo","hairColor":"#fde047","eyesId":"estrelas","eyesColor":"#7c3aed","mouthId":"lingua","noseId":"pequeno","outfitId":"vestido","outfitColor":"#ec4899","accessoryId":"bow"}'),
      ($4, '{"skinColor":"#d8a679","bgColor":"#bbf7d0","hairId":"afro","hairColor":"#dc2626","eyesId":"piscando","eyesColor":"#7c2d12","mouthId":"neutro","noseId":"reto","outfitId":"camisa","outfitColor":"#facc15","accessoryId":"sunglasses"}'),
      ($5, '{"skinColor":"#7a4f2b","bgColor":"#e9d5ff","hairId":"ondulado","hairColor":"#e5e5e5","eyesId":"sonolento","eyesColor":"#1e3a8a","mouthId":"o","noseId":"redondo","outfitId":"camisa","outfitColor":"#8b5cf6","accessoryId":"hat"}');
    `, [
      alice.id_usuario,
      bob.id_usuario,
      carol.id_usuario,
      david.id_usuario,
      admin.id_usuario
    ]);

    console.log('🎭 Avatar criados');

    // ---------------- JOGO ----------------
    const jogo = await db.query(`
      INSERT INTO jogo (
        codigo_jogo,
        titulo,
        descricao,
        tempo_estimado,
        faixa_etaria,
        quantidade_jogadores,
        url_recurso,
        url_imagem,
        id_admin_criador,
        data_criacao
      )
      VALUES
      ('G001', 'Math Challenge', 'Matemática divertida',
       10, '8+ anos', 1, 'https://game1.com', '/images/1.jpeg', $1, NOW()),
      ('G002', 'Memory Master', 'Jogo de memória avançado',
       8, '6+ anos', 1, 'https://game2.com', '/images/2.jpeg', $1, NOW()),
      ('G003', 'Typing Speed', 'Teste de digitação',
       5, '10+ anos', 1, 'https://game3.com', '/images/3.jpeg', $1, NOW()),
      ('G004', 'Xadrez', 'Xadrez',
       30, '8+ anos', 2, 'https://game4.com', '/images/Xadrez.png', $1, NOW())
      RETURNING *;
    `, [admin.id_usuario]);

    const [game1, game2, game3, game4] = jogo.rows;

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
      game4.id_jogo,
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
      game4.id_jogo
    ]);

    console.log('📜 Histórico completo criado');

    // ---------------- AMIZADES ----------------
    await db.query(`
      INSERT INTO amizade (id_usuario_1, id_usuario_2, status, data_conexao)
      VALUES
      ($1, $2, 'Aceito', NOW()),
      ($1, $3, 'Aceito', NOW()),
      ($2, $3, 'Aceito', NOW()),
      ($4, $1, 'Pendente', NOW());
    `, [
      alice.id_usuario,
      bob.id_usuario,
      carol.id_usuario,
      david.id_usuario
    ]);

    console.log('🤝 Amizades criadas');

    // Moedas iniciais para usuários comuns (com registro no extrato)
    await db.query(`
      WITH u AS (
        UPDATE usuario SET moedas = 100 WHERE tipo_usuario = 'Usuario' RETURNING id_usuario
      )
      INSERT INTO transacao_moeda (id_usuario, valor, motivo)
      SELECT id_usuario, 100, 'bonus_inicial' FROM u
    `);

    // Cada usuário já possui os itens que usa no avatar do seed
    await db.query(`
      INSERT INTO usuario_item (id_usuario, id_item)
      SELECT a.id_usuario, ia.id_item
      FROM avatar a
      JOIN item_avatar ia ON (a.aparencia_json::jsonb ->> ia.campo) = ia.valor
      ON CONFLICT DO NOTHING
    `);

    console.log('🪙 Moedas e itens iniciais criados');
    process.exit();

  } catch (err) {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
  }
 


}

seed();