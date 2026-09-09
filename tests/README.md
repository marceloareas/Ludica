# Testes Automatizados — Lúdica

Esta pasta contém os testes automatizados utilizados para validar as correções e funcionalidades implementadas no projeto **Lúdica**.

Os testes atuais utilizam **PowerShell** para realizar requisições diretamente à API do back-end.

## Estrutura

```text
tests/
├── README.md
└── test-gamertag.ps1
```

---

## Pré-requisitos

Antes de executar os testes, é necessário:

1. Ter o **Docker Desktop** em execução.
2. Ter o banco de dados PostgreSQL do Lúdica em execução.
3. Ter as dependências do back-end instaladas.
4. Ter o back-end do Lúdica rodando na porta `3000`.

---

## 1. Verificar o banco de dados

Na raiz do projeto:

```text
Ludica/
```

execute:

```powershell
docker ps
```

O container PostgreSQL deverá aparecer como ativo.

Exemplo:

```text
CONTAINER ID   IMAGE             STATUS   PORTS                    NAMES
xxxxxxxxxxxx   postgres:latest   Up       0.0.0.0:5433->5432/tcp   meu_postgres
```

---

## 2. Instalar as dependências do back-end

Na primeira execução do projeto, acesse:

```powershell
cd back-end
```

e execute:

```powershell
npm.cmd install
```

> No PowerShell, é utilizado `npm.cmd` porque algumas máquinas podem possuir restrições para execução do arquivo `npm.ps1`.

---

## 3. Iniciar o back-end

Dentro da pasta:

```text
Ludica/back-end
```

execute:

```powershell
npm.cmd run dev
```

O resultado esperado inclui:

```text
[nodemon] starting `node server.js`
Servidor rodando
```

Mantenha esse terminal aberto durante a execução dos testes.

---

## 4. Verificar se a API está disponível

Abra outro PowerShell e execute:

```powershell
Test-NetConnection localhost -Port 3000
```

O resultado esperado é:

```text
TcpTestSucceeded : True
```

Caso apareça:

```text
TcpTestSucceeded : False
```

verifique se o back-end está em execução antes de continuar.

---

# Teste de unicidade da Gamertag

Arquivo:

```text
tests/test-gamertag.ps1
```

Este teste valida o requisito da 2ª Sprint:

> **1. Garantir unicidade da Gamertag.**

O teste possui dois cenários.

## Teste 1 — Bloqueio de Gamertag duplicada

O script tenta cadastrar um novo usuário utilizando uma Gamertag que já existe no banco de dados.

A API deve rejeitar o cadastro.

Resultado esperado:

```text
=== TESTE 1: Gamertag duplicada ===
PASSOU: Gamertag duplicada foi bloqueada
```

Esse teste confirma que dois usuários não podem possuir a mesma Gamertag.

---

## Teste 2 — Cadastro de nova Gamertag

O script gera automaticamente uma Gamertag e um e-mail de teste utilizando um identificador aleatório.

Exemplo:

```text
Gamertag: teste_349891889
```

Resultado esperado:

```text
=== TESTE 2: Nova Gamertag ===
PASSOU: nova Gamertag foi cadastrada
ID criado: <id>
Gamertag: teste_<identificador>
```

Esse teste confirma que a validação de unicidade não impede o cadastro de uma Gamertag válida e ainda não utilizada.

A utilização de valores aleatórios permite executar o teste várias vezes sem precisar alterar manualmente os dados.

---

# Executando o teste

A partir da raiz do projeto:

```text
Ludica/
```

execute:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\tests\test-gamertag.ps1
```

O parâmetro:

```text
-ExecutionPolicy Bypass
```

permite executar o script mesmo em computadores nos quais a política do PowerShell bloqueia arquivos `.ps1`.

Essa opção é aplicada somente ao processo iniciado pelo comando e não altera permanentemente a política de execução do Windows.

---

## Resultado esperado

Uma execução bem-sucedida deverá apresentar:

```text
=== TESTE 1: Gamertag duplicada ===
PASSOU: Gamertag duplicada foi bloqueada

=== TESTE 2: Nova Gamertag ===
PASSOU: nova Gamertag foi cadastrada
ID criado: <id>
Gamertag: teste_<identificador>
```

Se aparecer `FALHOU`, verifique:

* se o Docker Desktop está em execução;
* se o container PostgreSQL está ativo;
* se o back-end está rodando;
* se a porta `3000` está disponível;
* a mensagem de erro apresentada pelo teste;
* o terminal em que `npm.cmd run dev` está sendo executado.

---

## Dados criados pelos testes

O Teste 2 realiza um cadastro real no banco de dados de desenvolvimento.

Por isso, cada execução cria um usuário com dados semelhantes a:

```text
nome_usuario = teste_<identificador>
email        = teste.<identificador>@ludica.com
```

Esses registros são exclusivamente dados de teste e podem ser removidos posteriormente.

A remoção automática desses usuários ainda não foi implementada no script para evitar que os testes dependam de uma operação de exclusão que não faça parte da API atualmente utilizada.

---

# Testes implementados

| Requisito             | Teste               | Status                  |
| --------------------- | ------------------- | ----------------------- |
| Unicidade da Gamertag | `test-gamertag.ps1` | Implementado e validado |

---

# Novos testes

Conforme as funcionalidades da 2ª Sprint forem implementadas, novos testes poderão ser adicionados.

Estrutura prevista:

```text
tests/
├── README.md
├── test-gamertag.ps1
├── test-auth-history.ps1
├── test-profile.ps1
└── ...
```

Cada teste deverá:

* validar uma funcionalidade específica;
* poder ser executado de forma independente;
* indicar claramente os resultados como `PASSOU` ou `FALHOU`;
* evitar depender de dados criados manualmente sempre que possível;
* documentar qualquer dado criado ou modificado no banco.

---

## 2ª Sprint — acompanhamento dos testes

| Item | Funcionalidade                                    | Situação            |
| ---: | ------------------------------------------------- | ------------------- |
|    1 | Garantir unicidade da Gamertag                    | Concluído e testado |
|    2 | Utilizar usuário autenticado no histórico/ranking | Pendente            |
|    3 | Persistência das alterações do Perfil             | Pendente            |
|    4 | Recuperação automática do avatar no login         | Pendente            |
|    5 | Melhorias no detalhamento dos jogos               | Pendente            |
|    6 | Tipo de jogador no cadastro                       | Pendente            |
|    7 | Levantamento das ações do Administrador           | Pendente            |

Este README deverá ser atualizado conforme novos testes forem implementados e validados.
