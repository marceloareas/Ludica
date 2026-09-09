$baseUrl = "http://localhost:3000"

$container = "meu_postgres"
$dbUser = "usuario_admin"
$dbName = "Ludica_desenv"

Write-Host "`n=== TESTE: recuperacao automatica de avatar ==="


# -------------------------------------------------
# 1. Localizar usuario com avatar
# -------------------------------------------------

$usuarioComAvatar = docker exec $container psql `
    -U $dbUser `
    -d $dbName `
    -t `
    -A `
    -F "|" `
    -c "
        SELECT u.id_usuario, u.nome_usuario
        FROM usuario u
        INNER JOIN avatar a
            ON a.id_usuario = u.id_usuario
        LIMIT 1;
    "

if (!$usuarioComAvatar) {

    Write-Host "ATENCAO: nenhum usuario com avatar foi encontrado no banco"

}
else {

    $campos = $usuarioComAvatar.Trim().Split("|")

    $idComAvatar = $campos[0]
    $nomeComAvatar = $campos[1]

    Write-Host "`n=== TESTE 1: usuario com avatar ==="
    Write-Host "Usuario:" $nomeComAvatar
    Write-Host "ID:" $idComAvatar

    try {

        $avatar = Invoke-RestMethod `
            -Uri "$baseUrl/avatars/$idComAvatar" `
            -Method Get

        if ($null -ne $avatar -and $null -ne $avatar.aparencia_json) {

            Write-Host "PASSOU: avatar recuperado pela API"

            Write-Host "Configuracao encontrada:"
            $avatar.aparencia_json | ConvertTo-Json -Depth 10

        }
        else {

            Write-Host "FALHOU: usuario possui avatar no banco, mas API nao retornou configuracao"

        }

    }
    catch {

        Write-Host "FALHOU: erro ao consultar avatar"
        Write-Host $_.ErrorDetails.Message

    }
}


# -------------------------------------------------
# 2. Localizar usuario sem avatar
# -------------------------------------------------

$usuarioSemAvatar = docker exec $container psql `
    -U $dbUser `
    -d $dbName `
    -t `
    -A `
    -F "|" `
    -c "
        SELECT u.id_usuario, u.nome_usuario
        FROM usuario u
        LEFT JOIN avatar a
            ON a.id_usuario = u.id_usuario
        WHERE a.id_usuario IS NULL
        LIMIT 1;
    "

if (!$usuarioSemAvatar) {

    Write-Host "`nATENCAO: nenhum usuario sem avatar foi encontrado"

}
else {

    $campos = $usuarioSemAvatar.Trim().Split("|")

    $idSemAvatar = $campos[0]
    $nomeSemAvatar = $campos[1]

    Write-Host "`n=== TESTE 2: usuario sem avatar ==="
    Write-Host "Usuario:" $nomeSemAvatar
    Write-Host "ID:" $idSemAvatar

    try {

        $avatar = Invoke-RestMethod `
            -Uri "$baseUrl/avatars/$idSemAvatar" `
            -Method Get

        if (
            $null -eq $avatar -or
            [string]::IsNullOrWhiteSpace([string]$avatar)
        ) {

            Write-Host "PASSOU: API nao retornou avatar para usuario sem avatar"
            Write-Host "Login pode remover avatar anterior do localStorage"

        }
        elseif ($null -eq $avatar.aparencia_json) {

            Write-Host "PASSOU: API nao retornou configuracao de avatar"
            Write-Host "Login pode remover avatar anterior do localStorage"

        }
        else {

            Write-Host "FALHOU: API retornou avatar para usuario que nao possui registro"

            Write-Host "Resposta recebida:"
            $avatar | ConvertTo-Json -Depth 10

        }

    }
    catch {

        Write-Host "FALHOU: erro ao consultar usuario sem avatar"
        Write-Host $_.ErrorDetails.Message

    }
}


# -------------------------------------------------
# 3. Verificar codigo do Login.jsx
# -------------------------------------------------

Write-Host "`n=== TESTE 3: Login.jsx carrega avatar automaticamente ==="

$loginFile = ".\front-end\src\pages\Login\Login.jsx"

if (!(Test-Path $loginFile)) {

    Write-Host "FALHOU: Login.jsx nao encontrado"

}
else {

    $loginContent = Get-Content $loginFile -Raw

    $possuiBuscaAvatar =
        $loginContent -match "/avatars/\$\{data\.user\.id\}"

    $possuiLocalStorage =
        $loginContent -match "localStorage\.setItem\([\s\S]*?'avatar'"

    $possuiRemove =
        $loginContent -match "localStorage\.removeItem\('avatar'\)"

    if (
        $possuiBuscaAvatar -and
        $possuiLocalStorage -and
        $possuiRemove
    ) {

        Write-Host "PASSOU: Login.jsx busca e armazena avatar automaticamente"

    }
    else {

        Write-Host "FALHOU: fluxo de avatar no Login.jsx esta incompleto"

        Write-Host "Busca avatar:" $possuiBuscaAvatar
        Write-Host "Salva avatar:" $possuiLocalStorage
        Write-Host "Remove avatar antigo:" $possuiRemove

    }
}


# -------------------------------------------------
# Resultado final
# -------------------------------------------------

Write-Host "`n=== FIM DOS TESTES DE AVATAR ==="