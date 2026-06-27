import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { eventInfo } from "@/lib/event-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";

/** Detalhes principais do evento: data, horário e local. */
export function EventDetails() {
  const details = [
    {
      icon: Calendar,
      label: "Data",
      value: eventInfo.date,
      color: "text-blue bg-blue-soft",
    },
    {
      icon: Clock,
      label: "Horário",
      value: eventInfo.time,
      color: "text-teal bg-teal-light/40",
    },
    {
      icon: MapPin,
      label: "Local",
      value: eventInfo.location.name,
      sub: `${eventInfo.location.address}, ${eventInfo.location.neighborhood} — ${eventInfo.location.city}/${eventInfo.location.state}`,
      color: "text-coral bg-coral-light/60",
    },
  ];

  return (
    <section id="detalhes" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Save the date"
            title="Detalhes do Evento"
            description="Marque na agenda e venha celebrar conosco este momento especial."
          />
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {details.map((detail, index) => (
            <FadeIn key={detail.label} delay={index * 0.1}>
              <Card className="h-full text-center">
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${detail.color}`}
                >
                  <detail.icon className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wider text-foreground/50">
                  {detail.label}
                </p>
                <p className="mt-2 font-display text-xl font-bold text-foreground">
                  {detail.value}
                </p>
                {detail.sub && (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                    {detail.sub}
                  </p>
                )}
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-10 text-center">
            <a
              href={eventInfo.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-blue-light px-8 py-4 font-bold text-white shadow-lg shadow-blue/20 transition-transform hover:scale-105"
            >
              <MapPin className="h-5 w-5" />
              Abrir no Google Maps
              <ExternalLink className="h-4 w-4 opacity-70" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
