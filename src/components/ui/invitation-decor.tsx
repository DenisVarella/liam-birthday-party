/** Balão individual reutilizável. */
function Balloon({
  color,
  size,
  x,
  y,
  delay,
  opacity = 0.88,
}: {
  color: string;
  size: number;
  x: string;
  y: string;
  delay: number;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute ${x} ${y} flex flex-col items-center animate-bounce`}
      style={{
        animationDuration: `${3.2 + delay}s`,
        animationDelay: `${delay}s`,
        opacity,
      }}
    >
      <div
        className={`relative rounded-full bg-gradient-to-br ${color} shadow-md`}
        style={{ width: size, height: size }}
      >
        <div className="absolute left-[22%] top-[18%] h-[28%] w-[22%] rounded-full bg-white/35" />
      </div>
      <div className="relative -mt-0.5 flex flex-col items-center">
        <div className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
        <div
          className="w-px bg-foreground/15"
          style={{ height: Math.max(16, size * 0.35) }}
        />
      </div>
    </div>
  );
}

const balloonData = [
  // Esquerda — distribuídos na altura da viewport
  { color: "from-blue-light to-blue", size: 44, x: "left-[2%]", y: "top-[4%]", delay: 0, opacity: 0.75 },
  { color: "from-teal-light to-teal", size: 58, x: "left-[6%]", y: "top-[14%]", delay: 0.6 },
  { color: "from-orange-light to-orange", size: 50, x: "left-[1%]", y: "top-[28%]", delay: 1.1, opacity: 0.8 },
  { color: "from-coral-light to-coral", size: 38, x: "left-[8%]", y: "top-[42%]", delay: 0.3, opacity: 0.7 },
  { color: "from-blue-light to-blue", size: 52, x: "left-[3%]", y: "top-[56%]", delay: 1.4 },
  { color: "from-teal-light to-teal", size: 42, x: "left-[7%]", y: "top-[70%]", delay: 0.9, opacity: 0.75 },
  { color: "from-orange-light to-orange", size: 48, x: "left-[2%]", y: "top-[84%]", delay: 1.7, opacity: 0.8 },
  { color: "from-coral-light to-coral", size: 36, x: "left-[10%]", y: "top-[92%]", delay: 0.5, opacity: 0.65 },

  // Direita
  { color: "from-blue-light to-blue", size: 46, x: "right-[3%]", y: "top-[6%]", delay: 0.4, opacity: 0.78 },
  { color: "from-teal-light to-teal", size: 54, x: "right-[7%]", y: "top-[18%]", delay: 1.3 },
  { color: "from-orange-light to-orange", size: 40, x: "right-[1%]", y: "top-[32%]", delay: 0.7, opacity: 0.72 },
  { color: "from-coral-light to-coral", size: 56, x: "right-[9%]", y: "top-[46%]", delay: 1.0 },
  { color: "from-blue-light to-blue", size: 44, x: "right-[4%]", y: "top-[60%]", delay: 1.6, opacity: 0.8 },
  { color: "from-teal-light to-teal", size: 50, x: "right-[2%]", y: "top-[74%]", delay: 0.2 },
  { color: "from-orange-light to-orange", size: 42, x: "right-[8%]", y: "top-[86%]", delay: 1.8, opacity: 0.75 },
  { color: "from-coral-light to-coral", size: 34, x: "right-[5%]", y: "top-[96%]", delay: 0.8, opacity: 0.65 },

  // Cantos extras — preenchem sem atrapalhar o centro
  { color: "from-teal-light to-teal", size: 32, x: "left-[14%]", y: "top-[8%]", delay: 1.2, opacity: 0.6 },
  { color: "from-orange-light to-orange", size: 36, x: "right-[14%]", y: "top-[12%]", delay: 0.55, opacity: 0.6 },
  { color: "from-blue-light to-blue", size: 30, x: "left-[12%]", y: "top-[88%]", delay: 1.5, opacity: 0.55 },
  { color: "from-coral-light to-coral", size: 34, x: "right-[13%]", y: "top-[90%]", delay: 0.35, opacity: 0.55 },
] as const;

/**
 * Fundo fixo da página — painel + confetes, visível em todo o scroll.
 */
export function PageDecorBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 panel-bg confetti-bg"
      aria-hidden
    />
  );
}

/**
 * Balões fixos no viewport — acima do fundo, abaixo do conteúdo.
 */
export function BalloonBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {balloonData.map((balloon, i) => (
        <Balloon key={i} {...balloon} />
      ))}
    </div>
  );
}

/** @deprecated Use BalloonBackground na página — mantido para compatibilidade. */
export function BalloonDecor({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {balloonData.slice(0, 8).map((balloon, i) => (
        <Balloon key={i} {...balloon} />
      ))}
    </div>
  );
}

/** Faixa/ribbon estilo convite. */
export function RibbonBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`ribbon-banner inline-block text-center font-semibold ${className}`}>
      {children}
    </div>
  );
}

/** Coração decorativo estilo "costura" do convite. */
export function StitchedHeart({
  color = "teal",
  className = "",
}: {
  color?: "teal" | "orange" | "coral";
  className?: string;
}) {
  const colors = {
    teal: "text-teal",
    orange: "text-orange",
    coral: "text-coral",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${colors[color]} ${className}`}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
