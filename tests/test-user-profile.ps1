Write-Host ""
Write-Host "=== TESTE: perfil de usuario no cadastro ==="
Write-Host ""

$baseUrl = "http://localhost:3000"

$timestamp = Get-Date -Format "yyyyMMddHHmmss"

$alunoUser = "aluno_$timestamp"
$profUser = "prof_$timestamp"
$defaultUser = "default_$timestamp"

$alunoEmail = "$alunoUser@teste.com"
$profEmail = "$profUser@teste.com"
$defaultEmail = "$defaultUser@teste.com"

try {

    # ============================================================
    # TESTE 1 - CADASTRO DE ALUNO
    # ============================================================

    Write-Host "=== TESTE 1: cadastro de Aluno ==="

    $bodyAluno = @{
        name = "Aluno Teste"
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

    if (
        $aluno.tipo_usuario -eq "Usuario" -and
        $aluno.perfil_usuario -eq "Aluno"
    ) {
        Write-Host "PASSOU: API cadastrou usuario com perfil Aluno"
        Write-Host "Gamertag: $($aluno.nome_usuario)"
    }
    else {
        Write-Host "FALHOU: API nao retornou perfil_usuario = Aluno"
        exit 1
    }

    Write-Host ""

    # ============================================================
    # TESTE 2 - CADASTRO DE PROFESSOR
    # ============================================================

    Write-Host "=== TESTE 2: cadastro de Professor ==="

    $bodyProfessor = @{
        name = "Professor Teste"
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

    if (
        $professor.tipo_usuario -eq "Usuario" -and
        $professor.perfil_usuario -eq "Professor"
    ) {
        Write-Host "PASSOU: API cadastrou usuario com perfil Professor"
        Write-Host "Gamertag: $($professor.nome_usuario)"
    }
    else {
        Write-Host "FALHOU: API nao retornou perfil_usuario = Professor"
        exit 1
    }

    Write-Host ""

    # ============================================================
    # TESTE 3 - VERIFICAR NO POSTGRESQL
    # ============================================================

    Write-Host "=== TESTE 3: persistencia no PostgreSQL ==="

    $query = @"
SELECT nome_usuario, tipo_usuario, perfil_usuario
FROM usuario
WHERE nome_usuario IN ('$alunoUser', '$profUser')
ORDER BY nome_usuario;
"@

    $dbResult = docker exec meu_postgres `
        psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -t `
        -A `
        -F "|" `
        -c $query

    Write-Host $dbResult

    $alunoEncontrado = $false
    $professorEncontrado = $false

    foreach ($linha in $dbResult) {

        if ($linha -eq "$alunoUser|Usuario|Aluno") {
            $alunoEncontrado = $true
        }

        if ($linha -eq "$profUser|Usuario|Professor") {
            $professorEncontrado = $true
        }
    }

    if ($alunoEncontrado -and $professorEncontrado) {
        Write-Host "PASSOU: perfis de usuario persistidos corretamente no banco"
    }
    else {
        Write-Host "FALHOU: perfis de usuario nao foram persistidos corretamente"
        exit 1
    }

    Write-Host ""

    # ============================================================
    # TESTE 4 - VALOR PADRAO
    # ============================================================

    Write-Host "=== TESTE 4: perfil padrao ==="

    $bodyDefault = @{
        name = "Usuario Default"
        userName = $defaultUser
        email = $defaultEmail
        password = "Teste123!"
        birthDate = "2001-01-01"
    } | ConvertTo-Json

    $usuarioDefault = Invoke-RestMethod `
        -Uri "$baseUrl/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $bodyDefault

    if (
        $usuarioDefault.tipo_usuario -eq "Usuario" -and
        $usuarioDefault.perfil_usuario -eq "Aluno"
    ) {
        Write-Host "PASSOU: cadastro sem perfil usa Aluno como padrao"
    }
    else {
        Write-Host "FALHOU: perfil padrao nao foi aplicado"
        exit 1
    }

    Write-Host ""
    Write-Host "=== TODOS OS TESTES DE PERFIL DE USUARIO PASSARAM ==="
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

    Write-Host ""
    Write-Host "=== LIMPANDO USUARIOS TEMPORARIOS ==="

    docker exec meu_postgres `
        psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -c "
        DELETE FROM usuario
        WHERE nome_usuario IN (
            '$alunoUser',
            '$profUser',
            '$defaultUser'
        );
        " | Out-Null

    Write-Host "Usuarios temporarios removidos"
}

