# Relatório de Acompanhamento — Sprint 03

**Disciplina:** Projetos e Configuração de Sistemas  
**Projeto:** Lúdica — Plataforma de Aprendizagem Lúdica  
**Sprint:** Sprint 03 — Evolução da interface, infraestrutura e robustez da aplicação  
**Data da apresentação:** 30/09/2026

**Integrantes:**

- Lucas Alves Bittencourt
- João Victor
- Patricia Sales Mansano

---

## 1. Objetivo da Sprint

Dar continuidade à evolução do Lúdica, com foco no aprimoramento das interfaces, simplificação do ambiente de execução e melhorias nos fluxos de autenticação, perfil, Gamertag e avatar.

As alterações realizadas nesta Sprint estão disponíveis na branch:

```text
feat/parte-sprint3
```

---

## 2. Atividades planejadas

As principais atividades trabalhadas na Sprint 3 foram:

1. Aprimorar a Home e a tela de detalhamento dos jogos.
2. Simplificar a inicialização do ambiente de desenvolvimento.
3. Aprimorar o processo de autenticação.
4. Reforçar as regras relacionadas aos perfis Aluno e Professor.
5. Aprimorar a unicidade da Gamertag.
6. Reforçar a segurança das alterações do Perfil.
7. Aprimorar a recuperação e persistência do avatar.
8. Corrigir problemas identificados durante a integração.

---

# 3. Atividades realizadas

## 3.1 Integração do ambiente com Docker Compose

O processo de inicialização foi simplificado para permitir que **front-end, back-end e banco de dados sejam iniciados conjuntamente**.

A aplicação pode ser construída e executada por meio de:

```bash
docker compose up --build
```

A população do banco de dados pode ser realizada utilizando:

```bash
docker compose exec backend npm run seed
```

Com isso, a preparação do ambiente de desenvolvimento passa a exigir menos etapas manuais.

---

## 3.2 Aprimoramento da Home e da tela de detalhamento

A **Home** e a **tela de detalhamento do jogo** foram refeitas tomando como referência os protótipos desenvolvidos no Canvas.

A alteração dá continuidade ao trabalho iniciado na Sprint 2, quando a tela de detalhamento já atendia aos requisitos funcionais, mas ainda apresentava necessidade de aprimoramento visual.

As mudanças buscaram melhorar a organização das informações, a hierarquia visual e a navegação.

---

## 3.3 Aprimoramento do login

O fluxo de autenticação foi ampliado para permitir **login por e-mail**, além do login por Gamertag.

A comparação da Gamertag também passou a ser realizada sem diferenciação entre letras maiúsculas e minúsculas.

Dessa forma, o usuário pode se autenticar utilizando:

```text
Login
  ├── E-mail
  └── Gamertag
        └── comparação case-insensitive
```

O carregamento do avatar após a autenticação também foi ajustado para que uma eventual falha na recuperação do avatar não impeça o login.

---

## 3.4 Aprimoramento da unicidade da Gamertag

A regra de unicidade implementada na Sprint 2 foi reforçada para impedir duplicidades que diferem apenas pelo uso de letras maiúsculas e minúsculas.

Foi criado no banco de dados um índice único baseado em:

```sql
LOWER(nome_usuario)
```

Assim, Gamertags como `Alice`, `alice` e `ALICE` são consideradas equivalentes.

Também foram realizados os seguintes ajustes:

- aplicação de `trim`;
- rejeição de Gamertag vazia;
- verificação de duplicidade durante a atualização do perfil;
- tratamento de violações de unicidade do PostgreSQL;
- diferenciação entre conflitos de e-mail e Gamertag;
- retorno HTTP `409 Conflict` para conflitos de unicidade.

---

## 3.5 Reforço das regras de perfil

Foi reforçada a distinção entre o nível de acesso do usuário e seu perfil funcional:

```text
tipo_usuario
├── Usuario
└── Administrador

perfil_usuario
├── Aluno
└── Professor
```

O back-end passou a validar explicitamente `Aluno` e `Professor` como valores permitidos para `perfil_usuario`.

No banco de dados, foi adicionada uma constraint correspondente. O valor `NULL` permanece permitido para o Administrador utilizado no seed.

Também foi padronizada a nomenclatura `perfil_usuario`, substituindo ocorrências de `tipo_jogador`.

O cadastro passou ainda a retornar apenas campos seguros do usuário, evitando a inclusão do hash da senha na resposta.

---

## 3.6 Segurança e persistência do Perfil

O fluxo de atualização do Perfil recebeu mecanismos adicionais de autenticação e autorização.

Foi criado o middleware:

```text
middleware/auth.js
```

responsável por:

- validar o JWT;
- identificar o usuário autenticado;
- impedir que um usuário altere dados pertencentes a outro usuário.

