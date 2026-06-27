import {
  Cake,
  Candy,
  Coffee,
  Popcorn,
  GlassWater,
} from "lucide-react";
import { menu } from "@/lib/event-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";

type MenuSectionItem = {
  key: string;
  data: { title: string; items: readonly string[] };
  icon: typeof Cake;
  variant: "blue" | "coral" | "orange" | "default";
};

const menuTopRow: MenuSectionItem[] = [
  { key: "savory", data: menu.savory, icon: Coffee, variant: "orange" },
  { key: "sweets", data: menu.sweets, icon: Candy, variant: "coral" },
  { key: "cake", data: menu.cake, icon: Cake, variant: "blue" },
];

const menuBottomRow: MenuSectionItem[] = [
  { key: "special", data: menu.special, icon: Popcorn, variant: "default" },
  { key: "drinks", data: menu.drinks, icon: GlassWater, variant: "blue" },
];

function MenuCard({
  section,
  index,
}: {
  section: MenuSectionItem;
  index: number;
}) {
  const Icon = section.icon;

  return (
    <FadeIn delay={index * 0.08}>
      <Card variant={section.variant} className="h-full">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/60">
            <Icon className="h-5 w-5 text-foreground/70" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {section.data.title}
          </h3>
        </div>
        <ul className="space-y-2">
          {section.data.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-relaxed text-foreground/70"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </FadeIn>
  );
}

/** Cardápio da festa — textos voltados aos convidados. */
export function MenuSection() {
  return (
    <section id="cardapio" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Sabores"
            title="Cardápio"
            description="Delícias salgadas e doces, além de bebidas refrescantes para toda a família."
          />
        </FadeIn>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuTopRow.map((section, index) => (
              <MenuCard key={section.key} section={section} index={index} />
            ))}
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {menuBottomRow.map((section, index) => (
              <MenuCard
                key={section.key}
                section={section}
                index={index + menuTopRow.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
