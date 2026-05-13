import { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import styles from './games.module.css'
import { Link } from 'react-router-dom'

function GameCard({ game, score }) {

  return (
    <div className={styles.gameCard}>
      {game.ultimo_acesso && (
        <div className={styles.lastAccessTag}>
          Último acesso:
          {' '}
          {new Date(game.ultimo_acesso).toLocaleDateString('pt-BR')}
        </div>
      )}

      
      <div className={styles.gameThumbnail}></div>

      <div className={styles.gameCardBody}>
        <h3>{game.titulo}</h3>
        <p>{game.descricao}</p>
      </div>

      <div className={styles.gameCardFooter}>
        <span className={styles.gameScore}>
          Pontuação: {game.pontuacao}
        </span>

     <Link to={`/games/${game.id_jogo}`}>
        <button className={styles.playButton}>
          Jogar
        </button>
      </Link>

      </div>

    </div>
  )
}

export default function Games() {

  const [games, setGames] = useState([])
  const [history, setHistory] = useState([])


  useEffect(() => {

    async function fetchGames() {
      try {
        const response = await fetch('http://localhost:3000/games')
        const data = await response.json()

        setHistory(data)
        setGames(data)

      } catch (error) {
        console.error('Erro ao buscar jogos:', error)
      }
    }

    fetchGames()
  }, [])

  return (

    <Layout activePage="games">
      <main className={styles.librarySection}>
        <div className={styles.gameGridContainer}>
          {games.map(game => (
            <GameCard
              key={game.id_jogo}
              game={game}
            />
          ))}
        </div>
      </main>
    </Layout>
  )
}