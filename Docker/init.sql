-- 1. Tabela Principal de Usuários
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    data_nascimento DATE,
    senha VARCHAR(255),
    nome_completo VARCHAR(100),
    tipo_usuario VARCHAR(20), -- Administrador ou Jogador
    flag_usuario CHAR(1),
    data_cadastro TIMESTAMP DEFAULT NOW()
);

-- 2. Customização do Aluno (Relacionamento 1:1)
CREATE TABLE avatares (
    id_avatar SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE,
    aparencia_json TEXT,
    CONSTRAINT fk_avatar_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- 3. Catálogo de Jogos
CREATE TABLE jogos (
    id_jogo SERIAL PRIMARY KEY,
    codigo_jogo CHAR(5),
    titulo VARCHAR(100),
    descricao TEXT,
    url_recurso VARCHAR(255),
    id_admin_criador INT,
    data_criacao DATE,
    CONSTRAINT fk_jogos_admin FOREIGN KEY (id_admin_criador) REFERENCES usuarios(id_usuario)
);

-- 4. Registro de Performance (Saldo Atual / Ranking)
CREATE TABLE pontuacao (
    id_pontuacao SERIAL PRIMARY KEY,
    id_usuario INT,
    id_jogo INT,
    pontos_acumulados INT DEFAULT 0,
    CONSTRAINT fk_pontuacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_pontuacao_jogo FOREIGN KEY (id_jogo) REFERENCES jogos(id_jogo)
);

-- 5. Registro de Histórico de Partidas (O Extrato)
CREATE TABLE historico_partidas (
    id_historico SERIAL PRIMARY KEY,
    id_usuario INT,
    id_jogo INT,
    pontos_obtidos INT,
    data_partida TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_historico_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_historico_jogo FOREIGN KEY (id_jogo) REFERENCES jogos(id_jogo)
);

-- 6. Sistema de Amizades (Autorrelacionamento)
CREATE TABLE amizade (
    id_usuario_1 INT,
    id_usuario_2 INT,
    status VARCHAR(20), -- Pendente ou Aceito
    data_conexao TIMESTAMP,
    PRIMARY KEY (id_usuario_1, id_usuario_2),
    CONSTRAINT fk_amizade_user1 FOREIGN KEY (id_usuario_1) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_amizade_user2 FOREIGN KEY (id_usuario_2) REFERENCES usuarios(id_usuario)
);

