import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play, Plus } from "lucide-react";

import { getGameById } from "../../services/gamesService";
import { getHistoryByUserAndGame } from "../../services/historyService";
import { getRankingByGame } from "../../services/friendsService";

import styles from "./gamesdetails.module.css";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [history, setHistory] = useState([]);
  const [ranking, setRanking] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tipoUsuario =
    localStorage.getItem("tipo_usuario");

  const perfilUsuario =
    localStorage.getItem("perfil_usuario");

  const isAdministrador =
    tipoUsuario === "Administrador";

  const isAluno =
    tipoUsuario === "Usuario" &&
    perfilUsuario === "Aluno";

  const isProfessor =
    tipoUsuario === "Usuario" &&
    perfilUsuario === "Professor";

  /*
   * Aluno pode jogar normalmente.
   * Administrador pode jogar para testes.
   * Professor não participa de partidas.
   */
  const podeJogar =
    isAluno || isAdministrador;

  /*
   * Ranking é uma funcionalidade competitiva
   * disponível apenas para o perfil Aluno.
   */
  const podeVerRanking =
    isAluno;

  const quantidadePartidas =
    history.length;

  const melhorPontuacao =
    history.length > 0
      ? Math.max(
          ...history.map((item) =>
            Number(item.pontos_obtidos)
          )
        )
      : 0;

  useEffect(() => {
    async function loadGame() {
      try {
        setLoading(true);
        setError("");

        const id_usuario = Number(
          localStorage.getItem("id_user")
        );

        if (!id_usuario) {
          throw new Error(
            "Usuário não autenticado"
          );
        }

        /*
         * Carrega os dados gerais do jogo
         * para qualquer perfil de usuário.
         */
        const gameData =
          await getGameById(id);

        setGame(gameData);

        /*
         * Histórico:
         * Aluno possui histórico normal.
         * Administrador possui histórico de teste.
         * Professor não participa de partidas.
         */
        if (podeJogar) {
          const historyData =
            await getHistoryByUserAndGame(
              id_usuario,
              id
            );

          setHistory(
            historyData ?? []
          );
        } else {
          setHistory([]);
        }

        /*
         * Ranking:
         * somente o perfil Aluno participa
         * e visualiza o ranking.
         */
        if (podeVerRanking) {
          const rankingData =
            await getRankingByGame(
              id_usuario,
              id
            );

          setRanking(
            rankingData ?? []
          );
        } else {
          setRanking([]);
        }

      } catch (err) {
        console.error(err);

        if (
          err.message ===
          "Usuário não autenticado"
        ) {
          setError(
            "Usuário não autenticado."
          );
        } else {
          setError(
            "Não foi possível carregar o jogo."
          );
        }

      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadGame();
    }

  }, [
    id,
    podeJogar,
    podeVerRanking
  ]);

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

        {/* ====================================================
            BOTÃO VOLTAR
           ==================================================== */}

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>


        {/* ====================================================
            INFORMAÇÕES DO JOGO
           ==================================================== */}

        <div className={styles.gameCard}>

          <img
            src={`/images/${game?.id_jogo}.jpeg`}
            alt={game?.titulo}
            className={styles.coverImage}
          />

          <div className={styles.content}>

            <span
              className={styles.gameCode}
            >
              #{game?.codigo_jogo}
            </span>

            <h1
              className={styles.gameTitle}
            >
              {game?.titulo}
            </h1>

            <p
              className={
                styles.gameDescription
              }
            >
              {game?.descricao}
            </p>


            {/* ================================================
                DADOS ADICIONAIS DO JOGO
               ================================================ */}

            <div
              className={styles.gameInfo}
            >

              <p>
                <strong>
                  Tempo estimado:
                </strong>{" "}
                {game?.tempo_estimado
                  ? `${game.tempo_estimado} minutos`
                  : "Não informado"}
              </p>

              <p>
                <strong>
                  Faixa etária:
                </strong>{" "}
                {game?.faixa_etaria ||
                  "Não informada"}
              </p>

              <p>
                <strong>
                  Jogadores:
                </strong>{" "}
                {game?.quantidade_jogadores
                  ? `${game.quantidade_jogadores} ${
                      game.quantidade_jogadores === 1
                        ? "jogador"
                        : "jogadores"
                    }`
                  : "Não informado"}
              </p>

            </div>


            {/* ================================================
                ALUNO
               ================================================ */}

            {isAluno && (
              <button
                type="button"
                className={
                  styles.playButton
                }
              >
                <Play
                  size={18}
                  fill="white"
                />

                Jogar
              </button>
            )}


            {/* ================================================
                ADMINISTRADOR
               ================================================ */}

            {isAdministrador && (
              <button
                type="button"
                className={
                  styles.playButton
                }
              >
                <Play
                  size={18}
                  fill="white"
                />

                Testar jogo
              </button>
            )}

          </div>
        </div>


        {/* ====================================================
            AMBIENTE DO PROFESSOR
            Preparado para implementação futura
           ==================================================== */}

        {isProfessor && (
          <div
            className={
              styles.scoreSection
            }
          >

            <h2
              className={
                styles.scoreTitle
              }
            >
              Atividades
            </h2>

            <p>
              Neste ambiente, o Professor
              poderá criar e gerenciar
              atividades pedagógicas
              associadas a este jogo.
            </p>

            <button
              type="button"
              className={
                styles.playButton
              }
              disabled
            >
              <Plus size={18} />

              Criar atividade
            </button>

            <div
              className={styles.empty}
            >
              Funcionalidade prevista para
              implementação futura.
            </div>

          </div>
        )}


        {/* ====================================================
            DESEMPENHO
            Aluno e Administrador
           ==================================================== */}

        {podeJogar && (
          <div
            className={
              styles.scoreSection
            }
          >

            <h2
              className={
                styles.scoreTitle
              }
            >
              {isAdministrador
                ? "Desempenho de Teste"
                : "Seu Desempenho"}
            </h2>

            <div
              className={
                styles.performanceInfo
              }
            >

              <div>

                <strong>
                  Melhor pontuação
                </strong>

                <span>
                  {melhorPontuacao}
                </span>

              </div>

              <div>

                <strong>
                  Partidas realizadas
                </strong>

                <span>
                  {quantidadePartidas}
                </span>

              </div>

            </div>


            {/* Informação específica do Admin */}

            {isAdministrador && (
              <p>
                As pontuações do
                Administrador são utilizadas
                somente para testes e não
                participam do ranking.
              </p>
            )}

          </div>
        )}


        {/* ====================================================
            HISTÓRICO DE PARTIDAS
            Aluno e Administrador
           ==================================================== */}

        {podeJogar && (
          <div
            className={
              styles.scoreSection
            }
          >

            <h2
              className={
                styles.scoreTitle
              }
            >
              {isAdministrador
                ? "Histórico de Testes"
                : "Histórico de Partidas"}
            </h2>


            {/* Nenhum histórico */}

            {(history?.length ?? 0) === 0 && (
              <div
                className={styles.empty}
              >
                {isAdministrador
                  ? "Nenhum teste realizado."
                  : "Nenhuma pontuação encontrada."}
              </div>
            )}


            {/* Histórico existente */}

            {(history?.length ?? 0) > 0 && (
              <table
                className={styles.table}
              >

                <thead>

                  <tr>
                    <th>Data</th>
                    <th>Pontos</th>
                    <th>Horário</th>
                  </tr>

                </thead>

                <tbody>

                  {history.map((item) => (
                    <tr
                      key={
                        item.id_historico
                      }
                    >

                      <td>
                        {new Date(
                          item.data_partida
                        ).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>

                      <td
                        className={
                          styles.points
                        }
                      >
                        {
                          item.pontos_obtidos
                        }
                      </td>

                      <td
                        className={
                          styles.points
                        }
                      >
                        {new Date(
                          item.data_partida
                        )
                          .toLocaleString(
                            "pt-BR",
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                              hour12:
                                false,
                            }
                          )
                          .replace(
                            ",",
                            " às"
                          )}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            )}

          </div>
        )}


        {/* ====================================================
            RANKING DE AMIGOS
            Somente Aluno
           ==================================================== */}

        {podeVerRanking && (
          <div
            className={
              styles.scoreSection
            }
          >

            <h2
              className={
                styles.scoreTitle
              }
            >
              Ranking de Amigos
            </h2>


            {/* Nenhum amigo encontrado */}

            {(ranking?.length ?? 0) === 0 && (
              <div
                className={styles.empty}
              >
                Nenhum amigo encontrado.
              </div>
            )}


            {/* Ranking existente */}

            {(ranking?.length ?? 0) > 0 && (
              <table
                className={styles.table}
              >

                <thead>

                  <tr>
                    <th>Posição</th>
                    <th>Jogador</th>

                    <th>
                      Melhor Pontuação
                    </th>

                    <th>
                      Partidas
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {ranking.map(
                    (player, index) => (
                      <tr
                        key={
                          player.id_usuario
                        }
                        className={
                          player.is_me
                            ? styles.myPosition
                            : ""
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {
                            player.nome_usuario
                          }

                          {player.is_me &&
                            " (Você)"}
                        </td>

                        <td
                          className={
                            styles.points
                          }
                        >
                          {
                            player.melhor_pontuacao
                          }
                        </td>

                        <td
                          className={
                            styles.points
                          }
                        >
                          {
                            player.quantidade_partidas
                          }
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </div>
        )}

      </section>

    </main>
  );
}