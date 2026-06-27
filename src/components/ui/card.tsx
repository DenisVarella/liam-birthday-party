import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "blue" | "teal" | "orange" | "coral";
}

const variantStyles = {
  default: "bg-white/80 border-white/60 shadow-lg shadow-blue/5",
  blue: "bg-blue-soft/80 border-blue-light/30 shadow-lg shadow-blue/10",
  teal: "bg-teal-light/30 border-teal/20 shadow-lg shadow-teal/10",
  orange: "bg-orange-light/20 border-orange/20 shadow-lg shadow-orange/10",
  coral: "bg-coral-light/30 border-coral/20 shadow-lg shadow-coral/10",
};

/** Card reutilizável com variantes nas cores da identidade visual. */
export function Card({
  children,
  className,
  variant = "default",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-6 backdrop-blur-sm transition-shadow hover:shadow-xl sm:p-8",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
