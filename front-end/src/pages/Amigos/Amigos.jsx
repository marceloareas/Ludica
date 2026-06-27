import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import styles from './amigos.module.css';

const AmigosDashboard = () => {
  const [activeTab, setActiveTab] = useState('amigos');
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [dados, setDados] = useState({
    amigos: [],
    pedidosEnviados: [],
    pedidosPendentes: []
  });

  const navigate = useNavigate();

  const idUsuario = Number(localStorage.getItem('id_user'));
console.log('ID usuário logado:', idUsuario);
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const [amigosRes, pendentesRes, enviadosRes] = await Promise.all([
        fetch(`http://localhost:3000/friends/${idUsuario}`),
        fetch(`http://localhost:3000/friends/pendentes/${idUsuario}`),
        fetch(`http://localhost:3000/friends/enviados/${idUsuario}`)
      ]);

      const amigos = amigosRes.ok ? await amigosRes.json() : [];
      const pendentes = pendentesRes.ok ? await pendentesRes.json() : [];
      const enviados = enviadosRes.ok ? await enviadosRes.json() : [];

      setDados({
        amigos: amigos.map(u => ({
          id: u.id_usuario,
          nome: u.nome_usuario
        })),

        pedidosPendentes: pendentes.map(u => ({
          id: u.id_usuario_1,
          nome: u.nome_usuario
        })),

        pedidosEnviados: enviados.map(u => ({
          id: u.id_usuario_2,
          nome: u.nome_usuario
        }))
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const buscarUsuarios = async (valor) => {
    setBusca(valor);

    if (!valor.trim()) {
      setResultados([]);
      return;
    }

    try {
      setBuscando(true);

      const res = await fetch(
        `http://localhost:3000/users/buscar/${valor}`
      );

      const data = await res.json();

      setResultados(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  const enviarSolicitacao = async (idDestino) => {
    try {
      await fetch('http://localhost:3000/friends/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_usuario_1: idUsuario,
          id_usuario_2: idDestino
        })
      });

      alert('Solicitação enviada!');

      setBusca('');
      setResultados([]);
      carregarDados(); 
    } catch (err) {
      console.error(err);
    }
  };

  const aceitarSolicitacao = async (idRemetente) => {
    await fetch('http://localhost:3000/friends/aceitar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario_1: idRemetente,
        id_usuario_2: idUsuario
      })
    });

    await carregarDados();
  };

  const cancelarPedidoEnviado = async (idDestino) => {
    await fetch('http://localhost:3000/friends/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario_1: idUsuario,
        id_usuario_2: idDestino
      })
    });

    await carregarDados();
  };

  const removerAmigo = async (idAmigo) => {
    const confirmar = window.confirm(
      'Tem certeza que deseja remover este amigo?'
    );

    if (!confirmar) return;

    await fetch('http://localhost:3000/friends/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario_1: idUsuario,
        id_usuario_2: idAmigo
      })
    });

    await carregarDados();
  };


  const recusarSolicitacao = async (idRemetente) => {
    const confirmar = window.confirm(
      'Tem certeza que deseja recusar esta solicitação?'
    );

    if (!confirmar) return;

    await fetch('http://localhost:3000/friends/recusar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_usuario_1: idRemetente,
        id_usuario_2: idUsuario
      })
    });

    await carregarDados();
  };

  const listaAtiva =
    activeTab === 'amigos'
      ? dados.amigos
      : activeTab === 'pedidosEnviados'
      ? dados.pedidosEnviados
      : dados.pedidosPendentes;

  const renderItem = (usuario) => (
    <div
      key={`${usuario.id}-${activeTab}`}
      className={styles.card}
    >
      <div className={styles.userInfo}>
        <div className={styles.avatar}>👤</div>

        <div>
          <p className={styles.userName}>{usuario.nome}</p>

          <p className={styles.userStatus}>
            {activeTab === 'amigos' && 'Amigo'}
            {activeTab === 'pedidosEnviados' && 'Aguardando resposta...'}
            {activeTab === 'pedidosPendentes' && 'Solicitação recebida'}
          </p>
        </div>
      </div>

      {activeTab === 'amigos' && (
        <button
          className={styles.actionButtonRemover}
          onClick={() => removerAmigo(usuario.id)}
        >
          Remover
        </button>
      )}

      {activeTab === 'pedidosEnviados' && (
        <button
          className={styles.actionButtonCancelar}
          onClick={() => cancelarPedidoEnviado(usuario.id)}
        >
          Cancelar
        </button>
      )}

      {activeTab === 'pedidosPendentes' && (
        <>
         <div className={styles.actionsContainer}>
          <button
            className={styles.actionButtonCancelar}
            onClick={() => recusarSolicitacao(usuario.id)}
          >
            Recusar
          </button>

          <button
            className={styles.actionButtonAceitar}
            onClick={() => aceitarSolicitacao(usuario.id)}
          >
            Aceitar
          </button>
        </div>
        </>
      )}
    </div>
  );

  return (
    <Layout activePage="amigos">
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => navigate('/home')} className={styles.backButton}>
            <h1 className={styles.title}>← Amigos</h1>
          </button>
          <p className={styles.subtitle}>Conectado como 🙂 Você</p>
        </div>

        <div className={styles.search}>
          <input
            className={styles.searchInput}
            placeholder="Buscar usuário pelo gamertag..."
            value={busca}
            onChange={(e) => buscarUsuarios(e.target.value)}
          />

          {busca && (
            <div className={styles.searchResults}>
              {buscando && <p>Buscando...</p>}

              {!buscando && resultados.length === 0 && (
                <p>Nenhum usuário encontrado</p>
              )}

              {resultados.map((user) => (
                <div key={user.id_usuario} className={styles.searchItem}>
                  <span>{user.nome_usuario}</span>

                  <button
                    className={styles.actionButtonEnviar}
                    onClick={() => enviarSolicitacao(user.id_usuario)}
                  >
                    Enviar solicitação
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('amigos')}
            className={`${styles.tabButton} ${
              activeTab === 'amigos' ? styles.active : ''
            }`}
          >
            Amigos ({dados.amigos.length})
          </button>

          <button
            onClick={() => setActiveTab('pedidosEnviados')}
            className={`${styles.tabButton} ${
              activeTab === 'pedidosEnviados' ? styles.active : ''
            }`}
          >
            Enviados ({dados.pedidosEnviados.length})
          </button>

          <button
            onClick={() => setActiveTab('pedidosPendentes')}
            className={`${styles.tabButton} ${
              activeTab === 'pedidosPendentes' ? styles.active : ''
            }`}
          >
            Pendentes ({dados.pedidosPendentes.length})
          </button>
        </div>

        <div className={styles.listContainer}>
          {loading ? (
            <p className={styles.emptyMessage}>Carregando...</p>
          ) : listaAtiva.length === 0 ? (
            <p className={styles.emptyMessage}>Nenhum item encontrado.</p>
          ) : (
            listaAtiva.map(renderItem)
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AmigosDashboard;