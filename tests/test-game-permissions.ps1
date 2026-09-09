Write-Host ""
Write-Host "=== TESTE: permissoes para registrar partidas ==="
Write-Host ""

$baseUrl = "http://localhost:3000"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"

$alunoUser = "aluno_perm_$timestamp"
$profUser = "prof_perm_$timestamp"
$adminUser = "admin_perm_$timestamp"

$alunoEmail = "$alunoUser@teste.com"
$profEmail = "$profUser@teste.com"
$adminEmail = "$adminUser@teste.com"

$alunoId = $null
$profId = $null
$adminId = $null
$idJogo = $null

try {

    # ============================================================
    # PREPARACAO
    # ============================================================

    Write-Host "=== PREPARANDO USUARIOS TEMPORARIOS ==="

    # ------------------------------------------------------------
    # Criar Aluno
    # ------------------------------------------------------------

    $bodyAluno = @{
        name = "Aluno Permissao"
        userName = $alunoUser
        email = $alunoEmail
        password = "Teste123!"
        birthDate = "2000-01-01"
        perfil_usuario = "Aluno"
    } | ConvertTo-Json

    $aluno = Invoke-RestMethod `
        -Uri "$baseUrl/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $bodyAluno

    $alunoId = $aluno.id_usuario


    # ------------------------------------------------------------
    # Criar Professor
    # ------------------------------------------------------------

    $bodyProfessor = @{
        name = "Professor Permissao"
        userName = $profUser
        email = $profEmail
        password = "Teste123!"
        birthDate = "1990-01-01"
        perfil_usuario = "Professor"
    } | ConvertTo-Json

    $professor = Invoke-RestMethod `
        -Uri "$baseUrl/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $bodyProfessor

    $profId = $professor.id_usuario


    # ------------------------------------------------------------
    # Criar Administrador
    # ------------------------------------------------------------

    $bodyAdmin = @{
        name = "Administrador Permissao"
        userName = $adminUser
        email = $adminEmail
        password = "Teste123!"
        birthDate = "1985-01-01"
        perfil_usuario = "Aluno"
    } | ConvertTo-Json

    $admin = Invoke-RestMethod `
        -Uri "$baseUrl/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $bodyAdmin

    $adminId = $admin.id_usuario


    # ------------------------------------------------------------
    # Promover usuario temporario para Administrador
    # ------------------------------------------------------------

    $queryAdmin = @"
UPDATE usuario
SET tipo_usuario = 'Administrador',
    perfil_usuario = NULL
WHERE id_usuario = $adminId;
"@

    docker exec meu_postgres `
        psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -c $queryAdmin | Out-Null


    # ------------------------------------------------------------
    # Selecionar um jogo existente
    # ------------------------------------------------------------

    $idJogo = docker exec meu_postgres `
        psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -t `
        -A `
        -c "SELECT id_jogo FROM jogo ORDER BY id_jogo LIMIT 1;"

    $idJogo = [int]$idJogo.Trim()

    Write-Host "Aluno: $alunoUser ($alunoId)"
    Write-Host "Professor: $profUser ($profId)"
    Write-Host "Administrador: $adminUser ($adminId)"
    Write-Host "Jogo utilizado: $idJogo"
    Write-Host ""


    # ============================================================
    # TESTE 1 - ALUNO PODE JOGAR
    # ============================================================

    Write-Host "=== TESTE 1: Aluno pode registrar partida ==="

    $bodyPartidaAluno = @{
        id_usuario = $alunoId
        id_jogo = $idJogo
        pontos_obtidos = 1111
    } | ConvertTo-Json

    $partidaAluno = Invoke-RestMethod `
        -Uri "$baseUrl/history" `
        -Method Post `
        -ContentType "application/json" `
        -Body $bodyPartidaAluno

    if (
        $partidaAluno.id_usuario -eq $alunoId -and
        $partidaAluno.pontos_obtidos -eq 1111
    ) {
        Write-Host "PASSOU: Aluno conseguiu registrar partida"
    }
    else {
        Write-Host "FALHOU: partida do Aluno nao foi registrada corretamente"
        exit 1
    }

    Write-Host ""


    # ============================================================
    # TESTE 2 - PROFESSOR NAO PODE JOGAR
    # ============================================================

    Write-Host "=== TESTE 2: Professor nao pode registrar partida ==="

    $bodyPartidaProfessor = @{
        id_usuario = $profId
        id_jogo = $idJogo
        pontos_obtidos = 9999
    } | ConvertTo-Json

    $professorBloqueado = $false

    try {

        Invoke-RestMethod `
            -Uri "$baseUrl/history" `
            -Method Post `
            -ContentType "application/json" `
            -Body $bodyPartidaProfessor `
            -ErrorAction Stop

        Write-Host "FALHOU: Professor conseguiu registrar partida"
        exit 1

    }
    catch {

        $statusCode = $null

        if ($_.Exception.Response) {

            try {

                $statusCode = [int]$_.Exception.Response.StatusCode

            }
            catch {

                $statusCode = $null
            }
        }

        Write-Host "Status HTTP recebido: $statusCode"

        if ($_.ErrorDetails.Message) {

            Write-Host "Resposta da API:"
            Write-Host $_.ErrorDetails.Message
        }

        if ($statusCode -eq 403) {

            $professorBloqueado = $true
        }
    }

    if ($professorBloqueado) {

        Write-Host "PASSOU: Professor foi bloqueado com HTTP 403"

    }
    else {

        Write-Host "FALHOU: Professor nao recebeu HTTP 403"
        exit 1
    }

    Write-Host ""


    # ============================================================
    # TESTE 3 - ADMINISTRADOR PODE JOGAR
    # ============================================================

    Write-Host "=== TESTE 3: Administrador pode registrar partida ==="

    $bodyPartidaAdmin = @{
        id_usuario = $adminId
        id_jogo = $idJogo
        pontos_obtidos = 2222
    } | ConvertTo-Json

    $partidaAdmin = Invoke-RestMethod `
        -Uri "$baseUrl/history" `
        -Method Post `
        -ContentType "application/json" `
        -Body $bodyPartidaAdmin

    if (
        $partidaAdmin.id_usuario -eq $adminId -and
        $partidaAdmin.pontos_obtidos -eq 2222
    ) {

        Write-Host "PASSOU: Administrador conseguiu registrar partida"

    }
    else {

        Write-Host "FALHOU: partida do Administrador nao foi registrada corretamente"
        exit 1
    }

    Write-Host ""


    # ============================================================
    # TESTE 4 - VALIDAR PERSISTENCIA NO BANCO
    # ============================================================

    Write-Host "=== TESTE 4: validar persistencia das permissoes ==="

    $queryHistorico = @"
