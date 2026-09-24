import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, Search } from 'lucide-react';
import { AvatarDisplay } from '../Avatar/AvatarDisplay';
import styles from './navbar.module.css';

const NAV_ITEMS = [
  { to: '/home', page: 'home', label: 'Início' },
  { to: '/games', page: 'games', label: 'Biblioteca' },
  { to: '/amigos', page: 'amigos', label: 'Amigos' },
];

const SESSION_KEYS = [
  'token',
  'userName',
  'id_user',
  'email',
  'nome_completo',
  'data_nascimento',
  'avatar',
  'tipo_usuario',
  'perfil_usuario',
];

function readAvatar() {
  try {
    return JSON.parse(localStorage.getItem('avatar'));
  } catch {
    return null;
  }
}

export default function Navbar({ activePage }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get('busca') ?? '');

  const userName = localStorage.getItem('userName') ?? '';
  const avatarConfig = readAvatar();

  const handleSearch = (e) => {
    e.preventDefault();
    const termo = busca.trim();
    navigate(termo ? `/home?busca=${encodeURIComponent(termo)}` : '/home');
  };

  const handleLogout = () => {
    SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
    navigate('/');
  };

  return (
    <header className={styles.homeHeader}>
      <Link to="/home" className={styles.logo}>
        LÚDICA
      </Link>

      <nav className={styles.headerNav}>
        {NAV_ITEMS.map(({ to, page, label }) => (
          <Link
            key={page}
            to={to}
            className={`${styles.navItem} ${activePage === page ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <form className={styles.searchContainer} onSubmit={handleSearch} role="search">
        <Search size={18} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Buscar jogos, temas ou disciplinas..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </form>

      <div className={styles.userArea}>
        <Link
          to="/perfil"
          className={`${styles.userLink} ${activePage === 'perfil' ? styles.active : ''}`}
        >
          <span className={styles.userAvatar}>
            {avatarConfig ? (
              <AvatarDisplay config={avatarConfig} size={40} />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </span>
          @{userName}
        </Link>

        <button
          type="button"
          className={styles.buttonLogout}
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
