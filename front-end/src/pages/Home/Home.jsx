import Layout from '../../components/Layout/Layout'
import styles from './home.module.css'

export default function Home() {
  return (
    <Layout activePage="home">
      <main className={styles.avatarSection}>
        <div className={styles.avatarPlaceholder}>
          <h1>AVATAR</h1>
        </div>
      </main>
    </Layout>
  )
}