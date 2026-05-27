import { useEffect, useState } from "react";
import Layout from '../../components/Layout/Layout'
import { AvatarDisplay, AvatarConfig } from '../../components/Avatar/AvatarDisplay';


const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: "#f1c8a4",
  bgColor: "#e9d5ff",
  hairId: "ondulado",
  hairColor: "#5a3a22",
  eyesId: "felizes",
  eyesColor: "#1e3a8a",
  mouthId: "sorriso",
  noseId: "round",
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

export default function Index() {
  const [c, setC] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [tab, setTab] = useState<TabKey>("hair");

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

    localStorage.setItem("avatar", JSON.stringify(c));

    const user_id = localStorage.getItem('id_user');
    console.log(user_id)

    console.log("json do avatar")
    console.log(c)

    if (!user_id) {
        console.error("Usuário não encontrado");
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:3000/avatars/${user_id}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id    : user_id,
                    config: c
                }),
            }
        );

        const data = await response.text();

        console.log(data);

        if (response.ok) {
            alert("✅ Avatar salvo com sucesso!");
        } else {
            const errorMsg = await response.text();
            alert(`❌ Erro ao salvar: ${errorMsg}`);
        }

    } catch (error) {

        console.error("Erro ao salvar avatar:", error);

    }
};
  
const randomize = () => {
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
    setC({
      skinColor: pick(SKIN_COLORS),
      bgColor: pick(BG_COLORS),
      hairId: pick(HAIR),
      hairColor: pick(HAIR_COLORS),
      eyesId: pick(EYES),
      eyesColor: pick(EYE_COLORS),
      mouthId: pick(MOUTHS),
      noseId: pick(NOSES),
      outfitId: pick(OUTFITS),
      outfitColor: pick(OUTFIT_COLORS),
      accessoryId: pick(ACCESSORIES),
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
              <Options items={HAIR} selected={c.hairId} onPick={(id) => set({ hairId: id })} />
              <Colors label="Cor do cabelo" colors={HAIR_COLORS} selected={c.hairColor} onPick={(col) => set({ hairColor: col })} />
            </>
          )}
          {tab === "eyes" && (
            <>
              <Options items={EYES} selected={c.eyesId} onPick={(id) => set({ eyesId: id })} />
              <Colors label="Cor dos olhos" colors={EYE_COLORS} selected={c.eyesColor} onPick={(col) => set({ eyesColor: col })} />
            </>
          )}
          {tab === "mouth" && <Options items={MOUTHS} selected={c.mouthId} onPick={(id) => set({ mouthId: id })} />}
          {tab === "nose" && <Options items={NOSES} selected={c.noseId} onPick={(id) => set({ noseId: id })} />}
          {tab === "outfit" && (
            <>
              <Options items={OUTFITS} selected={c.outfitId} onPick={(id) => set({ outfitId: id })} />
              <Colors label="Cor da roupa" colors={OUTFIT_COLORS} selected={c.outfitColor} onPick={(col) => set({ outfitColor: col })} />
            </>
          )}
          {tab === "accessory" && <Options items={ACCESSORIES} selected={c.accessoryId} onPick={(id) => set({ accessoryId: id })} />}
          {tab === "skin" && <Colors label="Tom de pele" colors={SKIN_COLORS} selected={c.skinColor} onPick={(col) => set({ skinColor: col })} />}
          {tab === "bg" && <Colors label="Cor de fundo" colors={BG_COLORS} selected={c.bgColor} onPick={(col) => set({ bgColor: col })} />}
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

function Options({ items, selected, onPick }: { items: string[]; selected: string; onPick: (id: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
      {items.map((id) => (
        <button
          key={id}
          onClick={() => onPick(id)}
          style={{
            padding: 10,
            border: `2px solid ${selected === id ? "#7c3aed" : "#e2e8f0"}`,
            background: selected === id ? "#f5f3ff" : "#fff",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            textTransform: "capitalize",
          }}
        >
          {id}
        </button>
      ))}
    </div>
  );
}

function Colors({ label, colors, selected, onPick }: { label: string; colors: string[]; selected: string; onPick: (c: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {colors.map((col) => (
          <button
            key={col}
            onClick={() => onPick(col)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: col,
              border: selected === col ? "3px solid #7c3aed" : "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
