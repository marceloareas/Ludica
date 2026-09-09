import { useState } from 'react';
import { AvatarDisplay } from '../../components/Avatar/AvatarDisplay';
import Layout from '../../components/Layout/Layout';
import perfilStyles from './perfil.module.css';
import registerStyles from '../Register/register.module.css';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeCompleto: localStorage.getItem('nome_completo') || '',
    email: localStorage.getItem('email') || '',
    namertag: localStorage.getItem('userName') || '',
    dataNascimento: localStorage.getItem('data_nascimento') || '',
  });

  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmaNovaSenha: '',
  });

  const avatarConfig = JSON.parse(localStorage.getItem('avatar') || '{}');

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('id_user');

    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.namertag,
          email: formData.email,
          nome_completo: formData.nomeCompleto,
          data_nascimento: formData.dataNascimento,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || 'Erro ao atualizar perfil');
        return;
      }

      localStorage.setItem('nome_completo', data.nome_completo);
      localStorage.setItem('email', data.email);
      localStorage.setItem('userName', data.nome_usuario);
      localStorage.setItem('data_nascimento', data.data_nascimento);

      setFormData({
        nomeCompleto: data.nome_completo,
        email: data.email,
        namertag: data.nome_usuario,
        dataNascimento: data.data_nascimento,
      });

      setEditMode(false);
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro no servidor');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordData.senhaAtual || !passwordData.novaSenha) {
        alert('Preencha todos os campos');
        return;
      }

      if (passwordData.novaSenha !== passwordData.confirmaNovaSenha) {
        alert('As senhas não coincidem!');
        return;
      }

      const userId = localStorage.getItem('id_user');

      const response = await fetch(
        `http://localhost:3000/users/${userId}/password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senhaAtual: passwordData.senhaAtual,
            novaSenha: passwordData.novaSenha,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || 'Erro ao alterar senha');
        return;
      }

      alert('Senha alterada com sucesso!');

      setPasswordData({
        senhaAtual: '',
        novaSenha: '',
        confirmaNovaSenha: '',
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Erro no servidor');
    }
  };

  return (
    <Layout activePage="perfil">
      <main className={`${registerStyles.center} ${perfilStyles.profileContainer}`}>

        <div className={perfilStyles.profileHeader}>
          <AvatarDisplay config={avatarConfig} size={120} />
          <h2>{formData.namertag}</h2>

          <button
            className={registerStyles.enterLogin}
            onClick={() => navigate('/avatar')}
          >
            Editar Avatar
          </button>
        </div>

        <form className={registerStyles.form}>

          <h3 className={perfilStyles.sectionTitle}>Dados Pessoais</h3>

          <input
            className={registerStyles.input}
            type="text"
            placeholder="Nome completo"
            disabled={!editMode}
            value={formData.nomeCompleto}
            onChange={(e) =>
              setFormData({ ...formData, nomeCompleto: e.target.value })
            }
          />

          <input
            className={registerStyles.input}
            type="email"
            placeholder="E-mail"
            disabled={!editMode}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            className={registerStyles.input}
            type="text"
            placeholder="Nome de usuário"
            disabled={!editMode}
            value={formData.namertag}
            onChange={(e) =>
              setFormData({ ...formData, namertag: e.target.value })
            }
          />

          <input
            className={registerStyles.input}
            type="date"
            disabled={!editMode}
            value={formData.dataNascimento}
            onChange={(e) =>
              setFormData({ ...formData, dataNascimento: e.target.value })
            }
          />

          <button
            type="button"
            className={perfilStyles.changePassword}
            onClick={() => setIsModalOpen(true)}
          >
            Alterar senha
          </button>

          {!editMode ? (
            <button
              type="button"
              className={registerStyles.enterLogin}
              onClick={() => setEditMode(true)}
            >
              Editar informações
            </button>
          ) : (
            <button
              type="button"
              className={registerStyles.enterLogin}
              onClick={handleSaveProfile}
            >
              Salvar informações
            </button>
          )}
        </form>


        {isModalOpen && (
          <div className={perfilStyles.modalOverlay}>
            <div className={perfilStyles.modal}>
              <h3>Alterar senha</h3>

              <input
                className={registerStyles.input}
                type="password"
                placeholder="Senha atual"
                value={passwordData.senhaAtual}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, senhaAtual: e.target.value })
                }
              />

              <input
                className={registerStyles.input}
                type="password"
                placeholder="Nova senha"
                value={passwordData.novaSenha}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, novaSenha: e.target.value })
                }
              />

              <input
                className={registerStyles.input}
                type="password"
                placeholder="Confirmar nova senha"
                value={passwordData.confirmaNovaSenha}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmaNovaSenha: e.target.value,
                  })
                }
              />

              <div className={perfilStyles.modalActions}>

              <button
                type="button"
                className={perfilStyles.cancelChangePassword}
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>

              <button
                  type="button"
                  className={registerStyles.enterLogin}
                  onClick={handleChangePassword}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </Layout>
  );
}