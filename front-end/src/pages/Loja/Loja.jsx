import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { AvatarDisplay } from '../../components/Avatar/AvatarDisplay';
import styles from './loja.module.css';

const API = 'http://localhost:3000/loja';

const ROTULOS = {
  hairId: 'Cabelo', hairColor: 'Cor do cabelo', eyesId: 'Olhos', eyesColor: 'Cor dos olhos',
  mouthId: 'Boca', noseId: 'Nariz', outfitId: 'Roupa', outfitColor: 'Cor da roupa',
  accessoryId: 'Acessórios', skinColor: 'Tom de pele', bgColor: 'Fundo',
};

function lerAvatar() {
  try {
    return JSON.parse(localStorage.getItem('avatar')) || {};
  } catch {
    return {};
  }
}

export default function Loja() {
  const navigate = useNavigate();
  const [moedas, setMoedas] = useState(0);
  const [itens, setItens] = useState([]);
  const [aviso, setAviso] = useState('');
  const [comprando, setComprando] = useState(null);
  const avatar = useMemo(lerAvatar, []);

  const chamar = useCallback(async (caminho, opcoes = {}) => {
    const response = await fetch(`${API}${caminho}`, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status === 401) {
      navigate('/');
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  }, [navigate]);

  useEffect(() => {
    chamar('/itens')
      .then((d) => {
        setMoedas(d.moedas);
        setItens(d.itens);
      })
      .catch((e) => setAviso(e.message));
  }, [chamar]);

  const comprar = async (item) => {
    setComprando(item.id_item);
    setAviso('');

    try {
      const d = await chamar(`/comprar/${item.id_item}`, { method: 'POST' });
      setMoedas(d.moedas);
      setItens((atual) =>
        atual.map((i) => (i.id_item === item.id_item ? { ...i, possui: true } : i))
      );
      setAviso(`“${item.nome}” comprado! Equipe na tela de Avatar.`);
    } catch (e) {
      setAviso(e.message);
    } finally {
      setComprando(null);
    }
  };

  const grupos = Object.keys(ROTULOS)
    .map((campo) => ({
      campo,
      rotulo: ROTULOS[campo],
      itens: itens.filter((i) => i.campo === campo),
    }))
    .filter((g) => g.itens.length > 0);

  return (
    <Layout activePage="loja">
      <main className={styles.page}>
        <header className={styles.topo}>
          <h1>Loja de itens</h1>
          <div className={styles.saldo}>🪙 {moedas} moedas</div>
          <button type="button" className={styles.botao} onClick={() => navigate('/avatar')}>
            Ir para o Avatar
          </button>
        </header>

        {aviso && <div role="status" className={styles.aviso}>{aviso}</div>}

        {grupos.map((g) => (
          <section key={g.campo}>
            <h2>{g.rotulo}</h2>
            <div className={styles.grade}>
              {g.itens.map((item) => (
                <article key={item.id_item} className={styles.cartao}>
                  <AvatarDisplay config={{ ...avatar, [item.campo]: item.valor }} size={96} />
                  <strong>{item.nome}</strong>
                  <span>🪙 {item.preco}</span>
                  <button
                    type="button"
                    className={styles.botao}
                    disabled={item.possui || comprando === item.id_item || moedas < item.preco}
                    onClick={() => comprar(item)}
                  >
                    {item.possui ? 'Comprado' : moedas < item.preco ? 'Moedas insuficientes' : 'Comprar'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}