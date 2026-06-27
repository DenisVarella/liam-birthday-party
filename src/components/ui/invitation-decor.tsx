"use client";

/** Balões decorativos inspirados no arco do convite. */
export function BalloonDecor({ className = "" }: { className?: string }) {
  const balloons = [
    { color: "from-blue-light to-blue", size: 48, x: "left-[5%]", y: "top-[8%]", delay: 0 },
    { color: "from-teal-light to-teal", size: 64, x: "left-[12%]", y: "top-[2%]", delay: 0.5 },
    { color: "from-orange-light to-orange", size: 56, x: "left-[20%]", y: "top-[6%]", delay: 1 },
    { color: "from-coral-light to-coral", size: 44, x: "left-[28%]", y: "top-[3%]", delay: 1.5 },
    { color: "from-orange-light to-orange", size: 52, x: "left-[35%]", y: "top-[1%]", delay: 0.8 },
    { color: "from-blue-light to-blue", size: 48, x: "right-[8%]", y: "top-[5%]", delay: 0.3 },
    { color: "from-teal-light to-teal", size: 56, x: "right-[16%]", y: "top-[10%]", delay: 1.2 },
    { color: "from-coral-light to-coral", size: 40, x: "right-[24%]", y: "top-[4%]", delay: 0.7 },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {balloons.map((balloon, i) => (
        <div
          key={i}
          className={`absolute ${balloon.x} ${balloon.y} flex flex-col items-center animate-bounce`}
          style={{
            animationDuration: `${3 + balloon.delay}s`,
            animationDelay: `${balloon.delay}s`,
          }}
        >
          {/* Balão circular */}
          <div
            className={`relative rounded-full bg-gradient-to-br ${balloon.color} opacity-90 shadow-md`}
            style={{ width: balloon.size, height: balloon.size }}
          >
            {/* Brilho superior — efeito 3D sem deformar o círculo */}
            <div className="absolute left-[22%] top-[18%] h-[28%] w-[22%] rounded-full bg-white/35" />
          </div>

          {/* Nó e barbante */}
          <div className="relative -mt-0.5 flex flex-col items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
            <div className="h-5 w-px bg-foreground/20" />
          </div>
        </div>
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
