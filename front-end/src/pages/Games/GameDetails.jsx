import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Cake,
  Clock,
  Gamepad2,
  Play,
  Plus,
  Trophy,
  Users,
} from "lucide-react";

import Layout from "../../components/Layout/Layout";
import { getGameById } from "../../services/gamesService";
import { getHistoryByUserAndGame } from "../../services/historyService";
import { getRankingByGame } from "../../services/friendsService";
import { getPerfilUsuario } from "../../utils/perfil";

import styles from "./gamesdetails.module.css";

function formatDate(date, options) {
  return new Date(date).toLocaleString("pt-BR", options);
}

function GameInfo({ game }) {
  const jogadores = game.quantidade_jogadores;

  const itens = [
    {
      chave: "tempo",
      icon: <Clock size={16} />,
      texto: game.tempo_estimado ? `${game.tempo_estimado} min por partida` : null,
    },
    {
      chave: "idade",
      icon: <Cake size={16} />,
      texto: game.faixa_etaria,
    },
    {
      chave: "jogadores",
      icon: <Users size={16} />,
      texto: jogadores ? `${jogadores} ${jogadores === 1 ? "jogador" : "jogadores"}` : null,
    },
  ];

  return (
    <ul className={styles.infoList}>
      {itens.map(({ chave, icon, texto }) => (
        <li key={chave} className={styles.infoItem}>
          {icon}
          {texto ?? "Não informado"}
        </li>
      ))}
    </ul>
  );
}

function Performance({ history, isAdmin }) {
  if (history.length === 0) {
    return (
      <div className={styles.invite}>
        <Trophy size={28} />
        <p>
          {isAdmin
            ? "Nenhum teste realizado ainda."
            : "Você ainda não jogou. Que tal fazer sua primeira partida?"}
        </p>
      </div>
    );
  }

  const melhor = Math.max(...history.map((item) => Number(item.pontos_obtidos)));
  const ultima = history[0].pontos_obtidos;

  const stats = [
    { label: "Melhor", valor: melhor },
    { label: "Partidas", valor: history.length },
    { label: "Última", valor: ultima },
  ];

  return (
    <div className={styles.stats}>
      {stats.map(({ label, valor }) => (
        <div key={label} className={styles.statCard}>
          <span>{label}</span>
          <strong>{valor}</strong>
        </div>
      ))}
    </div>
  );
}

function Ranking({ ranking }) {
  if (ranking.length <= 1) {
    return (
      <p className={styles.empty}>
        Adicione amigos para comparar pontuações.{" "}
        <Link to="/amigos">Ir para Amigos</Link>
      </p>
    );
  }

  return (
    <ol className={styles.ranking}>
      {ranking.map((player, index) => (
        <li
          key={player.id_usuario}
          className={`${styles.rankingItem} ${player.is_me ? styles.me : ""}`}
        >
          <span className={styles.position}>{index + 1}</span>

          <span className={styles.player}>
            @{player.nome_usuario}
            {player.is_me && <small> (você)</small>}
          </span>

          <span className={styles.playerStats}>
            <strong>{player.melhor_pontuacao}</strong>
            <small>
              {player.quantidade_partidas}{" "}
              {player.quantidade_partidas === 1 ? "partida" : "partidas"}
            </small>
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const perfil = getPerfilUsuario();

  const [game, setGame] = useState(null);
  const [history, setHistory] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [status, setStatus] = useState("loading");

  const isAluno = perfil === "aluno";
  const isAdmin = perfil === "admin";
  const isProfessor = perfil === "professor";
  // Professor não joga; partidas do Admin são só de teste e ficam fora do ranking
  const podeJogar = isAluno || isAdmin;

  useEffect(() => {
    const idUsuario = Number(localStorage.getItem("id_user"));

    async function loadGame() {
      try {
        const [gameData, historyData, rankingData] = await Promise.all([
          getGameById(id),
          podeJogar ? getHistoryByUserAndGame(idUsuario, id) : [],
          isAluno ? getRankingByGame(idUsuario, id) : [],
        ]);

        setGame(gameData);
        setHistory(historyData ?? []);
        setRanking(rankingData ?? []);
        setStatus("ok");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    }

    loadGame();
  }, [id, podeJogar, isAluno]);

  return (
    <Layout activePage="games" theme="light">
      <main className={styles.page}>
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Voltar
        </button>

        {status === "loading" && <p className={styles.feedback}>Carregando jogo...</p>}
        {status === "error" && (
          <p className={styles.feedback}>Não foi possível carregar o jogo.</p>
        )}

        {status === "ok" && (
          <>
            <section className={`${styles.card} ${styles.hero}`}>
              <div className={styles.cover}>
                {game.url_imagem ? (
                  <img src={game.url_imagem} alt="" />
                ) : (
                  <Gamepad2 size={48} />
                )}
              </div>

              <div className={styles.heroContent}>
                <span className={styles.code}>#{game.codigo_jogo?.trim()}</span>
                <h1 className={styles.title}>{game.titulo}</h1>
                {game.autor && <span className={styles.author}>por @{game.autor}</span>}

                <GameInfo game={game} />

                {podeJogar && (
                  <button type="button" className={styles.playButton}>
                    <Play size={18} fill="currentColor" />
                    {isAdmin ? "Testar jogo" : "Jogar"}
                  </button>
                )}
              </div>
            </section>

            <div className={styles.grid}>
              <div className={styles.column}>
                <section className={styles.card}>
                  <h2 className={styles.sectionTitle}>Sobre o jogo</h2>
                  <p className={styles.description}>{game.descricao}</p>
                </section>

                {podeJogar && (
                  <section className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                      {isAdmin ? "Desempenho de teste" : "Meu desempenho"}
                    </h2>
                    <Performance history={history} isAdmin={isAdmin} />

                    {isAdmin && (
                      <p className={styles.note}>
                        Pontuações do Administrador servem apenas para teste e não entram no ranking.
                      </p>
                    )}
                  </section>
                )}

                {history.length > 0 && (
                  <section className={styles.card}>
                    <h2 className={styles.sectionTitle}>Histórico de partidas</h2>

                    <ul className={styles.history}>
                      {history.map((item) => (
                        <li key={item.id_historico}>
                          <span>
                            {formatDate(item.data_partida, { dateStyle: "short" })}
                            <small>
                              {formatDate(item.data_partida, { hour: "2-digit", minute: "2-digit" })}
                            </small>
                          </span>
                          <strong>{item.pontos_obtidos} pts</strong>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <aside className={styles.column}>
                {isAluno && (
                  <section className={styles.card}>
                    <h2 className={styles.sectionTitle}>Ranking dos amigos</h2>
                    <Ranking ranking={ranking} />
                  </section>
                )}

                {isProfessor && (
                  <section className={styles.card}>
                    <h2 className={styles.sectionTitle}>Atividades</h2>
                    <p className={styles.empty}>
                      Em breve você poderá criar e acompanhar atividades pedagógicas com este jogo.
                    </p>
                    <button type="button" className={styles.secondaryButton} disabled>
                      <Plus size={18} />
                      Criar atividade
                    </button>
                  </section>
                )}
              </aside>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
