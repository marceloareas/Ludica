-- 1. Tabela Principal de Usuários
-- Alterado o nome da tabela de "usuarios" para "usuario".
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    data_nascimento DATE,
    senha VARCHAR(255),
    nome_completo VARCHAR(100),
    tipo_usuario VARCHAR(20), -- Administrador ou usuario
    flag_usuario CHAR(1),
    data_cadastro TIMESTAMP DEFAULT NOW(),
    perfil_usuario VARCHAR(20) DEFAULT 'Aluno'
        CONSTRAINT chk_perfil_usuario CHECK (perfil_usuario IN ('Aluno', 'Professor'))
);

-- 2. Customização do Aluno (Relacionamento 1:1)
-- Alterado o nome da tabela de "avatares" para "avatar".
CREATE TABLE avatar (
    id_avatar SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE,
    aparencia_json TEXT,
    CONSTRAINT fk_avatar_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- 3. Catálogo de Jogos
-- Alterado o nome da tabela de "jogos" para "jogo".
CREATE TABLE jogo (
    id_jogo SERIAL PRIMARY KEY,
    codigo_jogo CHAR(5),
    titulo VARCHAR(100),
    descricao TEXT,
    tempo_estimado INT,
    faixa_etaria VARCHAR(20),
    quantidade_jogadores INT,
    url_recurso VARCHAR(255),
    url_imagem TEXT,
    id_admin_criador INT,
    data_criacao DATE,
    CONSTRAINT fk_jogos_admin FOREIGN KEY (id_admin_criador) REFERENCES usuario(id_usuario)
);

-- 4. Registro de Performance (Saldo Atual / Ranking)
CREATE TABLE pontuacao (
    id_pontuacao SERIAL PRIMARY KEY,
    id_usuario INT,
    id_jogo INT,
    pontos_acumulados INT DEFAULT 0,
    CONSTRAINT fk_pontuacao_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_pontuacao_jogo FOREIGN KEY (id_jogo) REFERENCES jogo(id_jogo)
);

-- 5. Registro de Histórico de Partidas (O Extrato)
-- Alterado o nome da tabela de "historico_partidas" para "historico_partida".
CREATE TABLE historico_partida (
    id_historico SERIAL PRIMARY KEY,
    id_usuario INT,
    id_jogo INT,
    pontos_obtidos INT,
    data_partida TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_historico_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_historico_jogo FOREIGN KEY (id_jogo) REFERENCES jogo(id_jogo)
);

-- 6. Sistema de Amizades (Autorrelacionamento)
CREATE TABLE amizade (
    id_usuario_1 INT,
    id_usuario_2 INT,
    status VARCHAR(20), -- Pendente ou Aceito
    data_conexao TIMESTAMP,
    PRIMARY KEY (id_usuario_1, id_usuario_2),
    CONSTRAINT fk_amizade_user1 FOREIGN KEY (id_usuario_1) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_amizade_user2 FOREIGN KEY (id_usuario_2) REFERENCES usuario(id_usuario)
);


-- ===== Sprint 3: moedas e loja de itens do avatar =====
ALTER TABLE usuario
    ADD COLUMN IF NOT EXISTS moedas INT NOT NULL DEFAULT 0 CHECK (moedas >= 0);

CREATE TABLE IF NOT EXISTS item_avatar (
    id_item SERIAL PRIMARY KEY,
    campo VARCHAR(20) NOT NULL CHECK (campo IN (
        'hairId','hairColor','eyesId','eyesColor','mouthId','noseId',
        'outfitId','outfitColor','accessoryId','skinColor','bgColor')),
    valor VARCHAR(30) NOT NULL,
    nome VARCHAR(60) NOT NULL,
    preco INT NOT NULL CHECK (preco > 0),
    UNIQUE (campo, valor)
);

CREATE TABLE IF NOT EXISTS usuario_item (
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_item INT NOT NULL REFERENCES item_avatar(id_item) ON DELETE CASCADE,
    data_compra TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id_usuario, id_item)
);

CREATE TABLE IF NOT EXISTS transacao_moeda (
    id_transacao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    valor INT NOT NULL CHECK (valor <> 0),
    motivo VARCHAR(20) NOT NULL
        CHECK (motivo IN ('partida','compra','ajuste_admin','bonus_inicial')),
    id_referencia INT,
    data_transacao TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Catálogo: `campo` e `valor` são exatamente as chaves do JSON do avatar
INSERT INTO item_avatar (campo, valor, nome, preco) VALUES
    ('hairId','longo','Cabelo longo',30),
    ('hairId','rabo de cavalo','Rabo de cavalo',30),
    ('hairId','afro','Cabelo afro',40),
    ('hairColor','#8b5cf6','Cabelo roxo',25),
    ('hairColor','#06b6d4','Cabelo ciano',25),
    ('hairColor','#dc2626','Cabelo vermelho',25),
    ('eyesId','piscando','Olhos piscando',20),
    ('eyesId','estrelas','Olhos de estrela',50),
    ('mouthId','lingua','Língua de fora',20),
    ('outfitId','moletom','Moletom',40),
    ('outfitId','camisa','Camisa',40),
    ('outfitId','vestido','Vestido',60),
    ('accessoryId','glasses','Óculos',30),
    ('accessoryId','sunglasses','Óculos escuros',50),
    ('accessoryId','hat','Chapéu',60),
    ('accessoryId','headphones','Fones de ouvido',80),
    ('accessoryId','bow','Laço',30),
    ('bgColor','#fbcfe8','Fundo rosa',15),
    ('bgColor','#bbf7d0','Fundo verde',15)
ON CONFLICT (campo, valor) DO NOTHING;

-- Quem já tem avatar salvo mantém os itens que usa (evita bloqueio retroativo)
INSERT INTO usuario_item (id_usuario, id_item)
SELECT a.id_usuario, ia.id_item
FROM avatar a
JOIN item_avatar ia ON (a.aparencia_json::jsonb ->> ia.campo) = ia.valor
ON CONFLICT DO NOTHING;