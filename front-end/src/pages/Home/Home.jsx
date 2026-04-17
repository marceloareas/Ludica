import { Link } from 'react-router-dom'
import './Home.css'

export function Header({ activePage }) {
  return (
    <header className="home-header">
      <nav className="header-nav">
        <Link to="/home" className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>HOME</Link>
        <Link to="/perfil" className={`nav-item ${activePage === 'perfil' ? 'active' : ''}`}>PERFIL</Link>
        <Link to="/amigos" className={`nav-item ${activePage === 'amigos' ? 'active' : ''}`}>AMIGOS</Link>
        <Link to="/biblioteca" className={`nav-item ${activePage === 'games' ? 'active' : ''}`}>BIBLIOTECA</Link>
      </nav>
      
      <div className="search-container">
        <input type="text" placeholder="Buscar jogos" className="search-input" />
        <button className="search-button">🔍</button>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-left">
        <span className="footer-logo">LOGO</span>
        <span className="footer-description">Plataforma Lúdica de Jogos para Estudos</span>
      </div>
      <div className="footer-right">
        <a href="/about" className="footer-link">About us</a>
        <a href="/contact" className="footer-link">Contact us</a>
      </div>
    </footer>
  )
}

export function Home() {
  return (
    <div className="main-layout">
      <Header activePage="home" />

      <main className="avatar-section">
        <div className="avatar-placeholder">
          <h1>AVATAR</h1>
          {/* Aqui você poderá inserir o componente de visualização do Avatar futuramente */}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home