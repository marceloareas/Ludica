import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout/Layout";
import styles from "./games.module.css";

function GameCard({
  game,
  isAluno,
  isProfessor,
  isAdministrador,
}) {
  return (
    <div className={styles.gameCard}>

      {game.ultimo_acesso && (
        <div className={styles.lastAccessTag}>
          Último acesso:{" "}
          {new Date(
            game.ultimo_acesso
          ).toLocaleDateString("pt-BR")}
        </div>
      )}

      <img
        src={game.imagem}
        alt={game.titulo}
        className={styles.gameThumbnail}
      />

      <div className={styles.gameCardFooter}>

        {/* =============================================
            ALUNO
           ============================================= */}

        {isAluno && (
          <>
            <span className={styles.gameScore}>
              Melhor pontuação:{" "}
              {game.pontuacao ?? 0}
            </span>

            <Link to={`/games/${game.id_jogo}`}>
              <button
                type="button"
                className={styles.playButton}
              >
                Jogar
              </button>
            </Link>
          </>
        )}


        {/* =============================================
            PROFESSOR
           ============================================= */}

        {isProfessor && (
          <>
            <span className={styles.gameScore}>
              Ambiente de atividades
            </span>

            <Link to={`/games/${game.id_jogo}`}>
              <button
                type="button"
                className={styles.playButton}
              >
                Entrar
              </button>
            </Link>
          </>
        )}


        {/* =============================================
            ADMINISTRADOR
           ============================================= */}

        {isAdministrador && (
          <>
            <span className={styles.gameScore}>
              Ambiente de teste
            </span>

            <Link to={`/games/${game.id_jogo}`}>
              <button
                type="button"
                className={styles.playButton}
              >
                Testar
              </button>
            </Link>
          </>
        )}

      </div>

    </div>
  );
}


export default function Games() {
  const [games, setGames] = useState([]);

  /*
   * Informações recuperadas no login.
   */
  const tipoUsuario =
    localStorage.getItem("tipo_usuario");

  const perfilUsuario =
    localStorage.getItem("perfil_usuario");

  /*
   * Identificação do perfil.
   */
  const isAluno =
    tipoUsuario === "Usuario" &&
    perfilUsuario === "Aluno";

  const isProfessor =
    tipoUsuario === "Usuario" &&
    perfilUsuario === "Professor";

  const isAdministrador =
    tipoUsuario === "Administrador";


  useEffect(() => {
    async function fetchGames() {
      try {
        const idUsuario = Number(
          localStorage.getItem("id_user")
        );

        if (!idUsuario) {
          throw new Error(
            "Usuário não autenticado"
          );
        }

        const response = await fetch(
          `http://localhost:3000/games?id_usuario=${idUsuario}`
        );

        if (!response.ok) {
          throw new Error(
            "Erro ao buscar jogos"
          );
        }

        const data =
          await response.json();

        console.log(
          "Dados recebidos da API:",
          data
        );

        console.log(
          "Tipo de usuário:",
          tipoUsuario
        );

        console.log(
          "Perfil do usuário:",
          perfilUsuario
        );

        setGames(data);

      } catch (error) {
        console.error(
          "Erro ao buscar jogos:",
          error
        );
      }
    }

    fetchGames();

  }, [
    tipoUsuario,
    perfilUsuario
  ]);


  return (
    <Layout activePage="games">

      <main className={styles.librarySection}>

        <div
          className={
            styles.gameGridContainer
          }
        >

          {games.map((game) => (
            <GameCard
              key={game.id_jogo}
              game={game}
              isAluno={isAluno}
              isProfessor={isProfessor}
              isAdministrador={
                isAdministrador
              }
            />
          ))}

        </div>

      </main>

    </Layout>
  );
}