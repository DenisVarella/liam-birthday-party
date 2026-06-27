import { Cake, Sofa, Sparkles } from "lucide-react";
import { partyStyle } from "@/lib/event-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";

const iconMap = {
  cake: Cake,
  sofa: Sofa,
  bounce: Sparkles,
};

const variants = ["blue", "orange", "coral"] as const;

/** Ambiente da festa — textos voltados aos convidados. */
export function SpaceLayout() {
  return (
    <section id="espaco" className="bg-blue-soft/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="A festa"
            title="O que te espera"
            description={partyStyle.description}
          />
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {partyStyle.spaces.map((space, index) => {
            const Icon = iconMap[space.icon];
            return (
              <FadeIn key={space.title} delay={index * 0.1}>
                <Card variant={variants[index]} className="h-full text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/60">
                    <Icon className="h-6 w-6 text-foreground/70" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {space.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-foreground/65">
                    {space.description}
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
