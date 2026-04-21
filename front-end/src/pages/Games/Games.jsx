import Layout from '../../components/Layout/Layout'
import styles from './games.module.css'

const bibliotecaDeJogos = [
  { id: 1, title: 'Cruzadinha Geométrica', score: '120', lastAccess: 'há 2 horas' },
  { id: 2, title: 'Maratona SBCB', score: 'X', lastAccess: null },
  { id: 3, title: 'Batalha Numérica', score: 'X', lastAccess: null },
  { id: 4, title: 'Desafio Lógico', score: '70', lastAccess: 'há 3 horas' },
  { id: 5, title: 'Quizz Cultural', score: '150', lastAccess: null },
  { id: 6, title: 'Caça-Palavras', score: '190', lastAccess: 'há 1 hora' },
]

function GameCard({ game }) {
  return (
    <div className={styles.gameCard}>
      {game.lastAccess && (
        <div className={styles.lastAccessTag}>
          Último acesso: {game.lastAccess}
        </div>
      )}

      <div className={styles.gameThumbnail}></div>

      <div className={styles.gameCardFooter}>
        <span className={styles.gameScore}>
          Pontuação: {game.score}
        </span>
        <button className={styles.playButton}>
          Jogar
        </button>
      </div>
    </div>
  )
}

export default function Games() {
  return (
    <Layout activePage="games">
      <main className={styles.librarySection}>
        <div className={styles.gameGridContainer}>
          {bibliotecaDeJogos.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    </Layout>
  )
}