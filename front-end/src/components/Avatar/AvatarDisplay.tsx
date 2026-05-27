export type AvatarConfig = {
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

interface AvatarDisplayProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: "#f1c8a4",
  bgColor: "#e9d5ff",
  hairId: "ondulado",
  hairColor: "#5a3a22",
  eyesId: "felizes",
  eyesColor: "#1e3a8a",
  mouthId: "sorriso",
  noseId: "redondo", // Atenção: no seu SVG você usa "redondo", verifique a consistência
  outfitId: "t-shirt",
  outfitColor: "#8b5cf6",
  accessoryId: "none",
};

export const AvatarDisplay = ({ config, size = 280, className }: AvatarDisplayProps) => {
  // O return é obrigatório para que o componente renderize algo na tela
  const c = { ...DEFAULT_AVATAR, ...(config || {}) };

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        {/* Fundo */}
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
    </div>
  );
};