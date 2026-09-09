$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:3000"

Write-Host "=== TESTE: perfis permitidos no ranking ==="

# ------------------------------------------------------------
# Localiza usuarios existentes
# ------------------------------------------------------------

$aluno = docker exec meu_postgres psql `
    -U usuario_admin `
    -d Ludica_desenv `
    -t `
    -A `
    -F "|" `
    -c "SELECT id_usuario, nome_usuario
        FROM usuario
        WHERE tipo_usuario = 'Usuario'
          AND perfil_usuario = 'Aluno'
        ORDER BY id_usuario
        LIMIT 1;"

$professor = docker exec meu_postgres psql `
    -U usuario_admin `
    -d Ludica_desenv `
    -t `
    -A `
    -F "|" `
    -c "SELECT id_usuario, nome_usuario
        FROM usuario
        WHERE tipo_usuario = 'Usuario'
          AND perfil_usuario = 'Professor'
        ORDER BY id_usuario
        LIMIT 1;"

$admin = docker exec meu_postgres psql `
    -U usuario_admin `
    -d Ludica_desenv `
    -t `
    -A `
    -F "|" `
    -c "SELECT id_usuario, nome_usuario
        FROM usuario
        WHERE tipo_usuario = 'Administrador'
        ORDER BY id_usuario
        LIMIT 1;"

if (-not $aluno) {
    throw "Nenhum Aluno encontrado no banco."
}

if (-not $professor) {
    throw "Nenhum Professor encontrado no banco."
}

if (-not $admin) {
    throw "Nenhum Administrador encontrado no banco."
}

$alunoParts = $aluno.Trim().Split("|")
$professorParts = $professor.Trim().Split("|")
$adminParts = $admin.Trim().Split("|")

$idAluno = [int]$alunoParts[0]
$nomeAluno = $alunoParts[1]

$idProfessor = [int]$professorParts[0]
$nomeProfessor = $professorParts[1]

$idAdmin = [int]$adminParts[0]
$nomeAdmin = $adminParts[1]

Write-Host ""
Write-Host "Aluno: $nomeAluno ($idAluno)"
Write-Host "Professor: $nomeProfessor ($idProfessor)"
Write-Host "Administrador: $nomeAdmin ($idAdmin)"

# ------------------------------------------------------------
# Escolhe um jogo existente
# ------------------------------------------------------------

$jogo = docker exec meu_postgres psql `
    -U usuario_admin `
    -d Ludica_desenv `
    -t `
    -A `
    -F "|" `
    -c "SELECT id_jogo, titulo
        FROM jogo
        ORDER BY id_jogo
        LIMIT 1;"

if (-not $jogo) {
    throw "Nenhum jogo encontrado."
}

$jogoParts = $jogo.Trim().Split("|")

$idJogo = [int]$jogoParts[0]
$tituloJogo = $jogoParts[1]

Write-Host "Jogo: $tituloJogo ($idJogo)"

# ------------------------------------------------------------
# Cria amizades temporarias entre Aluno e os outros perfis
# ------------------------------------------------------------

Write-Host ""
Write-Host "=== PREPARANDO AMIZADES TEMPORARIAS ==="

docker exec meu_postgres psql `
    -U usuario_admin `
    -d Ludica_desenv `
    -c "
    DELETE FROM amizade
    WHERE
        (id_usuario_1 = $idAluno AND id_usuario_2 IN ($idProfessor, $idAdmin))
        OR
        (id_usuario_2 = $idAluno AND id_usuario_1 IN ($idProfessor, $idAdmin));

    INSERT INTO amizade (
        id_usuario_1,
        id_usuario_2,
        status,
        data_conexao
    )
    VALUES
        ($idAluno, $idProfessor, 'Aceito', NOW()),
        ($idAluno, $idAdmin, 'Aceito', NOW());
    " | Out-Null

# ------------------------------------------------------------
# Cria historicos temporarios para Professor e Administrador
# ------------------------------------------------------------

Write-Host "Criando historico temporario..."

docker exec meu_postgres psql `
    -U usuario_admin `
    -d Ludica_desenv `
    -c "
    INSERT INTO historico_partida (
        id_usuario,
        id_jogo,
        pontos_obtidos
    )
    VALUES
        ($idProfessor, $idJogo, 9999),
        ($idAdmin, $idJogo, 9998);
    " | Out-Null

