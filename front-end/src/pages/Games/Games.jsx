import { Header, Footer } from '../Home/Home'
import './games.css'

// Dados fictícios por enquanto
const bibliotecaDeJogos = [
  { id: 1, title: 'Cruzadinha Geométrica', score: '120', lastAccess: 'há 2 horas' },
  { id: 2, title: 'Maratona SBCB', score: 'X', lastAccess: null },
  { id: 3, title: 'Batalha Numérica', score: 'X', lastAccess: null },
  { id: 4, title: 'Desafio Lógico', score: '70', lastAccess: 'há 3 horas' },
  { id: 5, title: 'Quizz Cultural', score: '150', lastAccess: null },
  { id: 6, title: 'Caça-Palavras', score: '190', lastAccess: 'há 1 hora' },
]

// Componente para um cartão de jogo 
function GameCard({ game }) {
  return (
    <div className="game-card">
      {/* Tag de último acesso (se existir) */}
      {game.lastAccess && (
        <div className="last-access-tag">
          Último acesso: {game.lastAccess}
        </div>
      )}
      
      {/* Área branca para a imagem/thumbnail do jogo */}
      <div className="game-thumbnail">
        {/* Futuramente: <img src={game.imageUrl} alt={game.title} /> */}
      </div>
      
      {/* Footer do cartão com pontuação e botão */}
      <div className="game-card-footer">
        <span className="game-score">Pontuação: {game.score}</span>
        <button className="play-button">Jogar</button>
      </div>
    </div>
  )
}

export function Games() {
  return (
    <div className="main-layout">
      <Header activePage="biblioteca" />

      <main className="library-section">

        {/* Grade de Jogos */}
        <div className="game-grid-container">
          {bibliotecaDeJogos.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Games