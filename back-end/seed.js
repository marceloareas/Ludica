const db = require('./src/db/db');
const bcrypt = require('bcrypt');

async function seed() {
    try {

        console.log('🌱 Iniciando seed...');

        await db.query(`
            TRUNCATE amizade,
            historico_partidas,
            pontuacao,
            avatares,
            jogos,
            usuarios
            RESTART IDENTITY CASCADE;
        `);

        console.log('🧹 Banco limpo');

        const senhaTeste = await bcrypt.hash('senha123', 10);
        const senhaAdmin = await bcrypt.hash('admin123', 10);
        const senhaPlayer = await bcrypt.hash('player123', 10);

        const usuarios = await db.query(`
            INSERT INTO usuarios (
                nome_usuario,
                email,
                data_nascimento,
                senha,
                nome_completo,
                tipo_usuario,
                flag_usuario
            )
            VALUES
            (
                'teste',
                'teste@email.com',
                '2000-01-01',
                $1,
                'Teste User',
                'Jogador',
                'A'
            ),
            (
                'admin01',
                'admin@email.com',
                '1995-05-10',
                $2,
                'Administrador Master',
                'Administrador',
                'A'
            ),
            (
                'player01',
                'player@email.com',
                '2003-08-15',
                $3,
                'Jogador Teste',
                'Jogador',
                'A'
            )
            RETURNING *;
        `, [
            senhaTeste,
            senhaAdmin,
            senhaPlayer
        ]);

        console.log('✅ Usuários inseridos');

        const user1 = usuarios.rows[0];
        const user2 = usuarios.rows[1];
        const user3 = usuarios.rows[2];

        await db.query(`
            INSERT INTO avatares (
                id_usuario,
                aparencia_json
            )
            VALUES
            (
                $1,
                '{"cabelo":"azul","roupa":"armadura","olhos":"verde"}'
            ),
            (
                $2,
                '{"cabelo":"preto","roupa":"terno","olhos":"castanho"}'
            ),
            (
                $3,
                '{"cabelo":"loiro","roupa":"mago","olhos":"azul"}'
            );
        `, [
            user1.id_usuario,
            user2.id_usuario,
            user3.id_usuario
        ]);

        console.log('✅ Avatares inseridos');

        const jogos = await db.query(`
            INSERT INTO jogos (
                codigo_jogo,
                titulo,
                descricao,
                url_recurso,
                id_admin_criador,
                data_criacao
            )
            VALUES
            (
                'G001',
                'Math Challenge',
                'Jogo de matemática educativa',
                'https://mathgame.com',
                $1,
                NOW()
            ),
            (
                'G002',
                'Memory Game',
                'Jogo da memória',
                'https://memorygame.com',
                $1,
                NOW()
            ),
            (
                'G003',
                'Typing Speed',
                'Teste de velocidade de digitação',
                'https://typinggame.com',
                $1,
                NOW()
            )
            RETURNING *;
        `, [user2.id_usuario]);

        console.log('✅ Jogos inseridos');

        const jogo1 = jogos.rows[0];
        const jogo2 = jogos.rows[1];
        const jogo3 = jogos.rows[2];

        await db.query(`
            INSERT INTO pontuacao (
                id_usuario,
                id_jogo,
                pontos_acumulados
            )
            VALUES
            ($1, $2, 1500),
            ($3, $2, 3000),
            ($1, $4, 900),
            ($3, $5, 4500);
        `, [
            user1.id_usuario,
            jogo1.id_jogo,
            user3.id_usuario,
            jogo2.id_jogo,
            jogo3.id_jogo
        ]);

        console.log('✅ Pontuações inseridas');

        // HISTÓRICO
        await db.query(`
            INSERT INTO historico_partidas (
                id_usuario,
                id_jogo,
                pontos_obtidos
            )
            VALUES

            -- USER 1
            ($1, $2, 500),
            ($1, $2, 1000),
            ($1, $3, 900),

            -- USER 3
            ($4, $2, 750),
            ($4, $5, 3000),
            ($4, $3, 1200),

            -- MAIS HISTÓRICO
            ($1, $5, 450),
            ($4, $3, 2000);
        `, [
            user1.id_usuario, // $1
            jogo1.id_jogo,    // $2
            jogo2.id_jogo,    // $3
            user3.id_usuario, // $4
            jogo3.id_jogo     // $5
        ]);

        console.log('✅ Histórico inserido');

        // AMIZADES
        await db.query(`
            INSERT INTO amizade (
                id_usuario_1,
                id_usuario_2,
                status,
                data_conexao
            )
            VALUES
            (
                $1,
                $2,
                'Aceito',
                NOW()
            ),
            (
                $2,
                $3,
                'Pendente',
                NOW()
            );
        `, [
            user1.id_usuario,
            user3.id_usuario,
            user2.id_usuario
        ]);

        console.log('✅ Amizades inseridas');

        console.log('🎉 Seed executada com sucesso!');

        process.exit();

    } catch (error) {

        console.error('❌ Erro no seed:', error);

        process.exit(1);
    }
}

seed();