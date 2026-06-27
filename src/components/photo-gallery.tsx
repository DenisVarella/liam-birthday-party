import Image from "next/image";
import { developmentPhotos } from "@/lib/event-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/fade-in";

const tapeStyles = ["washi-teal", "washi-blue", "washi-orange", "washi-teal"] as const;
const rotations = ["-3deg", "2deg", "-1deg", "3deg"] as const;

/** Galeria Polaroid — Varal do Desenvolvimento, inspirada no convite opção 2. */
export function PhotoGallery() {
  return (
    <section id="timeline" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Memórias"
            title="Varal do Desenvolvimento"
            description="Cada fase do crescimento do Liam, registrada com muito carinho."
          />
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {developmentPhotos.map((photo, index) => (
            <FadeIn key={photo.label} delay={index * 0.1}>
              <div
                className="polaroid relative w-36 sm:w-44"
                style={{ "--rotate": rotations[index] } as React.CSSProperties}
              >
                <div
                  className={`washi-tape ${tapeStyles[index]}`}
                  style={
                    {
                      "--tape-rotate": index % 2 === 0 ? "-3deg" : "2deg",
                    } as React.CSSProperties
                  }
                />
                <div className="relative aspect-[3/4] overflow-hidden bg-blue-soft">
                  {"image" in photo && photo.image ? (
                    <Image
                      src={photo.image}
                      alt={`Liam — ${photo.label}`}
                      fill
                      className="object-cover object-top"
                      sizes="176px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-soft to-teal-light/30">
                      <span className="text-4xl" aria-hidden>
                        {photo.emoji}
                      </span>
                    </div>
                  )}
                </div>
                <p className="polaroid-caption mt-3 text-center text-lg">
                  {photo.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
