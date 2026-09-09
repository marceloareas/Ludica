# ============================================
# Testes - Unicidade da Gamertag
# ============================================

$baseUrl = "http://localhost:3000"

Write-Host "`n=== TESTE 1: Gamertag duplicada ==="

$body = @{
    name      = "Teste Automatizado"
    userName  = "alice"
    email     = "teste.duplicado.$(Get-Random)@ludica.com"
    password  = "123456"
    birthDate = "2000-01-01"
} | ConvertTo-Json

try {
    Invoke-RestMethod `
        -Uri "$baseUrl/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    Write-Host "FALHOU: permitiu Gamertag duplicada"
}
catch {
    try {
        $respostaErro = $_.ErrorDetails.Message | ConvertFrom-Json

        if ($respostaErro.error -match "Gamertag.*uso") {
            Write-Host "PASSOU: Gamertag duplicada foi bloqueada"
        }
        else {
            Write-Host "FALHOU: API retornou um erro diferente"
            Write-Host $respostaErro.error
        }
    }
    catch {
        Write-Host "FALHOU: não foi possível interpretar a resposta da API"
        Write-Host $_.Exception.Message
    }
}

Write-Host "`n=== TESTE 2: Nova Gamertag ==="

$id = Get-Random

$body = @{
    name      = "Teste Novo Usuario"
    userName  = "teste_$id"
    email     = "teste.$id@ludica.com"
    password  = "123456"
    birthDate = "2000-01-01"
} | ConvertTo-Json

try {
    $resultado = Invoke-RestMethod `
        -Uri "$baseUrl/users/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body

    Write-Host "PASSOU: nova Gamertag foi cadastrada"
    Write-Host "ID criado:" $resultado.id_usuario
    Write-Host "Gamertag:" $resultado.nome_usuario
}
catch {
    Write-Host "FALHOU: não foi possível cadastrar nova Gamertag"
    Write-Host $_.ErrorDetails.Message
}