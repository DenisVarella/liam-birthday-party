"use client";

import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { eventInfo } from "@/lib/event-data";
import { Countdown } from "@/components/countdown";
import { FadeIn } from "@/components/ui/fade-in";
import {
  RibbonBanner,
  StitchedHeart,
} from "@/components/ui/invitation-decor";

/** Hero inspirado no layout do convite — balões, script "Liam", fita e detalhes. */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="relative mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
        {/* Título estilo convite: 1º ANINHO DO Liam */}
        <FadeIn>
          <p className="font-display text-2xl font-bold tracking-wide sm:text-3xl">
            <span className="text-teal">1º</span>{" "}
            <span className="text-orange">A</span>
            <span className="text-teal">N</span>
            <span className="text-orange">I</span>
            <span className="text-teal">N</span>
            <span className="text-orange">H</span>
            <span className="text-teal">O</span>
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.3em] text-blue">
            do
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-script mt-2 text-7xl text-blue sm:text-8xl lg:text-9xl">
            {eventInfo.childName}
            <StitchedHeart color="orange" className="ml-2 inline-block h-8 w-8 sm:h-10 sm:w-10" />
          </h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-6 flex justify-center">
            <RibbonBanner className="text-sm sm:text-base">
              Venha comemorar esse dia especial!
            </RibbonBanner>
          </div>
        </FadeIn>

        {/* Data e horário — layout do convite */}
        <FadeIn delay={0.2}>
          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange" />
              <span className="font-display text-lg font-bold text-blue sm:text-xl">
                16/08/26
              </span>
            </div>
            <div className="dotted-divider" aria-hidden />
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal" />
              <span className="font-display text-lg font-bold text-blue sm:text-xl">
                {eventInfo.time}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Retrato circular estilo convite opção 1 */}
        <FadeIn delay={0.25}>
          <div className="relative mx-auto mt-10 w-fit">
            <div className="stitched-circle relative h-48 w-48 overflow-hidden sm:h-56 sm:w-56">
              <Image
                src={eventInfo.photo}
                alt={`Foto do ${eventInfo.childName}`}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 640px) 192px, 224px"
              />
            </div>
            <StitchedHeart
              color="teal"
              className="absolute -bottom-1 -left-3 h-7 w-7"
            />
            <StitchedHeart
              color="orange"
              className="absolute -bottom-1 -right-3 h-7 w-7"
            />
          </div>
        </FadeIn>

        {/* Contagem regressiva */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-10 max-w-md rounded-3xl bg-white/70 p-6 shadow-lg backdrop-blur-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/50">
              Faltam
            </p>
            <Countdown />
          </div>
        </FadeIn>

        {/* Local */}
        <FadeIn delay={0.35}>
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-start gap-2 text-sm text-blue sm:text-base">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
              <p className="max-w-md leading-relaxed">
                {eventInfo.location.address}, {eventInfo.location.neighborhood},{" "}
                {eventInfo.location.city}-{eventInfo.location.state}
                <br />
                <span className="text-foreground/60">
                  ({eventInfo.location.name})
                </span>
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#timeline"
              className="rounded-full bg-teal px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105"
            >
              Ver crescimento
            </a>
            <a
              href={eventInfo.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-orange bg-white/80 px-6 py-3 font-bold text-orange transition-transform hover:scale-105"
            >
              Como chegar
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
