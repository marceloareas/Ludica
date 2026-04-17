# Guia de Configuração e Execução do Ambiente Docker

Este documento descreve os procedimentos necessários para inicializar o ambiente de containers e validar o banco de dados.

---

## 1. Pré-requisitos

### Instalação
Certifique-se de ter o **Docker Desktop** instalado em sua máquina.

### Ambiente WSL
Caso o Docker solicite a atualização do subsistema Linux, abra o terminal (**PowerShell** ou **CMD**) como administrador e execute:

wsl --updat


## 2. Inicialização do Ambiente
Para subir os serviços (Banco de Dados e Aplicação) em modo background, navegue até a pasta raiz do projeto no terminal e execute:

docker compose up -d

Caso ocorra algum erro durante a inicialização ou conflito de volumes, realize o "reset" do ambiente removendo os volumes antigos antes de tentar novamente:

docker compose down -v && docker compose up -d

## 3. Validação do Banco de Dados

Para confirmar se o banco de dados PostgreSQL está operante e se as tabelas foram criadas corretamente, execute o comando de inspeção via terminal:

docker exec -it meu_postgres psql -U usuario_admin -d Ludica_desenv -c "\dt"

## 4. Entrar no container do banco de dados

`docker exec -it meu_postgres bash`

## 5. Acessar o PostgreSQL 

`psql -U usuario_admin -d Ludica_desenv`

## 4. Exibir tabelas

`\dt`

# 5. Exibir colunas de uma tabela

`\d <tabela>`

ou

`SELECT * FROM usuarios;`