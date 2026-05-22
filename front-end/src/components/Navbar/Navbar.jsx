import { Link } from 'react-router-dom'
import styles from './navbar.module.css'

export default function Navbar({ activePage }) {
  return (
    <header className={styles.homeHeader}>
      <nav className={styles.headerNav}>
        <Link
          to="/home"
          className={`${styles.navItem} ${activePage === 'home' ? styles.active : ''}`}
        >
          HOME
        </Link>

        {/* <Link
          to="/perfil"
          className={`${styles.navItem} ${activePage === 'perfil' ? styles.active : ''}`}
        >
          PERFIL
        </Link> */}

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
  )
}