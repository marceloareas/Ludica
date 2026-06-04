import styles from './footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.homeFooter}>
      <div className={styles.footerLeft}>
        <span className={styles.footerDescription}>
          Plataforma Lúdica de Jogos para Estudos
        </span>
      </div>

      <div className={styles.footerRight}>
        <a href="/about" className={styles.footerLink}>About us</a>
        <a href="/contact" className={styles.footerLink}>Contact us</a>
      </div>
    </footer>
  )
}