import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { AvatarDisplay } from '../../components/Avatar/AvatarDisplay';
import styles from './home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar');
    const namerTag = localStorage.getItem('userName');

    if (namerTag) {
      setUserName(namerTag);
    }

    if (savedAvatar) {
      try {
        setAvatarConfig(JSON.parse(savedAvatar));
      } catch (e) {
        console.error("Erro ao ler avatar", e);
      }
    }
  }, []);

  return (
    <Layout activePage="home">
      <main className={styles.container}>
        
        <section className={styles.welcomeCard}>
          <div className={styles.avatarWrapper}>
            {avatarConfig && <AvatarDisplay config={avatarConfig} size={160} />}
          </div>
          
          <div className={styles.welcomeContent}>
            <h1>Bem-vindo ao Lúdica, {userName}!</h1>
            <p>Sua jornada de aprendizado começa aqui.</p>
          </div>
        </section>

        <section className={styles.recommendedSection}>
          <div className={styles.sectionHeader}>
             <h3>Continue Jogando</h3>
             <span className={styles.badge}>Mais jogados da semana</span>
          </div>
          
          <div className={styles.gameGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.gameCard}>
                <div className={styles.gameIcon}></div>
                <div className={styles.gameText}>
                  <h4>Módulo de Estudo {i}</h4>
                  <p>Status: Em progresso</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </Layout>
  );
}