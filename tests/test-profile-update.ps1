$baseUrl = "http://localhost:3000"
$userId = 1

$container = "meu_postgres"
$dbUser = "usuario_admin"
$dbName = "Ludica_desenv"

Write-Host "`n=== TESTE: persistencia das alteracoes do perfil ==="

# -------------------------------------------------
# 1. Recuperar dados originais diretamente do banco
# -------------------------------------------------

$original = docker exec $container psql `
    -U $dbUser `
    -d $dbName `
    -t `
    -A `
    -F "|" `
    -c "SELECT nome_usuario, email, nome_completo, data_nascimento FROM usuario WHERE id_usuario = $userId;"

if (!$original) {
    Write-Host "FALHOU: usuario $userId nao encontrado"
    exit 1
}

$campos = $original.Trim().Split("|")

$originalUserName = $campos[0]
$originalEmail = $campos[1]
$originalNome = $campos[2]
$originalDataNascimento = $campos[3]

Write-Host "Usuario encontrado:" $originalUserName


# -------------------------------------------------
# 2. Criar valores temporarios
# -------------------------------------------------

$idTeste = Get-Random

$novoUserName = "perfil_teste_$idTeste"
$novoEmail = "perfil.$idTeste@ludica.com"
$novoNome = "Teste Persistencia Perfil"
$novaDataNascimento = "2001-02-03"

$body = @{
    userName        = $novoUserName
    email           = $novoEmail
    nome_completo   = $novoNome
    data_nascimento = $novaDataNascimento
} | ConvertTo-Json


try {

    # -------------------------------------------------
    # 3. Atualizar pela API
    # -------------------------------------------------

    Write-Host "`n=== TESTE 1: atualizar perfil pela API ==="

    $response = Invoke-RestMethod `
        -Uri "$baseUrl/users/$userId" `
        -Method Put `
        -ContentType "application/json" `
        -Body $body

    if (
        $response.nome_usuario -eq $novoUserName -and
        $response.email -eq $novoEmail -and
        $response.nome_completo -eq $novoNome
    ) {
        Write-Host "PASSOU: API retornou os novos dados"
    }
    else {
        Write-Host "FALHOU: resposta da API nao corresponde aos novos dados"
    }


    # -------------------------------------------------
    # 4. Consultar diretamente o PostgreSQL
    # -------------------------------------------------

    Write-Host "`n=== TESTE 2: verificar persistencia no banco ==="

    $resultadoBanco = docker exec $container psql `
        -U $dbUser `
        -d $dbName `
        -t `
        -A `
        -F "|" `
        -c "SELECT nome_usuario, email, nome_completo, data_nascimento FROM usuario WHERE id_usuario = $userId;"

    $dadosBanco = $resultadoBanco.Trim().Split("|")

    $dbUserName = $dadosBanco[0]
    $dbEmail = $dadosBanco[1]
    $dbNome = $dadosBanco[2]
    $dbDataNascimento = $dadosBanco[3]

    if (
        $dbUserName -eq $novoUserName -and
        $dbEmail -eq $novoEmail -and
        $dbNome -eq $novoNome -and
        $dbDataNascimento -eq $novaDataNascimento
    ) {
        Write-Host "PASSOU: alteracoes foram persistidas no PostgreSQL"
    }
    else {
        Write-Host "FALHOU: dados do banco nao correspondem aos dados enviados"

        Write-Host "Gamertag banco:" $dbUserName
        Write-Host "Email banco:" $dbEmail
        Write-Host "Nome banco:" $dbNome
        Write-Host "Nascimento banco:" $dbDataNascimento
    }

}
catch {

    Write-Host "FALHOU: erro durante atualizacao do perfil"
    Write-Host $_.ErrorDetails.Message

}
finally {

    # -------------------------------------------------
    # 5. Restaurar dados originais
    # -------------------------------------------------

    Write-Host "`n=== RESTAURANDO DADOS ORIGINAIS ==="

    $restoreBody = @{
        userName        = $originalUserName
        email           = $originalEmail
        nome_completo   = $originalNome
        data_nascimento = $originalDataNascimento
    } | ConvertTo-Json

    try {

        Invoke-RestMethod `
            -Uri "$baseUrl/users/$userId" `
            -Method Put `
            -ContentType "application/json" `
            -Body $restoreBody | Out-Null

        Write-Host "Dados originais restaurados"

    }
    catch {

        Write-Host "ATENCAO: nao foi possivel restaurar pela API"
        Write-Host $_.ErrorDetails.Message
    }
}