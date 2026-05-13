import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Play } from "lucide-react";
import { getGameById } from "../../services/gamesService";
import { getHistoryByUserAndGame } from "../../services/historyService";
import styles from "./gamesdetails.module.css";

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadGame() {

      try {

        setLoading(true);

        // TEMPORÁRIO
        // depois pega do login
        const id_usuario = 1;

        const gameData =
          await getGameById(id);

        const historyData =
          await getHistoryByUserAndGame(
            id_usuario,
            id
          );

        setGame(gameData);

        setHistory(historyData);

      } catch (err) {

        console.error(err);

        setError(
          "Não foi possível carregar o jogo."
        );

      } finally {

        setLoading(false);
      }
    }

    if (id) {
      loadGame();
    }

  }, [id]);

  if (loading) {

    return (
      <div className={styles.loading}>
        Carregando jogo...
      </div>
    );
  }

  if (error) {

    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  return (
    <main className={styles.page}>

      <section className={styles.container}>

        <div className={styles.gameCard}>

          <img
            src={`/images/${game.id_jogo}.jpeg`}
            alt={game.titulo}
            className={styles.coverImage}
          />

          <div className={styles.content}>

            <span className={styles.gameCode}>
              #{game.codigo_jogo}
            </span>

            <h1 className={styles.gameTitle}>
              {game.titulo}
            </h1>

            <p className={styles.gameDescription}>
              {game.descricao}
            </p>

            <button className={styles.playButton}>
              <Play
                size={18}
                fill="white"
              />

              Jogar
            </button>

          </div>

        </div>

        <div className={styles.scoreSection}>

          <h2 className={styles.scoreTitle}>
            Tabela de Pontuação
          </h2>

          {
            history.length === 0 && (

              <div className={styles.empty}>
                Nenhuma pontuação encontrada.
              </div>
            )
          }

          {
            history.length > 0 && (

            <table className={styles.table}>

              <thead>
                  <tr>
                    <th>Data</th>
                    <th>Pontos</th>
                  </tr>

                </thead>

                <tbody>

                  {
                    history.map((item) => (

                      <tr key={item.id_historico}>

                        <td>
                          {
                            new Date(item.data_partida)
                              .toLocaleDateString("pt-BR")
                          }
                        </td>

                        <td className={styles.points}>
                          {item.pontos_obtidos}
                        </td>

                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
          }

        </div>
      </section>
    </main>
  );
}