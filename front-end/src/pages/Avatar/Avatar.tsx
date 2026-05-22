import { useEffect, useState } from "react";
import Layout from '../../components/Layout/Layout'



// ===== Tipo do Avatar (vai virar JSON no banco) =====
type AvatarConfig = {
  skinColor: string;
  bgColor: string;
  hairId: string;
  hairColor: string;
  eyesId: string;
  eyesColor: string;
  mouthId: string;
  noseId: string;
  outfitId: string;
  outfitColor: string;
  accessoryId: string;
};

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




// ===== Avatar SVG (tudo num só componente) =====
function AvatarSVG({ c, size = 280 }: { c: AvatarConfig; size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <rect width="200" height="200" rx="20" fill={c.bgColor} />

      {/* Roupa */}
      {c.outfitId === "t-shirt" && <path d="M40 200 L40 160 Q70 140 100 140 Q130 140 160 160 L160 200 Z" fill={c.outfitColor} />}
      {c.outfitId === "moletom" && (
        <>
          <path d="M40 200 L40 158 Q70 138 100 138 Q130 138 160 158 L160 200 Z" fill={c.outfitColor} />
          <path d="M70 140 Q100 125 130 140 L130 150 Q100 140 70 150 Z" fill={c.outfitColor} opacity="0.7" />
        </>
      )}
      {c.outfitId === "camisa" && (
        <>
          <path d="M40 200 L40 160 Q70 140 100 140 Q130 140 160 160 L160 200 Z" fill={c.outfitColor} />
          <path d="M90 140 L100 158 L110 140 Z" fill="#fff" />
        </>
      )}
      {c.outfitId === "vestido" && <path d="M30 200 L50 150 Q75 138 100 138 Q125 138 150 150 L170 200 Z" fill={c.outfitColor} />}

      {/* Pescoço + cabeça + orelhas */}
      <rect x="88" y="120" width="24" height="20" rx="6" fill={c.skinColor} />
      <ellipse cx="100" cy="92" rx="44" ry="48" fill={c.skinColor} />
      <circle cx="55" cy="95" r="7" fill={c.skinColor} />
      <circle cx="145" cy="95" r="7" fill={c.skinColor} />

      {/* Cabelo */}
      {c.hairId === "raspado" && <path d="M58 78 Q100 48 142 78 L142 88 Q100 70 58 88 Z" fill={c.hairColor} />}
      {c.hairId === "curto" && <path d="M56 80 Q100 30 144 80 Q140 60 100 52 Q60 60 56 80 Z" fill={c.hairColor} />}
      {c.hairId === "ondulado" && <path d="M52 82 Q60 40 100 42 Q140 42 148 82 Q142 70 130 72 Q120 60 100 58 Q80 60 70 72 Q58 70 52 82 Z" fill={c.hairColor} />}
      {c.hairId === "longo" && <path d="M50 82 Q50 42 100 40 Q150 42 150 82 L150 140 Q140 130 140 100 Q100 60 60 100 Q60 130 50 140 Z" fill={c.hairColor} />}
      {c.hairId === "rabo de cavalo" && (
        <>
          <path d="M56 80 Q100 36 144 80 Q140 58 100 50 Q60 58 56 80 Z" fill={c.hairColor} />
          <ellipse cx="156" cy="100" rx="10" ry="22" fill={c.hairColor} />
        </>
      )}
      {c.hairId === "afro" && <path d="M48 88 Q40 60 60 50 Q70 30 100 32 Q130 30 140 50 Q160 60 152 88 Q156 70 140 70 Q140 50 100 50 Q60 50 60 70 Q44 70 48 88 Z" fill={c.hairColor} />}

      {/* Olhos */}
      {c.eyesId === "redondos" && (
        <>
          <circle cx="82" cy="95" r="6" fill="#fff" />
          <circle cx="118" cy="95" r="6" fill="#fff" />
          <circle cx="82" cy="95" r="3.5" fill={c.eyesColor} />
          <circle cx="118" cy="95" r="3.5" fill={c.eyesColor} />
        </>
      )}
      {c.eyesId === "felizes" && (
        <>
          <path d="M76 96 Q82 88 88 96" stroke={c.eyesColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M112 96 Q118 88 124 96" stroke={c.eyesColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {c.eyesId === "piscando" && (
        <>
          <circle cx="82" cy="95" r="4" fill={c.eyesColor} />
          <path d="M112 96 Q118 90 124 96" stroke={c.eyesColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {c.eyesId === "sonolento" && (
        <>
          <path d="M75 95 L89 95" stroke={c.eyesColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M111 95 L125 95" stroke={c.eyesColor} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {c.eyesId === "estrelas" && (
        <>
          {[82, 118].map((cx) => (
            <path
              key={cx}
              d={`M${cx} 89 L${cx + 1.8} 93.2 L${cx + 6} 95 L${cx + 1.8} 96.8 L${cx} 101 L${cx - 1.8} 96.8 L${cx - 6} 95 L${cx - 1.8} 93.2 Z`}
              fill={c.eyesColor}
            />
          ))}
        </>
      )}

      {/* Nariz */}
      {c.noseId === "redondo" && <circle cx="100" cy="108" r="3" fill="#b97a6b" />}
      {c.noseId === "pequeno" && <circle cx="100" cy="108" r="2" fill="#b97a6b" />}
      {c.noseId === "grande" && <ellipse cx="100" cy="108" rx="5" ry="2.5" fill="#b97a6b" />}
      {c.noseId === "reto" && <path d="M100 102 L100 112" stroke="#444" strokeWidth="2" strokeLinecap="round" />}

      {/* Boca */}
      {c.mouthId === "sorriso" && <path d="M86 122 Q100 132 114 122" stroke="#7a1f1f" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {c.mouthId === "risada" && (
        <>
          <path d="M84 120 Q100 138 116 120 Z" fill="#7a1f1f" />
          <path d="M86 122 L114 122" stroke="#fff" strokeWidth="2" />
        </>
      )}
      {c.mouthId === "neutro" && <path d="M88 124 L112 124" stroke="#7a1f1f" strokeWidth="3" strokeLinecap="round" />}
      {c.mouthId === "lingua" && (
        <>
          <path d="M86 122 Q100 132 114 122" stroke="#7a1f1f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="130" rx="5" ry="4" fill="#ec4899" />
        </>
      )}
      {c.mouthId === "o" && <ellipse cx="100" cy="125" rx="5" ry="6" fill="#7a1f1f" />}

      {/* Bochechas */}
      <circle cx="68" cy="105" r="5" fill="#f9a8d4" opacity="0.5" />
      <circle cx="132" cy="105" r="5" fill="#f9a8d4" opacity="0.5" />

      {/* Acessório */}
      {c.accessoryId === "glasses" && (
        <g stroke="#222" strokeWidth="2.5" fill="none">
          <circle cx="82" cy="96" r="10" />
          <circle cx="118" cy="96" r="10" />
          <path d="M92 96 L108 96" />
        </g>
      )}
      {c.accessoryId === "sunglasses" && (
        <g>
          <rect x="70" y="88" width="24" height="14" rx="4" fill="#111" />
          <rect x="106" y="88" width="24" height="14" rx="4" fill="#111" />
          <path d="M94 95 L106 95" stroke="#111" strokeWidth="3" />
        </g>
      )}
      {c.accessoryId === "hat" && (
        <g>
          <path d="M50 70 L150 70 L140 35 Q100 25 60 35 Z" fill="#7c3aed" />
          <rect x="50" y="68" width="100" height="8" rx="3" fill="#facc15" />
        </g>
      )}
      {c.accessoryId === "headphones" && (
        <g>
          <path d="M52 88 Q100 30 148 88" stroke="#222" strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="44" y="85" width="14" height="22" rx="5" fill="#dc2626" />
          <rect x="142" y="85" width="14" height="22" rx="5" fill="#dc2626" />
        </g>
      )}
      {c.accessoryId === "bow" && (
        <g transform="translate(100 50)">
          <path d="M-14 0 L-2 -8 L-2 8 Z" fill="#ec4899" />
          <path d="M14 0 L2 -8 L2 8 Z" fill="#ec4899" />
          <circle r="4" fill="#be185d" />
        </g>
      )}
    </svg>
  );
}

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
          <AvatarSVG c={c} />
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
