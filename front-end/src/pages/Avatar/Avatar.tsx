import { useEffect, useState } from "react";
import Layout from '../../components/Layout/Layout'
import { AvatarDisplay, AvatarConfig } from '../../components/Avatar/AvatarDisplay';
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: "#f1c8a4",
  bgColor: "#e9d5ff",
  hairId: "ondulado",
  hairColor: "#5a3a22",
  eyesId: "felizes",
  eyesColor: "#1e3a8a",
  mouthId: "sorriso",
    noseId: "redondo",
  outfitId: "t-shirt",
  outfitColor: "#8b5cf6",
  accessoryId: "none",
};

// ===== Catálogo de opções =====
const SKIN_COLORS = ["#fde4cf", "#f1c8a4", "#d8a679", "#a87248", "#7a4f2b", "#4a2e1a"];
const BG_COLORS = ["#e9d5ff", "#bae6fd", "#fef3c7", "#fbcfe8", "#bbf7d0", "#fed7aa"];
const HAIR_COLORS = ["#5a3a22", "#e8a330", "#fde047", "#222", "#dc2626", "#8b5cf6", "#06b6d4", "#e5e5e5"];
const EYE_COLORS = ["#1e3a8a", "#166534", "#7c2d12", "#111", "#7c3aed"];
const OUTFIT_COLORS = ["#8b5cf6", "#06b6d4", "#facc15", "#ec4899", "#f97316", "#3b82f6"];

const HAIR = ["curto", "ondulado", "longo", "raspado", "rabo de cavalo", "afro"];
const EYES = ["felizes", "redondos", "piscando", "sonolento", "estrelas"];
const MOUTHS = ["sorriso", "risada", "neutro", "lingua", "o"];
const NOSES = ["redondo", "pequeno", "grande", "reto"];
const OUTFITS = ["t-shirt", "moletom", "camisa", "vestido"];
const ACCESSORIES = ["none", "glasses", "sunglasses", "hat", "headphones", "bow"];




// ===== Tela principal =====
const TABS = [
  { key: "hair", label: "Cabelo" },
  { key: "eyes", label: "Olhos" },
  { key: "mouth", label: "Boca" },
  { key: "nose", label: "Nariz" },
  { key: "outfit", label: "Roupa" },
  { key: "accessory", label: "Acessórios" },
  { key: "skin", label: "Pele" },
  { key: "bg", label: "Fundo" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type ItemLoja = { id_item: number; campo: string; valor: string; nome: string; preco: number; possui: boolean };
type LockFn = (campo: string, valor: string) => boolean;

export default function Index() {
  const [c, setC] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [tab, setTab] = useState<TabKey>("hair");

  const navigate = useNavigate();
  const [itens, setItens] = useState<ItemLoja[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/loja/itens", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { itens: [] }))
      .then((d) => setItens(d.itens || []))
      .catch(() => setItens([]));
  }, []);

  const isLocked: LockFn = (campo, valor) =>
    itens.some((i) => i.campo === campo && i.valor === valor && !i.possui);
useEffect(() => {
  const user_id = localStorage.getItem('id_user');

  const fetchAvatar = async () => {
    if (!user_id) return;

    try {
      const response = await fetch(
            `http://localhost:3000/avatars/${user_id}`,
            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json"
                },

            }
        );
      
      if (response.ok) {
        const data = await response.json();
        
       if (data && data.aparencia_json) {
          console.log("Dados brutos do banco:", data.aparencia_json);

          let configDoBanco;

          if (typeof data.aparencia_json === "string") {
              configDoBanco = JSON.parse(data.aparencia_json);
          } else {
              configDoBanco = data.aparencia_json;
          }

          const avatarFinal = {
            ...DEFAULT_AVATAR,
            ...configDoBanco
          };

          console.log("Avatar processado para o estado:", avatarFinal);

          setC(avatarFinal);
          localStorage.setItem("avatar", JSON.stringify(avatarFinal));
    
          return; 
        }
      } else {
        const raw = localStorage.getItem("avatar");
        if (raw) setC({ ...DEFAULT_AVATAR, ...JSON.parse(raw) });
      }
    } catch (error) {
      console.error("Erro ao buscar avatar no banco:", error);
      const raw = localStorage.getItem("avatar");
      if (raw) setC({ ...DEFAULT_AVATAR, ...JSON.parse(raw) });
    }
  };

  fetchAvatar();
}, []); // Executa apenas uma vez ao carregar a página

