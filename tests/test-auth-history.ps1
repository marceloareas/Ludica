# ============================================
# Testes - Usuário autenticado em jogos/histórico
# ============================================

$baseUrl = "http://localhost:3000"

Write-Host "`n=== TESTE 1: /games exige usuario ==="

try {
    Invoke-RestMethod `
        -Uri "$baseUrl/games" `
        -Method Get

    Write-Host "FALHOU: /games permitiu consulta sem usuario"
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "PASSOU: /games exige identificacao do usuario"
    }
    else {
        Write-Host "FALHOU: ocorreu outro erro"
        Write-Host $_.ErrorDetails.Message
    }
}


Write-Host "`n=== TESTE 2: dados mudam conforme usuario ==="

try {
    $alice = Invoke-RestMethod `
        -Uri "$baseUrl/games?id_usuario=1" `
        -Method Get

    $bob = Invoke-RestMethod `
        -Uri "$baseUrl/games?id_usuario=2" `
        -Method Get

    if (($alice.Count -eq 0) -or ($bob.Count -eq 0)) {
        Write-Host "FALHOU: nenhum jogo foi retornado"
    }
    else {
        $diferencaEncontrada = $false

        for ($i = 0; $i -lt [Math]::Min($alice.Count, $bob.Count); $i++) {
            if ($alice[$i].pontuacao -ne $bob[$i].pontuacao) {
                $diferencaEncontrada = $true
                break
            }
        }

        if ($diferencaEncontrada) {
            Write-Host "PASSOU: /games retorna dados especificos de cada usuario"
        }
        else {
            Write-Host "FALHOU: Alice e Bob receberam as mesmas pontuacoes"
        }
    }
}
catch {
    Write-Host "FALHOU: erro ao consultar /games"
    Write-Host $_.ErrorDetails.Message
}


Write-Host "`n=== TESTE 3: historico por usuario ==="

try {
    $jogos = Invoke-RestMethod `
        -Uri "$baseUrl/games?id_usuario=1" `
        -Method Get

    if ($jogos.Count -eq 0) {
        Write-Host "FALHOU: nenhum jogo encontrado para testar historico"
    }
    else {
        $idJogo = $jogos[0].id_jogo

        $historicoAlice = Invoke-RestMethod `
            -Uri "$baseUrl/history/1/$idJogo" `
            -Method Get

        $historicoBob = Invoke-RestMethod `
            -Uri "$baseUrl/history/2/$idJogo" `
            -Method Get

        Write-Host "Jogo usado no teste:" $idJogo
        Write-Host "Partidas Alice:" $historicoAlice.Count
        Write-Host "Partidas Bob:" $historicoBob.Count

        if (($historicoAlice.Count -gt 0) -and ($historicoBob.Count -gt 0)) {
            Write-Host "PASSOU: historico aceita usuarios diferentes"
        }
        else {
            Write-Host "ATENCAO: um dos usuarios nao possui historico para esse jogo"
        }
    }
}
catch {
    Write-Host "FALHOU: erro ao consultar historico"
    Write-Host $_.ErrorDetails.Message
}