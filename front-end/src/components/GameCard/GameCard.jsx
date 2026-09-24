import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Gamepad2, Star } from 'lucide-react';
import styles from './gameCard.module.css';

const ACTION_LABEL = {
  aluno: 'Jogar',
  professor: 'Entrar',
  admin: 'Testar',
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function GameCard({ game, perfil = 'aluno' }) {
  return (
    <Link to={`/games/${game.id_jogo}`} className={styles.card}>
      <div className={styles.cover}>
        {game.imagem ? (
          <img src={game.imagem} alt="" className={styles.image} />
        ) : (
          <Gamepad2 size={40} className={styles.placeholder} />
        )}

        {game.ultimo_acesso && (
          <span className={styles.tag}>
            <Clock size={12} />
            {formatDate(game.ultimo_acesso)}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{game.titulo}</h3>
        <p className={styles.description}>{game.descricao}</p>

        {game.disciplina && <span className={styles.subject}>{game.disciplina}</span>}

        <div className={styles.footer}>
          {perfil === 'aluno' ? (
            <span className={styles.score}>
              <Star size={14} />
              {game.pontuacao ?? 0} pts
            </span>
          ) : (
            <span />
          )}

          <span className={styles.action}>
            {ACTION_LABEL[perfil]}
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
