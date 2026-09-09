$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:3000"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$password = "Teste123!"

$alunoName = "login_aluno_$timestamp"
$profName = "login_prof_$timestamp"
$adminName = "login_admin_$timestamp"

Write-Host "=== TESTE: login por perfil ==="

function Cadastrar-Usuario {
    param (
        [string]$UserName,
        [string]$Email,
        [string]$Perfil
    )

    $body = @{
        name = "Usuario Teste"
        userName = $UserName
        email = $Email
        password = $password
        birthDate = "2000-01-01"
        perfil_usuario = $Perfil
    } | ConvertTo-Json

    return Invoke-RestMethod `
        -Uri "$baseUrl/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
}

function Fazer-Login {
    param (
        [string]$UserName
    )

    $body = @{
        userName = $UserName
        password = $password
    } | ConvertTo-Json

    return Invoke-RestMethod `
        -Uri "$baseUrl/users/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
}

try {

    Write-Host ""
    Write-Host "=== PREPARANDO USUARIOS TEMPORARIOS ==="

    Cadastrar-Usuario `
        -UserName $alunoName `
        -Email "$alunoName@teste.com" `
        -Perfil "Aluno" | Out-Null

    Cadastrar-Usuario `
        -UserName $profName `
        -Email "$profName@teste.com" `
        -Perfil "Professor" | Out-Null

    Cadastrar-Usuario `
        -UserName $adminName `
        -Email "$adminName@teste.com" `
        -Perfil "Aluno" | Out-Null

    # Promove o terceiro usuario para Administrador
    # e remove seu perfil pedagogico.
    docker exec meu_postgres psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -c "
        UPDATE usuario
        SET tipo_usuario = 'Administrador',
            perfil_usuario = NULL
        WHERE nome_usuario = '$adminName';
        " | Out-Null


    # --------------------------------------------------------
    # TESTE 1 - ALUNO
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 1: login de Aluno ==="

    $loginAluno = Fazer-Login -UserName $alunoName

    if (
        $loginAluno.user.tipo_usuario -eq "Usuario" -and
        $loginAluno.user.perfil_usuario -eq "Aluno"
    ) {
        Write-Host "PASSOU: perfil de Aluno retornado corretamente"
        Write-Host "tipo_usuario: $($loginAluno.user.tipo_usuario)"
        Write-Host "perfil_usuario: $($loginAluno.user.perfil_usuario)"
    }
    else {
        throw "FALHOU: dados incorretos no login do Aluno"
    }


    # --------------------------------------------------------
    # TESTE 2 - PROFESSOR
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 2: login de Professor ==="

    $loginProfessor = Fazer-Login -UserName $profName

    if (
        $loginProfessor.user.tipo_usuario -eq "Usuario" -and
        $loginProfessor.user.perfil_usuario -eq "Professor"
    ) {
        Write-Host "PASSOU: perfil de Professor retornado corretamente"
        Write-Host "tipo_usuario: $($loginProfessor.user.tipo_usuario)"
        Write-Host "perfil_usuario: $($loginProfessor.user.perfil_usuario)"
    }
    else {
        throw "FALHOU: dados incorretos no login do Professor"
    }


    # --------------------------------------------------------
    # TESTE 3 - ADMINISTRADOR
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 3: login de Administrador ==="

    $loginAdmin = Fazer-Login -UserName $adminName

    if (
        $loginAdmin.user.tipo_usuario -eq "Administrador" -and
        $null -eq $loginAdmin.user.perfil_usuario
    ) {
        Write-Host "PASSOU: perfil de Administrador retornado corretamente"
        Write-Host "tipo_usuario: $($loginAdmin.user.tipo_usuario)"
        Write-Host "perfil_usuario: NULL"
    }
    else {
        throw "FALHOU: dados incorretos no login do Administrador"
    }


    # --------------------------------------------------------
    # TESTE 4 - TOKEN
    # --------------------------------------------------------

    Write-Host ""
    Write-Host "=== TESTE 4: token de autenticacao ==="

    if (
        $loginAluno.token -and
        $loginProfessor.token -and
        $loginAdmin.token
    ) {
        Write-Host "PASSOU: todos os logins retornaram token"
    }
    else {
        throw "FALHOU: algum login nao retornou token"
    }


    Write-Host ""
    Write-Host "=== TODOS OS TESTES DE LOGIN POR PERFIL PASSARAM ==="

}
finally {

    Write-Host ""
    Write-Host "=== LIMPANDO USUARIOS TEMPORARIOS ==="

    docker exec meu_postgres psql `
        -U usuario_admin `
        -d Ludica_desenv `
        -c "
        DELETE FROM usuario
        WHERE nome_usuario IN (
            '$alunoName',
            '$profName',
            '$adminName'
        );
        " | Out-Null

    Write-Host "Usuarios temporarios removidos"
}