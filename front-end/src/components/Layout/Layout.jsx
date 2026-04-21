import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import styles from './layout.module.css'

export default function Layout({ children, activePage }) {
  return (
    <div className={styles.mainLayout}>
      <Navbar activePage={activePage} />

      {children}

      <Footer />
    </div>
  )
}