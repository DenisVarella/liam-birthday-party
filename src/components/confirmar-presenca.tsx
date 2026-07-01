"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  Loader2,
  MapPin,
  PartyPopper,
  Pencil,
  X,
} from "lucide-react";
import { eventInfo } from "@/lib/event-data";
import { baixarEventoIcs } from "@/lib/calendar";
import {
  getFamiliaPublica,
  registrarAcessoConvite,
  responderConvite,
} from "@/lib/convidados-service";
import type { RespostaStatus } from "@/lib/types/convidados";
import { StitchedHeart } from "@/components/ui/invitation-decor";
import { PaginaEmConstrucao } from "@/components/ui/pagina-em-construcao";
import { TituloAninho } from "@/components/ui/titulo-aninho";

/** Página de confirmação de presença — link único por família. */
export function ConfirmarPresenca() {
  const searchParams = useSearchParams();
  const familiaId = searchParams.get("f");
  const linkInvalido = !familiaId;

  const [status, setStatus] = useState<RespostaStatus>("pendente");
  const [mensagem, setMensagem] = useState("");
  const [conviteValido, setConviteValido] = useState(false);
  const [loading, setLoading] = useState(!linkInvalido);
  const [enviando, setEnviando] = useState<"confirmado" | "recusado" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const semConvite = linkInvalido;

  useEffect(() => {
    if (!familiaId) return;

    let cancelled = false;

    getFamiliaPublica(familiaId)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("Link inválido ou expirado.");
          setConviteValido(false);
        } else {
          setConviteValido(true);
          setStatus(data.status);
          setError(null);
          void registrarAcessoConvite(familiaId).catch(() => {
            /* não bloqueia a tela do convite */
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Não foi possível carregar o convite. Tente novamente.");
          setConviteValido(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [familiaId]);

  async function handleResponder(tipo: "confirmado" | "recusado") {
    if (!familiaId || status !== "pendente") return;

    setEnviando(tipo);
    setError(null);

    try {
      await responderConvite(familiaId, {
        tipo,
        mensagem: mensagem.trim() || undefined,
      });
      setStatus(tipo);
    } catch {
      setError("Erro ao enviar resposta. Tente novamente.");
    } finally {
      setEnviando(null);
    }
  }

  return (
    <PaginaEmConstrucao ativa={semConvite}>
      <div className="relative z-10 min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-md">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-orange shadow-sm">
            <PartyPopper className="h-4 w-4" />
            Você está convidado!
          </div>
          <TituloAninho className="text-lg" />
          <h1 className="font-script text-5xl text-blue">
            {eventInfo.childName}
            <StitchedHeart
              color="orange"
              className="ml-1 inline-block h-6 w-6"
            />
          </h1>

          <div className="relative mx-auto mt-6 w-fit">
            <div className="stitched-circle relative h-32 w-32 overflow-hidden sm:h-36 sm:w-36">
              <Image
                src={eventInfo.photo}
                alt={`Foto do ${eventInfo.childName}`}
                fill
                className="object-cover object-top"
                priority
                sizes="144px"
              />
            </div>
            <StitchedHeart
              color="teal"
              className="absolute -bottom-1 -left-2 h-5 w-5"
            />
            <StitchedHeart
              color="orange"
              className="absolute -bottom-1 -right-2 h-5 w-5"
            />
          </div>

        </header>

        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-orange" />
              {eventInfo.weekday}, {eventInfo.dateShort}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal" />
              {eventInfo.time}
            </span>
          </div>

          <a
            href={eventInfo.location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex max-w-sm items-start justify-center gap-2 text-sm text-blue transition-opacity hover:opacity-80"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
            <span className="text-left leading-relaxed">
              {eventInfo.location.address}, {eventInfo.location.neighborhood},{" "}
              {eventInfo.location.city}-{eventInfo.location.state}
              <br />
              <span className="text-foreground/60">
                ({eventInfo.location.name})
              </span>
            </span>
          </a>
        </div>

        <div className="rounded-3xl border border-panel bg-white/90 p-6 shadow-lg backdrop-blur-sm">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue" />
            </div>
          ) : error && !conviteValido ? (
            <p className="py-8 text-center text-sm font-medium text-coral">
              {error}
            </p>
          ) : conviteValido ? (
            <div className="py-2 text-center">
              {status === "confirmado" ? (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-light/40">
                    <Check className="h-8 w-8 text-teal" />
                  </div>
                  <p className="font-display text-xl font-bold text-teal">
                    Presença confirmada!
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    Obrigado! Nos vemos na festa do {eventInfo.childName}! 🎉
                  </p>
                  <button
                    type="button"
                    onClick={baixarEventoIcs}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-8 py-4 font-bold text-white shadow-lg shadow-teal/20 transition-opacity hover:opacity-90"
                  >
                    <CalendarPlus className="h-5 w-5" />
                    Adicionar à agenda
                  </button>
                </>
              ) : status === "recusado" ? (
                <>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-coral-light/40">
                    <X className="h-8 w-8 text-coral" />
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">
                    Resposta registrada
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    Sentiremos sua falta! Obrigado por avisar. 💙
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("pendente");
                      setError(null);
                    }}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-panel bg-white px-8 py-4 font-bold text-blue transition-colors hover:border-blue hover:bg-blue-soft"
                  >
                    <Pencil className="h-4 w-4" />
                    Mudei de ideia, quero comparecer
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-5 text-sm leading-relaxed text-foreground/70">
                    Venha comemorar conosco, adoraríamos<br/>ter você nesse
                    dia tão especial!
                  </p>

                  <div className="mb-5 text-left">
                    <label
                      htmlFor="mensagem"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Quer deixar uma mensagem?{" "}
                      <span className="font-normal text-foreground/50">
                        (opcional)
                      </span>
                    </label>
                    <textarea
                      id="mensagem"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      rows={3}
                      maxLength={500}
                      className="w-full resize-none rounded-xl border border-panel bg-cream/80 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  {error && (
                    <p className="mb-4 text-sm font-medium text-coral">
                      {error}
                    </p>
                  )}

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleResponder("confirmado")}
                      disabled={enviando !== null}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue px-8 py-4 font-bold text-white shadow-lg shadow-blue/20 transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {enviando === "confirmado" ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Confirmar presença"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResponder("recusado")}
                      disabled={enviando !== null}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-panel bg-white px-8 py-4 font-bold text-foreground/70 transition-colors hover:border-coral hover:text-coral disabled:opacity-50"
                    >
                      {enviando === "recusado" ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Não poderei comparecer"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </PaginaEmConstrucao>
  );
}
