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
          to="/perfil"
          className={`${styles.navItem} ${activePage === 'perfil' ? styles.active : ''}`}
        >
          PERFIL
        </Link>
      </nav>
      
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