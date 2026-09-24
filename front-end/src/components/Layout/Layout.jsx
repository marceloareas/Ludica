import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import styles from './layout.module.css'

export default function Layout({ children, activePage, theme = 'dark' }) {
  const layoutClass = `${styles.mainLayout} ${theme === 'light' ? styles.light : ''}`

  return (
    <div className={layoutClass}>
      <Navbar activePage={activePage} />

      {children}

      <Footer />
    </div>
  )
}
