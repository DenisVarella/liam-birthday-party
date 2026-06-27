"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, Loader2, Plus, Trash2, Users } from "lucide-react";
import {
  cadastrarFamilia,
  listarFamilias,
} from "@/lib/convidados-service";
import { buildLinkConfirmacao } from "@/lib/admin-route";
import type { FamiliaConvidada, RespostaStatus } from "@/lib/types/convidados";

function StatusBadge({ status }: { status: RespostaStatus }) {
  const styles = {
    pendente: "bg-orange-light/40 text-orange",
    confirmado: "bg-teal-light/50 text-teal",
    recusado: "bg-coral-light/50 text-coral",
  };
  const labels = {
    pendente: "Pendente",
    confirmado: "Confirmado",
    recusado: "Não comparecerá",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function CopiarLinkButton({ familiaId }: { familiaId: string }) {
  const [copied, setCopied] = useState(false);

  async function copiar() {
    const link = buildLinkConfirmacao(familiaId, window.location.origin);
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex items-center gap-1.5 rounded-lg border border-panel bg-white px-3 py-1.5 text-xs font-semibold text-blue transition-colors hover:bg-blue-soft"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-teal" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copiar link WhatsApp
        </>
      )}
    </button>
  );
}

/** Formulário temporário de cadastro de famílias convidadas. */
export function CadastroConvidadosForm() {
  const [nomeFamilia, setNomeFamilia] = useState("");
  const [membros, setMembros] = useState([""]);
  const [familias, setFamilias] = useState<FamiliaConvidada[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    listarFamilias()
      .then((lista) => {
        if (!cancelled) setFamilias(lista);
      })
      .catch(() => {
        if (!cancelled) {
          setMessage({
            type: "error",
            text: "Erro ao carregar famílias. Verifique as regras do Firestore.",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function recarregarFamilias() {
    const lista = await listarFamilias();
    setFamilias(lista);
  }

  function adicionarMembro() {
    setMembros((prev) => [...prev, ""]);
  }

  function removerMembro(index: number) {
    setMembros((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarMembro(index: number, valor: string) {
    setMembros((prev) => prev.map((m, i) => (i === index ? valor : m)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      await cadastrarFamilia({
        nomeFamilia,
        nomesMembros: membros,
      });

      setMessage({
        type: "success",
        text: `Família "${nomeFamilia.trim()}" cadastrada com sucesso!`,
      });
      setNomeFamilia("");
      setMembros([""]);
      await recarregarFamilias();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Erro ao cadastrar família. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const totalMembros = familias.reduce((acc, f) => acc + f.membros.length, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-soft">
          <Users className="h-7 w-7 text-blue" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Cadastro de Famílias
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Painel temporário — coleção{" "}
          <code className="rounded bg-panel px-1.5 py-0.5 text-xs">convidados</code>
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-panel bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label
            htmlFor="nomeFamilia"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            Nome da família
          </label>
          <input
            id="nomeFamilia"
            type="text"
            required
            value={nomeFamilia}
            onChange={(e) => setNomeFamilia(e.target.value)}
            placeholder="Ex.: Família Silva"
            className="w-full rounded-xl border border-panel bg-cream px-4 py-3 text-foreground outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">
              Membros
            </label>
            <button
              type="button"
              onClick={adicionarMembro}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-teal transition-colors hover:bg-teal-light/30"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </button>
          </div>

          <div className="space-y-3">
            {membros.map((membro, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={membro}
                  onChange={(e) => atualizarMembro(index, e.target.value)}
                  placeholder={`Nome do membro ${index + 1}`}
                  className="flex-1 rounded-xl border border-panel bg-cream px-4 py-3 text-foreground outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20"
                />
                {membros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerMembro(index)}
                    className="rounded-xl border border-panel px-3 text-foreground/40 transition-colors hover:border-coral hover:text-coral"
                    aria-label="Remover membro"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-foreground/50">
            Cada membro será salvo com{" "}
            <code className="rounded bg-panel px-1">confirmado: false</code>
          </p>
        </div>

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-teal-light/40 text-teal"
                : "bg-coral-light/50 text-coral"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !nomeFamilia.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue py-3.5 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Salvando...
            </>
          ) : (
            "Cadastrar família"
          )}
        </button>
      </form>

      <section className="rounded-3xl border border-panel bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            Famílias cadastradas
          </h2>
          <span className="rounded-full bg-blue-soft px-3 py-1 text-xs font-semibold text-blue">
            {familias.length} famílias · {totalMembros} pessoas
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-foreground/50">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : familias.length === 0 ? (
          <p className="py-6 text-center text-sm text-foreground/50">
            Nenhuma família cadastrada ainda.
          </p>
        ) : (
          <ul className="space-y-4">
            {familias.map((familia) => (
              <li
                key={familia.id}
                className="rounded-2xl border border-panel bg-cream/50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-bold text-foreground">
                      {familia.nomeFamilia}
                    </p>
                    <StatusBadge status={familia.status} />
                  </div>
                  {familia.id && <CopiarLinkButton familiaId={familia.id} />}
                </div>
                {familia.id && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-foreground/40">
                    <Link2 className="h-3 w-3" />
                    /confirmar?f={familia.id}
                  </p>
                )}
                {familia.mensagem && (
                  <p className="mt-2 rounded-xl bg-white/60 px-3 py-2 text-sm italic text-foreground/65">
                    &ldquo;{familia.mensagem}&rdquo;
                  </p>
                )}
                <ul className="mt-2 space-y-1">
                  {familia.membros.map((membro, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-sm text-foreground/70"
                    >
                      <span>{membro.nome}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          membro.confirmado
                            ? "bg-teal-light/50 text-teal"
                            : familia.status === "recusado"
                              ? "bg-coral-light/40 text-coral"
                              : "bg-orange-light/40 text-orange"
                        }`}
                      >
                        {membro.confirmado
                          ? "Confirmado"
                          : familia.status === "recusado"
                            ? "—"
                            : "Pendente"}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