const set = (patch: Partial<AvatarConfig>) => setC({ ...c, ...patch });

const save = async () => {
  const user_id = localStorage.getItem("id_user");
  const token = localStorage.getItem("token");

  if (!user_id || !token) {
    alert("Faça login para salvar o avatar");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/avatars/${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ config: c }),
    });

        if (!response.ok) {
      const corpo = await response.json().catch(() => null);
      alert(`❌ ${corpo?.error || "Erro ao salvar o avatar"}`);
      return;
    }

    // Só atualiza o cache local depois que o servidor confirmou
    localStorage.setItem("avatar", JSON.stringify(c));
    setC({ ...c }); // força re-render para a Navbar ler o avatar novo
    alert("✅ Avatar salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar avatar:", error);
    alert("❌ Não foi possível conectar ao servidor");
  }
};
  
  const randomize = () => {
    const pick = (a: string[], campo: string) => {
      const livres = a.filter((v) => !isLocked(campo, v));
      return livres[Math.floor(Math.random() * livres.length)];
    };
    setC({
      skinColor: pick(SKIN_COLORS, "skinColor"),
      bgColor: pick(BG_COLORS, "bgColor"),
      hairId: pick(HAIR, "hairId"),
      hairColor: pick(HAIR_COLORS, "hairColor"),
      eyesId: pick(EYES, "eyesId"),
      eyesColor: pick(EYE_COLORS, "eyesColor"),
      mouthId: pick(MOUTHS, "mouthId"),
      noseId: pick(NOSES, "noseId"),
      outfitId: pick(OUTFITS, "outfitId"),
      outfitColor: pick(OUTFIT_COLORS, "outfitColor"),
      accessoryId: pick(ACCESSORIES, "accessoryId"),
    });
  };

  return (
    <Layout activePage="Avatar">
    <main style={{ minHeight: "70vh", padding: 24, fontFamily: "system-ui, sans-serif", background: "#f8fafc" }}>

      
      <h1 style={{ textAlign: "left", color: "#7c3aed", marginBottom: 24 }}>Crie seu Avatar</h1>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
        {/* ESQUERDA: Avatar */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <AvatarDisplay config={c} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={randomize} style={btn("#06b6d4")}>Aleatório</button>
            <button onClick={() => setC(DEFAULT_AVATAR)} style={btn("#64748b")}>Resetar</button>
            <button onClick={save} style={btn("#7c3aed")}>Salvar</button>
            <button onClick={() => navigate("/loja")} style={btn("#f59e0b")}>Loja</button>
          </div>
          <details style={{ marginTop: 12, fontSize: 12 }}>
            <summary style={{ cursor: "pointer" }}>Ver JSON</summary>
            <pre style={{ background: "#f1f5f9", padding: 8, borderRadius: 8, fontSize: 11 }}>
              {JSON.stringify(c, null, 2)}
            </pre>
          </details>
        </div>

        {/* DIREITA: Acessórios */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", width: 480, maxWidth: "100%" }}>
          {/* Abas */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  ...btn(tab === t.key ? "#7c3aed" : "#e2e8f0"),
                  color: tab === t.key ? "#fff" : "#334155",
                  padding: "6px 12px",
                  fontSize: 13,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Conteúdo da aba */}
                    {tab === "hair" && (
            <>
              <Options campo="hairId" items={HAIR} selected={c.hairId} onPick={(id) => set({ hairId: id })} isLocked={isLocked} />
              <Colors campo="hairColor" label="Cor do cabelo" colors={HAIR_COLORS} selected={c.hairColor} onPick={(col) => set({ hairColor: col })} isLocked={isLocked} />
            </>
          )}
          {tab === "eyes" && (
            <>
              <Options campo="eyesId" items={EYES} selected={c.eyesId} onPick={(id) => set({ eyesId: id })} isLocked={isLocked} />
              <Colors campo="eyesColor" label="Cor dos olhos" colors={EYE_COLORS} selected={c.eyesColor} onPick={(col) => set({ eyesColor: col })} isLocked={isLocked} />
            </>
          )}
          {tab === "mouth" && <Options campo="mouthId" items={MOUTHS} selected={c.mouthId} onPick={(id) => set({ mouthId: id })} isLocked={isLocked} />}
          {tab === "nose" && <Options campo="noseId" items={NOSES} selected={c.noseId} onPick={(id) => set({ noseId: id })} isLocked={isLocked} />}
          {tab === "outfit" && (
            <>
              <Options campo="outfitId" items={OUTFITS} selected={c.outfitId} onPick={(id) => set({ outfitId: id })} isLocked={isLocked} />
              <Colors campo="outfitColor" label="Cor da roupa" colors={OUTFIT_COLORS} selected={c.outfitColor} onPick={(col) => set({ outfitColor: col })} isLocked={isLocked} />
            </>
          )}
          {tab === "accessory" && <Options campo="accessoryId" items={ACCESSORIES} selected={c.accessoryId} onPick={(id) => set({ accessoryId: id })} isLocked={isLocked} />}
          {tab === "skin" && <Colors campo="skinColor" label="Tom de pele" colors={SKIN_COLORS} selected={c.skinColor} onPick={(col) => set({ skinColor: col })} isLocked={isLocked} />}
          {tab === "bg" && <Colors campo="bgColor" label="Cor de fundo" colors={BG_COLORS} selected={c.bgColor} onPick={(col) => set({ bgColor: col })} isLocked={isLocked} />}
        </div>
      </div>
    </main>
    </Layout>
  );
}

// ===== Helpers de UI =====
function btn(bg: string): React.CSSProperties {
  return {
    padding: "8px 14px",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  };
}

function Options({ campo, items, selected, onPick, isLocked }: { campo: string; items: string[]; selected: string; onPick: (id: string) => void; isLocked: LockFn }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
      {items.map((id) => {
        const locked = isLocked(campo, id);
        return (
          <button
            key={id}
            disabled={locked}
            title={locked ? "Disponível na loja" : undefined}
            onClick={() => onPick(id)}
            style={{
              padding: 10,
              border: `2px solid ${selected === id ? "#7c3aed" : "#e2e8f0"}`,
              background: selected === id ? "#f5f3ff" : "#fff",
              borderRadius: 8,
              cursor: locked ? "not-allowed" : "pointer",
              opacity: locked ? 0.45 : 1,
              fontSize: 13,
              textTransform: "capitalize",
            }}
          >
            {locked ? "🔒 " : ""}{id}
          </button>
        );
      })}
    </div>
  );
}

function Colors({ campo, label, colors, selected, onPick, isLocked }: { campo: string; label: string; colors: string[]; selected: string; onPick: (c: string) => void; isLocked: LockFn }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {colors.map((col) => {
          const locked = isLocked(campo, col);
          return (
            <button
              key={col}
              disabled={locked}
              title={locked ? "Disponível na loja" : undefined}
              onClick={() => onPick(col)}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: col,
                border: selected === col ? "3px solid #7c3aed" : "2px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                cursor: locked ? "not-allowed" : "pointer",
                opacity: locked ? 0.4 : 1,
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              {locked ? "🔒" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
