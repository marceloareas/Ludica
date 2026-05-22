import { Link, useNavigate } from 'react-router-dom'; // Importe tudo do mesmo pacote
import styles from './navbar.module.css';

export default function Navbar({ activePage }) {
  // O hook DEVE ser chamado aqui dentro
  const navigate = useNavigate();

  const handleLogout = () => {
    // É importante limpar o localStorage para o usuário realmente deslogar
    localStorage.removeItem('id_user');
    localStorage.removeItem('avatar');
    
    // Agora redireciona para a tela de Login ou Home
    navigate('/'); 
  };

  return (
    <header className={styles.homeHeader}>
      <nav className={styles.headerNav}>
        <Link
          to="/home"
          className={`${styles.navItem} ${activePage === 'home' ? styles.active : ''}`}
        >
          HOME
        </Link>

        <Link
          to="/amigos"
          className={`${styles.navItem} ${activePage === 'amigos' ? styles.active : ''}`}
        >
          AMIGOS
        </Link>

        <Link
          to="/games"
          className={`${styles.navItem} ${activePage === 'games' ? styles.active : ''}`}
        >
          BIBLIOTECA
        </Link>

        <Link
          to="/Avatar"
          className={`${styles.navItem} ${activePage === 'Avatar' ? styles.active : ''}`}
        >
          AVATAR
        </Link>
      </nav>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar jogos"
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>🔍</button>
      </div>

      <div>
        <Link to="/">
        <button className={styles.buttonLogout}>
          <img
            src={`/images/logout.png`}
            className={styles.imageLogout}
          />
        </button>
        </Link>
      </div>
    </header>
  );
}