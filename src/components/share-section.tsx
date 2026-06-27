import { QrCode, MessageCircle, Camera } from "lucide-react";
import { eventInfo } from "@/lib/event-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { RibbonBanner } from "@/components/ui/invitation-decor";

/** Seção de compartilhamento de fotos via QR Code / WhatsApp. */
export function ShareSection() {
  return (
    <section id="fotos" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Compartilhe"
            title="Fotos da Festa"
            description="Escaneie o QR Code na entrada do salão e entre no grupo exclusivo para compartilhar os melhores momentos!"
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card variant="blue" className="mx-auto max-w-md">
            <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-blue-light bg-white">
              <QrCode className="h-20 w-20 text-blue/40" />
            </div>
            <p className="text-sm text-foreground/60">
              QR Code será disponibilizado na entrada do salão
            </p>

            <div className="mt-6 flex justify-center">
              <RibbonBanner className="text-sm">
                Grupo exclusivo no WhatsApp
              </RibbonBanner>
            </div>

            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3">
                <Camera className="h-5 w-5 shrink-0 text-teal" />
                <p className="text-sm text-foreground/70">
                  Compartilhe fotos e vídeos em tempo real
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-orange" />
                <p className="text-sm text-foreground/70">
                  Grupo exclusivo para convidados da festa
                </p>
              </div>
            </div>

            {eventInfo.whatsappGroupUrl !== "#" && (
              <a
                href={eventInfo.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 font-bold text-white transition-transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                Entrar no grupo
              </a>
            )}
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}