try {

    # --------------------------------------------------------
    # TESTE 1 - Aluno deve aparecer
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 1: Aluno pode participar do ranking ==="

    $rankingAluno = @(
        Invoke-RestMethod `
            -Uri "$baseUrl/friends/ranking/$idAluno/$idJogo" `
            -Method Get
    )

    $alunoEncontrado = $rankingAluno |
        Where-Object {
            [int]$_.id_usuario -eq $idAluno
        }

    if ($alunoEncontrado) {
        Write-Host "PASSOU: Aluno aparece no ranking"
    }
    else {
        throw "FALHOU: Aluno nao apareceu no ranking"
    }

    # --------------------------------------------------------
    # TESTE 2 - Professor nao deve aparecer
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 2: Professor nao aparece no ranking ==="

    $professorEncontrado = $rankingAluno |
        Where-Object {
            [int]$_.id_usuario -eq $idProfessor
        }

    if (-not $professorEncontrado) {
        Write-Host "PASSOU: Professor foi excluido do ranking"
    }
    else {
        throw "FALHOU: Professor apareceu no ranking"
    }

    # --------------------------------------------------------
    # TESTE 3 - Administrador nao deve aparecer
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 3: Administrador nao aparece no ranking ==="

    $adminEncontrado = $rankingAluno |
        Where-Object {
            [int]$_.id_usuario -eq $idAdmin
        }

    if (-not $adminEncontrado) {
        Write-Host "PASSOU: Administrador foi excluido do ranking"
    }
    else {
        throw "FALHOU: Administrador apareceu no ranking"
    }

    # --------------------------------------------------------
    # TESTE 4 - Professor consultando ranking
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 4: Professor nao participa nem como proprio usuario ==="

    $rankingProfessor = @(
        Invoke-RestMethod `
            -Uri "$baseUrl/friends/ranking/$idProfessor/$idJogo" `
            -Method Get
    )

    $professorNoProprioRanking = $rankingProfessor |
        Where-Object {
            [int]$_.id_usuario -eq $idProfessor
        }

    if (-not $professorNoProprioRanking) {
        Write-Host "PASSOU: Professor nao participa do ranking"
    }
    else {
        throw "FALHOU: Professor apareceu no proprio ranking"
    }

    # --------------------------------------------------------
    # TESTE 5 - Administrador consultando ranking
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 5: Administrador nao participa nem como proprio usuario ==="

    $rankingAdmin = @(
        Invoke-RestMethod `
            -Uri "$baseUrl/friends/ranking/$idAdmin/$idJogo" `
            -Method Get
    )

    $adminNoProprioRanking = $rankingAdmin |
        Where-Object {
            [int]$_.id_usuario -eq $idAdmin
        }

    if (-not $adminNoProprioRanking) {
        Write-Host "PASSOU: Administrador nao participa do ranking"
    }
    else {
        throw "FALHOU: Administrador apareceu no proprio ranking"
    }

    Write-Host ""
    Write-Host "=== TODOS OS TESTES DE PERFIL DO RANKING PASSARAM ==="

}
finally {

    Write-Host ""
    Write-Host "=== LIMPANDO DADOS TEMPORARIOS ==="

    docker exec meu_postgres psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -c "
        DELETE FROM historico_partida
        WHERE id_jogo = $idJogo
          AND id_usuario IN ($idProfessor, $idAdmin)
          AND pontos_obtidos IN (9999, 9998);

        DELETE FROM amizade
        WHERE
            (id_usuario_1 = $idAluno AND id_usuario_2 IN ($idProfessor, $idAdmin))
            OR
            (id_usuario_2 = $idAluno AND id_usuario_1 IN ($idProfessor, $idAdmin));
        " | Out-Null

    Write-Host "Dados temporarios removidos"
}