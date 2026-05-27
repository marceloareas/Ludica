import { useState } from 'react';
import { AvatarDisplay } from '../../components/Avatar/AvatarDisplay';
import Layout from '../../components/Layout/Layout';
import styles from './perfil.module.css'; // Estilos específicos para organização
import registerStyles from '../Register/register.module.css'; // Estilos dos inputs/botão

export default function Perfil() {
  const [formData, setFormData] = useState({
    nomeCompleto: localStorage.getItem('nome_completo') || '',
    email: localStorage.getItem('email') || '',
    namertag: localStorage.getItem('userName') || '',
    senha: '',
    confirmaSenha: '',
    dataNascimento: localStorage.getItem('data_nascimento') || '',
  });

  const avatarConfig = JSON.parse(localStorage.getItem('avatar') || '{}');

  return (
    <Layout activePage="perfil">
      <main className={`${registerStyles.center} ${styles.profileContainer}`}>
        
        {/* Cabeçalho do Perfil */}
        <div className={styles.profileHeader}>
          <AvatarDisplay config={avatarConfig} size={120} />
          <h2>{formData.namertag}</h2>
        </div>

        <form className={registerStyles.form}>
          {/* Seção Dados Pessoais */}
          <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
          <input 
            className={registerStyles.input} 
            type="text" 
            placeholder="Nome completo" 
            value={formData.nomeCompleto} // Adicione isso
            onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})} 
          />
          
          <input 
            className={registerStyles.input} 
            type="email" 
            placeholder="E-mail" 
            value={formData.email} // Adicione isso
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          
          <input 
            className={registerStyles.input} 
            type="text" 
            placeholder="Nome de usuário" 
            value={formData.namertag} 
            onChange={(e) => setFormData({...formData, namertag: e.target.value})} 
          />
          
          <input 
            className={registerStyles.input} 
            type="date" 
            value={formData.dataNascimento} // Adicione isso
            onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})} 
          />

          <h3 className={styles.sectionTitle}>Segurança</h3>
          
          <input 
            className={registerStyles.input} 
            type="password" 
            placeholder="Nova senha" 
            value={formData.senha} // Adicione isso
            onChange={(e) => setFormData({...formData, senha: e.target.value})} 
          />
          
          <input 
            className={registerStyles.input} 
            type="password" 
            placeholder="Confirmar senha" 
            value={formData.confirmaSenha} // Adicione isso
            onChange={(e) => setFormData({...formData, confirmaSenha: e.target.value})} 
          />

          <button type="submit" className={registerStyles.enterLogin}>Salvar Alterações</button>
        </form>
      </main>
    </Layout>
  );
}