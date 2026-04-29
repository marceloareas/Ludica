import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout'
import { useNavigate } from 'react-router-dom';

const AmigosDashboard = () => {
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('pedidosEnviados');
  const navigate = useNavigate();
  
  // Dados separados por status
  const dados = {
    amigos: [], // Lista vazia para Amigos
    pedidosEnviados: [
      { id: 1, nome: 'Ana Silva' },
      { id: 2, nome: 'Bruno Costa' },
      { id: 3, nome: 'Carla Mendes' },
      { id: 4, nome: 'Diego Souza' },
    ],
    pedidosPendentes: [] // Lista vazia para Pedidos Pendentes
  };

  // Função para renderizar a lista baseada na aba ativa
  const renderList = () => {
    const lista = activeTab === 'amigos' ? dados.amigos : 
                  activeTab === 'pedidosEnviados' ? dados.pedidosEnviados : 
                  dados.pedidosPendentes;

    if (lista.length === 0) {
      return <p style={{ textAlign: 'center', marginTop: '40px', color: '#b0b0b0' }}>Nenhum item encontrado.</p>;
    }

    return lista.map((amigo) => (
      <div key={amigo.id} style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#ffffff', color: '#333', padding: '25px', 
        borderRadius: '10px', marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '40px' }}>👤</div>
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{amigo.nome}</p>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>Aguardando resposta...</p>
          </div>
        </div>
        <button style={{ 
          padding: '12px 25px', backgroundColor: '#f8f9fa', border: '1px solid #ccc', 
          borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
        }}>✖ Cancelar</button>
      </div>
    ));
  };

  return (
    <Layout activePage="amigos">
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#283046', color: 'white', padding: '40px', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'left', marginBottom: '60px' }}>
        <button 
          onClick={() => navigate('/home')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: 0, 
            cursor: 'pointer',
            textAlign: 'left',
            color: 'inherit',
            font: 'inherit'
          }}
        >
          <h1 style={{ fontSize: '40px', margin: '0' }}>← Amigos</h1>
        </button>
        <p style={{ color: '#b0b0b0', margin: '10px 0 0 0' }}>Conectado como 🙂 Você</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <input type="text" placeholder="Buscar amigo pelo nome..." style={{ width: '100%', padding: '20px', borderRadius: '8px', border: 'none', marginBottom: '40px', boxSizing: 'border-box' }} />

        {/* Abas Interativas */}
        <div style={{ display: 'flex', gap: '2px', borderBottom: '2px solid #3d4a63' }}>
          {[
            { id: 'amigos', label: 'Amigos (0)' },
            { id: 'pedidosEnviados', label: 'Pedidos enviados (4)' },
            { id: 'pedidosPendentes', label: 'Pedidos pendentes (0)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                flex: 1, padding: '20px', 
                backgroundColor: activeTab === tab.id ? '#3d4a63' : '#283046',
                color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo Dinâmico */}
        <div style={{ marginTop: '40px' }}>
          {renderList()}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default AmigosDashboard;