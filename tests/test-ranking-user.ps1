$baseUrl = "http://localhost:3000"

Write-Host "`n=== TESTE: ranking por usuario ==="

try {
    $rankingAlice = Invoke-RestMethod `
        -Uri "$baseUrl/friends/ranking/1/1" `
        -Method Get

    $rankingBob = Invoke-RestMethod `
        -Uri "$baseUrl/friends/ranking/2/1" `
        -Method Get

    Write-Host "Quantidade de registros - Alice:" $rankingAlice.Count
    Write-Host "Quantidade de registros - Bob:" $rankingBob.Count

    $aliceJson = $rankingAlice | ConvertTo-Json -Depth 5
    $bobJson = $rankingBob | ConvertTo-Json -Depth 5

    if ($aliceJson -ne $bobJson) {
        Write-Host "PASSOU: ranking considera usuarios diferentes"
    }
    else {
        Write-Host "ATENCAO: rankings retornados sao iguais"
        Write-Host "Isso pode ser valido caso os usuarios tenham a mesma rede de amigos."
    }
}
catch {
    Write-Host "FALHOU: erro ao consultar ranking"
    Write-Host $_.ErrorDetails.Message
}