SELECT
    u.nome_usuario,
    hp.pontos_obtidos
FROM historico_partida hp
JOIN usuario u
    ON u.id_usuario = hp.id_usuario
WHERE u.id_usuario IN (
    $alunoId,
    $profId,
    $adminId
)
ORDER BY u.nome_usuario;
"@

    $dbResult = docker exec meu_postgres `
        psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -t `
        -A `
        -F "|" `
        -c $queryHistorico

    Write-Host $dbResult

    $alunoRegistrado = $false
    $professorRegistrado = $false
    $adminRegistrado = $false

    foreach ($linha in $dbResult) {

        if ($linha -eq "$alunoUser|1111") {

            $alunoRegistrado = $true
        }

        if ($linha -eq "$profUser|9999") {

            $professorRegistrado = $true
        }

        if ($linha -eq "$adminUser|2222") {

            $adminRegistrado = $true
        }
    }


    # ------------------------------------------------------------
    # Validar Aluno
    # ------------------------------------------------------------

    if (-not $alunoRegistrado) {

        Write-Host "FALHOU: partida do Aluno nao encontrada"
        exit 1
    }

    Write-Host "PASSOU: partida do Aluno foi persistida"


    # ------------------------------------------------------------
    # Validar Professor
    # ------------------------------------------------------------

    if ($professorRegistrado) {

        Write-Host "FALHOU: existe partida registrada para Professor"
        exit 1
    }

    Write-Host "PASSOU: nenhuma partida foi registrada para Professor"


    # ------------------------------------------------------------
    # Validar Administrador
    # ------------------------------------------------------------

    if (-not $adminRegistrado) {

        Write-Host "FALHOU: partida do Administrador nao encontrada"
        exit 1
    }

    Write-Host "PASSOU: partida do Administrador foi persistida"

    Write-Host ""
    Write-Host "PASSOU: banco respeitou as permissoes"
    Write-Host ""

    Write-Host "=== TODOS OS TESTES DE PERMISSAO DE PARTIDA PASSARAM ==="
    Write-Host ""

}
catch {

    Write-Host ""
    Write-Host "ERRO DURANTE O TESTE:"
    Write-Host $_.Exception.Message
    Write-Host ""

    exit 1

}
finally {

    # ============================================================
    # LIMPEZA
    # ============================================================

    Write-Host ""
    Write-Host "=== LIMPANDO DADOS TEMPORARIOS ==="

    $idsParaLimpar = @()

    if ($alunoId) {
        $idsParaLimpar += $alunoId
    }

    if ($profId) {
        $idsParaLimpar += $profId
    }

    if ($adminId) {
        $idsParaLimpar += $adminId
    }

    if ($idsParaLimpar.Count -gt 0) {

        $idsSql = $idsParaLimpar -join ","

        $queryLimpeza = @"
DELETE FROM historico_partida
WHERE id_usuario IN ($idsSql);

DELETE FROM amizade
WHERE id_usuario_1 IN ($idsSql)
   OR id_usuario_2 IN ($idsSql);

DELETE FROM usuario
WHERE id_usuario IN ($idsSql);
"@

        docker exec meu_postgres `
            psql `
            -U usuario_admin `
            -d Ludica_desenv `
            -c $queryLimpeza | Out-Null
    }

    Write-Host "Dados temporarios removidos"
}