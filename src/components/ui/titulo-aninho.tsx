interface TituloAninhoProps {
  /** Classes adicionais para controlar tamanho de fonte por contexto. */
  className?: string;
}

/**
 * Título "1º ANINHO DO" com cores alternadas (teal/laranja) e leve
 * espaçamento entre letras — estilo do convite. Reutilizado na home e na
 * tela de confirmação de presença.
 */
export function TituloAninho({ className }: TituloAninhoProps) {
  const texto = "1º ANINHO DO";

  return (
    <p
      className={`font-display font-bold tracking-[0.12em] ${className ?? ""}`.trim()}
    >
      {[...texto].map((char, index) => {
        if (char === " ") {
          return <span key={index}> </span>;
        }

        const visibleIndex = [...texto.slice(0, index)].filter(
          (c) => c !== " ",
        ).length;
        const colorClass = visibleIndex % 2 === 0 ? "text-teal" : "text-orange";

        return (
          <span key={index} className={colorClass}>
            {char}
          </span>
        );
      })}
    </p>
  );
}
