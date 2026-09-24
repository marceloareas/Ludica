import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, Flame } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import GameCard from '../../components/GameCard/GameCard';
import { getGames } from '../../services/gamesService';
import { getPerfilUsuario } from '../../utils/perfil';
import styles from './home.module.css';

const FILTROS = [
  { campo: 'nivel', label: 'Nível' },
  { campo: 'disciplina', label: 'Disciplina' },
  { campo: 'tema', label: 'Tema' },
  { campo: 'subtema', label: 'Subtema' },
  { campo: 'tipo_jogo', label: 'Tipo de jogo' },
];

const LIMITE_POPULARES = 6;

function normalizar(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function opcoesDoCampo(games, campo) {
  return [...new Set(games.map((game) => game[campo]).filter(Boolean))].sort();
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const busca = searchParams.get('busca') ?? '';
  const perfil = getPerfilUsuario();

  const [games, setGames] = useState([]);
  const [status, setStatus] = useState('loading');
  const [filtrosAtivos, setFiltrosAtivos] = useState(false);
  const [filtros, setFiltros] = useState({});

  useEffect(() => {
    const idUsuario = Number(localStorage.getItem('id_user'));

    getGames(idUsuario)
      .then((data) => {
        setGames(data);
        setStatus('ok');
      })
      .catch((error) => {
        console.error(error);
        setStatus('error');
      });
  }, []);

  const jogosFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return games.filter((game) => {
      const texto = normalizar(`${game.titulo} ${game.descricao ?? ''} ${game.disciplina ?? ''}`);
      if (termo && !texto.includes(termo)) return false;
      if (!filtrosAtivos) return true;
      return FILTROS.every(({ campo }) => !filtros[campo] || game[campo] === filtros[campo]);
    });
  }, [games, busca, filtros, filtrosAtivos]);

  const continueJogando = useMemo(
    () =>
      games
        .filter((game) => game.ultimo_acesso)
        .sort((a, b) => new Date(b.ultimo_acesso) - new Date(a.ultimo_acesso))
        .slice(0, 4),
    [games],
  );

  const mostrarTodos = busca || filtrosAtivos;
  const jogosExibidos = mostrarTodos ? jogosFiltrados : jogosFiltrados.slice(0, LIMITE_POPULARES);

  const handleFiltro = (campo, valor) => {
    setFiltros((atual) => ({ ...atual, [campo]: valor }));
  };

  return (
    <Layout activePage="home" theme="light">
      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Aprender brincando transforma o futuro.</h1>
            <p className={styles.heroSubtitle}>
              Jogos educacionais para explorar, criar e resolver desafios reais!
            </p>
          </div>

          <img
            src="/images/banner-ludica.jpg"
            alt="Leonardo da Vinci com a marca Lúdica"
            className={styles.heroBanner}
          />
        </section>

        <section>
          <div className={styles.sectionHeader}>
            {busca ? (
              <h2 className={styles.sectionTitle}>
                Resultados para “{busca}”
                <Link to="/home" className={styles.clearSearch}>
                  Limpar
                </Link>
              </h2>
            ) : (
              <h2 className={`${styles.sectionTitle} ${styles.highlight}`}>
                <Flame size={22} />
                Mais populares
              </h2>
            )}

            <div className={styles.headerActions}>
              <label className={styles.filterToggle}>
                Filtrar resultados
                <button
                  type="button"
                  role="switch"
                  aria-checked={filtrosAtivos}
                  className={`${styles.switch} ${filtrosAtivos ? styles.switchOn : ''}`}
                  onClick={() => setFiltrosAtivos((ativo) => !ativo)}
                >
                  <span className={styles.switchThumb} />
                </button>
              </label>

              <Link to="/games" className={styles.seeAll}>
                Ver todos
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {filtrosAtivos && (
            <div className={styles.filterBar}>
              {FILTROS.map(({ campo, label }) => {
                const opcoes = opcoesDoCampo(games, campo);

                return (
                  <label key={campo} className={styles.select}>
                    <select
                      value={filtros[campo] ?? ''}
                      onChange={(e) => handleFiltro(campo, e.target.value)}
                      disabled={opcoes.length === 0}
                      aria-label={label}
                    >
                      <option value="">{label}</option>
                      {opcoes.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </label>
                );
              })}
            </div>
          )}

          {status === 'error' && (
            <p className={styles.feedback}>Não foi possível carregar os jogos. Tente novamente mais tarde.</p>
          )}

          {status === 'ok' && jogosExibidos.length === 0 && (
            <p className={styles.feedback}>Nenhum jogo encontrado.</p>
          )}

          <div className={styles.gameGrid}>
            {status === 'loading'
              ? Array.from({ length: LIMITE_POPULARES }, (_, i) => (
                  <div key={i} className={styles.skeleton} />
                ))
              : jogosExibidos.map((game) => (
                  <GameCard key={game.id_jogo} game={game} perfil={perfil} />
                ))}
          </div>
        </section>

        {!busca && continueJogando.length > 0 && (
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Continue jogando</h2>
            </div>

            <div className={styles.continueGrid}>
              {continueJogando.map((game) => (
                <Link key={game.id_jogo} to={`/games/${game.id_jogo}`} className={styles.continueCard}>
                  <span className={styles.continueThumb}>
                    {game.imagem && <img src={game.imagem} alt="" />}
                  </span>
                  <span className={styles.continueText}>
                    <strong>{game.titulo}</strong>
                    <small>
                      Último acesso em {new Date(game.ultimo_acesso).toLocaleDateString('pt-BR')}
                    </small>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
