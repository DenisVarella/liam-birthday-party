import { Music, Palette, Sparkles, Wind } from "lucide-react";
import { entertainment } from "@/lib/event-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";

const iconMap = {
  palette: Palette,
  bounce: Sparkles,
  music: Music,
  bubbles: Wind,
};

const variants = ["orange", "blue", "coral", "teal"] as const;

/** Entretenimento da festa — textos voltados aos convidados. */
export function EntertainmentSection() {
  return (
    <section
      id="diversao"
      className="bg-gradient-to-b from-orange-light/10 to-coral-light/20 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Diversão"
            title="Entretenimento"
            description="Muita diversão para crianças e adultos aproveitarem juntos."
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {entertainment.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <FadeIn key={item.title} delay={index * 0.08}>
                <Card
                  variant={variants[index]}
                  className="h-full text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/60">
                    <Icon className="h-6 w-6 text-foreground/70" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {item.description}
                  </p>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