As rotas de atualização de perfil e senha passaram a exigir autenticação, e o front-end passou a enviar o token nessas requisições.

Também foram realizados ajustes para:

- exigir Gamertag, nome completo e e-mail na atualização;
- retornar `404` para usuário inexistente;
- tratar sessões expiradas;
- evitar alterações indevidas na data de nascimento decorrentes de conversões de fuso horário.

---

## 3.7 Aprimoramento do avatar

O fluxo de avatar foi ajustado para aumentar sua consistência com a autenticação.

Após o login, a aplicação tenta recuperar o avatar do usuário. Caso essa recuperação falhe, o dado local correspondente é removido sem interromper a autenticação.

Também foram realizados ajustes para:

- exigir autenticação no salvamento;
- impedir a alteração do avatar de outro usuário;
- atualizar o `localStorage` somente após confirmação do servidor;
- atualizar a Navbar após alterações;
- validar a configuração recebida pelo back-end;
- adequar os avatares do `seed.js` ao formato utilizado pelo editor atual.

---

## 3.8 Correções no banco de dados e integração

Durante a integração foram realizadas correções adicionais, incluindo:

- correção de erro de sintaxe no `init.sql`;
- padronização de `perfil_usuario`;
- inclusão da constraint de perfil;
- inclusão do índice de unicidade case-insensitive da Gamertag;
- atualização dos dados de avatar utilizados pelo seed;
- adequação dos comentários relacionados ao tipo de usuário.

As alterações realizadas pelos integrantes foram complementares e atuaram em diferentes partes da aplicação.

---

# 4. Dificuldades encontradas

## 4.1 Integração do ambiente

Foi necessário consolidar a inicialização do front-end, back-end e banco de dados por meio do Docker Compose.

## 4.2 Consistência do banco de dados

Durante a integração foi identificado um erro de sintaxe no `init.sql`. Também foi necessário padronizar a nomenclatura `perfil_usuario` e reforçar as restrições relacionadas aos perfis e à Gamertag.

## 4.3 Segurança das alterações do usuário

As operações relacionadas ao Perfil e ao avatar precisaram ser reforçadas para garantir que cada usuário possa modificar somente os próprios dados.

## 4.4 Robustez do login

O carregamento do avatar precisou ser desacoplado do sucesso da autenticação para evitar que uma falha secundária impedisse o acesso do usuário à plataforma.

---

# 5. Situação ao final da Sprint

Ao final da Sprint 3, foram realizadas:

- integração do ambiente com Docker Compose;
- atualização da Home;
- atualização da tela de detalhamento do jogo;
- inclusão do login por e-mail;
- aprimoramento do login por Gamertag;
- aprimoramento da unicidade da Gamertag;
- reforço das regras dos perfis Aluno e Professor;
- proteção das alterações de Perfil;
- aprimoramento da recuperação e persistência do avatar;
- correções no banco de dados e na integração da aplicação.

Parte dessas atividades corresponde ao aprimoramento de funcionalidades implementadas na Sprint 2, principalmente Gamertag, Perfil e avatar.

---

# 6. Próximas atividades

## 6.1 Consolidação das alterações

As alterações da Sprint 3 deverão ser revisadas e integradas à versão principal do projeto.

Também deverão ser verificados os fluxos afetados pelas alterações, principalmente:

- inicialização pelo Docker Compose;
- login por e-mail e Gamertag;
- atualização do Perfil;
- persistência do avatar;
- Home e tela de detalhamento.

## 6.2 Trabalhos futuros indicados pelo professor

Permanecem no planejamento futuro:

- visualização de perfis dos amigos, incluindo avatares e pontuações nos jogos;
- implementação do comportamento específico do perfil Administrador;
- integração dos jogos como aplicações separadas por API;
- loja de itens para Avatar utilizando pontos;
- sistema de conquistas.

Esses itens não representam pendências da Sprint 3.

---

# 7. Conclusão

A Sprint 3 concentrou-se na evolução da interface e na consolidação técnica do Lúdica.

A Home e a tela de detalhamento foram atualizadas, o ambiente de desenvolvimento foi simplificado com Docker Compose e o login passou a aceitar e-mail. Também foram reforçadas regras relacionadas à Gamertag, perfis, autenticação, Perfil e avatar.

As alterações complementam funcionalidades desenvolvidas nas etapas anteriores e aumentam a consistência entre front-end, back-end e banco de dados.

---

# 8. Referências

- LÚDICA. **Manual do Usuário**.
- LÚDICA. **Manual do Desenvolvedor — Plataforma de Aprendizagem Lúdica**.
- LÚDICA. **Documento de Trabalho Futuro**.
- LÚDICA. **Relatório de Acompanhamento — Sprint 01**.
- LÚDICA. **Relatório de Acompanhamento — Sprint 02**.