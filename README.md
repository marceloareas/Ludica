# Ludica
# O que é?
Este projeto é uma plataforma educacional gamificada desenvolvida para motivar alunos do ensino básico e médio no aprendizado de novos conteúdos. Baseada no Método SBCB de Geometria Descritiva, a plataforma digitaliza jogos físicos tradicionais, transformando o estudo em uma experiência interativa, competitiva e altamente personalizável.

A arquitetura foi pensada para ser agnóstica ao conteúdo, permitindo que professores e administradores alimentem os jogos com qualquer temática curricular.

# Funcionalidades Principais
1. Gestão de Usuários e Gamificação
Cadastro e Perfil: Criação de conta com personalização de avatar.

Progressão: Área dedicada para visualização de pontos e conquistas (badges).

Social: Sistema de lista de amigos para estimular a interação.

Dashboard: Central de atividades e jogos disponíveis.

2. Módulos de Jogos (Versões Digitais)
A plataforma inicia com dois módulos principais, integrados de forma independente:

Jogo da Cruzadinha: Desafio de fixação de conceitos e vocabulário.

Jogo da Maratona: Dinâmica de percurso e velocidade de raciocínio sobre o conteúdo.

# Diferenciais Técnicos
Modularidade: Cada jogo é um componente separado, facilitando a inclusão de novos módulos de atividades no futuro.

Escalabilidade de Conteúdo: Estrutura de dados preparada para receber diferentes bases de perguntas e desafios (Geometria, História, Matemática, etc.).

Fidelidade às Regras: Transposição fiel das regras dos jogos físicos originais para o ambiente digital.

# Como usar o repositório
Pré-requisitos
Para garantir que todo o ambiente (Banco de dados, Frontend e Backend) funcione corretamente, é necessário o uso do Docker.

Instalação: [Docker Official Website](https://docs.docker.com/engine/install/)

Instalação e Execução
Clone o repositório para a máquina local.

## Rodando o Docker

- Vá até a pasta `docker` através do terminal e rode:

```docker compose up```

## Rodando o Front-End

- Vá até a pasta `front-end` através do terminal e rode:

```npm run dev```

## Rodando o Back-End

- Vá até a pasta `back-end` através do terminal e rode:

```npm run dev```

# Fazendo deploy da aplicação

```git status```

```git add .```

```git commit -m "<alteracao feita>"```

```git push```