Write-Host ""
Write-Host "=== TESTE: detalhamento do jogo ==="
Write-Host ""

$baseUrl = "http://localhost:3000"

try {

    # ============================================================
    # TESTE 1 - DADOS ADICIONAIS DO JOGO
    # ============================================================

    Write-Host "=== TESTE 1: dados adicionais do jogo ==="

    $game = Invoke-RestMethod `
        -Uri "$baseUrl/games/1" `
        -Method Get

    if (
        $null -ne $game.tempo_estimado -and
        $null -ne $game.faixa_etaria -and
        $null -ne $game.quantidade_jogadores
    ) {
        Write-Host "PASSOU: jogo possui os novos campos"
        Write-Host "Titulo: $($game.titulo)"
        Write-Host "Tempo estimado: $($game.tempo_estimado) minutos"
        Write-Host "Faixa etaria: $($game.faixa_etaria)"
        Write-Host "Quantidade de jogadores: $($game.quantidade_jogadores)"
    }
    else {
        Write-Host "FALHOU: um ou mais campos adicionais nao foram retornados"
        exit 1
    }

    Write-Host ""

    # ============================================================
    # TESTE 2 - HISTORICO E DESEMPENHO DO USUARIO
    # ============================================================

    Write-Host "=== TESTE 2: desempenho do usuario ==="

    $history = Invoke-RestMethod `
        -Uri "$baseUrl/history/1/1" `
        -Method Get

    $quantidadePartidas = $history.Count

    if ($quantidadePartidas -eq 0) {
        Write-Host "FALHOU: nenhum historico encontrado para o usuario"
        exit 1
    }

    $pontuacoes = $history.pontos_obtidos

    if ($null -eq $pontuacoes) {
        Write-Host "FALHOU: campo pontos_obtidos nao encontrado"
        exit 1
    }

    $melhorPontuacao = (
        $pontuacoes |
        Measure-Object -Maximum
    ).Maximum

    Write-Host "PASSOU: desempenho calculado corretamente"
    Write-Host "Quantidade de partidas: $quantidadePartidas"
    Write-Host "Melhor pontuacao: $melhorPontuacao"

    Write-Host ""

    # ============================================================
    # TESTE 3 - RANKING COM MELHOR PONTUACAO E PARTIDAS
    # ============================================================

    Write-Host "=== TESTE 3: ranking de amigos ==="

    $ranking = Invoke-RestMethod `
        -Uri "$baseUrl/friends/ranking/1/1" `
        -Method Get

    if ($ranking.Count -eq 0) {
        Write-Host "FALHOU: ranking nao retornou jogadores"
        exit 1
    }

    $rankingValido = $true

    foreach ($player in $ranking) {

        if ($null -eq $player.melhor_pontuacao) {
            Write-Host "FALHOU: jogador sem campo melhor_pontuacao"
            $rankingValido = $false
        }

        if ($null -eq $player.quantidade_partidas) {
            Write-Host "FALHOU: jogador sem campo quantidade_partidas"
            $rankingValido = $false
        }
    }

    if (-not $rankingValido) {
        exit 1
    }

    Write-Host "PASSOU: ranking retorna melhor pontuacao e quantidade de partidas"
    Write-Host ""

    foreach ($player in $ranking) {

        $identificacao = $player.nome_usuario

        if ($player.is_me) {
            $identificacao += " (Voce)"
        }

        Write-Host "Jogador: $identificacao"
        Write-Host "Melhor pontuacao: $($player.melhor_pontuacao)"
        Write-Host "Partidas: $($player.quantidade_partidas)"
        Write-Host "---"
    }

    Write-Host ""

    # ============================================================
    # TESTE 4 - ORDENACAO DO RANKING
    # ============================================================

    Write-Host "=== TESTE 4: ordenacao por melhor pontuacao ==="

    $ordenacaoValida = $true

    for ($i = 0; $i -lt ($ranking.Count - 1); $i++) {

        $atual = [int]$ranking[$i].melhor_pontuacao
        $proximo = [int]$ranking[$i + 1].melhor_pontuacao

        if ($atual -lt $proximo) {
            $ordenacaoValida = $false
            break
        }
    }

    if ($ordenacaoValida) {
        Write-Host "PASSOU: ranking esta ordenado pela melhor pontuacao"
    }
    else {
        Write-Host "FALHOU: ranking nao esta ordenado corretamente"
        exit 1
    }

    Write-Host ""

    # ============================================================
    # TESTE 5 - CONSISTENCIA ENTRE HISTORICO E RANKING
    # ============================================================

    Write-Host "=== TESTE 5: consistencia dos dados ==="

    $meuRanking = $ranking |
        Where-Object { $_.is_me -eq $true } |
        Select-Object -First 1

    if ($null -eq $meuRanking) {
        Write-Host "FALHOU: usuario atual nao encontrado no ranking"
        exit 1
    }

    if (
        [int]$meuRanking.quantidade_partidas -eq $quantidadePartidas -and
        [int]$meuRanking.melhor_pontuacao -eq $melhorPontuacao
    ) {
        Write-Host "PASSOU: historico e ranking apresentam dados consistentes"
        Write-Host "Partidas: $quantidadePartidas"
        Write-Host "Melhor pontuacao: $melhorPontuacao"
    }
    else {
        Write-Host "FALHOU: historico e ranking possuem valores diferentes"
        Write-Host ""

        Write-Host "Historico:"
        Write-Host "Partidas: $quantidadePartidas"
        Write-Host "Melhor pontuacao: $melhorPontuacao"

        Write-Host ""

        Write-Host "Ranking:"
        Write-Host "Partidas: $($meuRanking.quantidade_partidas)"
        Write-Host "Melhor pontuacao: $($meuRanking.melhor_pontuacao)"

        exit 1
    }

    Write-Host ""
    Write-Host "=== TODOS OS TESTES DO DETALHAMENTO PASSARAM ==="
    Write-Host ""

}
catch {

    Write-Host ""
    Write-Host "ERRO DURANTE O TESTE:"
    Write-Host $_.Exception.Message
    Write-Host ""

    exit 1
}