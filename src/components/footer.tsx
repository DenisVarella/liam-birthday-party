import { Heart } from "lucide-react";
import { eventInfo } from "@/lib/event-data";
import { StitchedHeart } from "@/components/ui/invitation-decor";
import { cn } from "@/lib/utils";

/** Rodapé da landing page. */
export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t border-panel bg-white/60 py-10", className)}>
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="flex items-center justify-center gap-2">
          <StitchedHeart color="teal" className="h-5 w-5" />
          <p className="font-script text-2xl text-blue">{eventInfo.childName}</p>
          <StitchedHeart color="orange" className="h-5 w-5" />
        </div>
        <p className="mt-2 font-display text-sm font-semibold text-foreground/60">
          {eventInfo.title} · {eventInfo.date} · {eventInfo.time}
        </p>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-foreground/50">
          Feito com <Heart className="h-3.5 w-3.5 fill-coral text-coral" /> para
          celebrar este momento especial
        </p>
      </div>
    </footer>
  );
}
