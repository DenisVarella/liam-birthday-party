"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Pencil,
  Plus,
  Send,
  Trash2,
  UserX,
  Users,
  X,
} from "lucide-react";
import {
  atualizarFamilia,
  cadastrarFamilia,
  listarAcessosConvite,
  listarFamilias,
  marcarConviteEnviado,
  removerFamilia,
} from "@/lib/convidados-service";
import { buildLinkConfirmacao } from "@/lib/admin-route";
import type { AcessoConvite, FamiliaConvidada, RespostaStatus } from "@/lib/types/convidados";

const formatadorDataHora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatarDataHora(date: Date): string {
  return formatadorDataHora.format(date);
}

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

function CopiarUrlButton({ familiaId }: { familiaId: string }) {
  const [copied, setCopied] = useState(false);

  async function copiar() {
    const link = buildLinkConfirmacao(familiaId, window.location.origin);
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      title="Copiar URL do convite"
      className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-panel bg-white px-2 py-1.5 text-[11px] font-semibold text-blue transition-colors hover:bg-blue-soft"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 shrink-0 text-teal" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 shrink-0" />
          URL
        </>
      )}
    </button>
  );
}

function MarcarConvidadoButton({
  conviteEnviado,
  loading,
  onToggle,
}: {
  conviteEnviado: boolean;
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className={`inline-flex w-full items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
        conviteEnviado
          ? "border-teal/30 bg-teal-light/40 text-teal hover:bg-teal-light/60"
          : "border-panel bg-white text-foreground/70 hover:bg-orange-light/30 hover:text-orange"
      }`}
      title={
        conviteEnviado
          ? "Convite marcado como enviado — clique para desmarcar"
          : "Marcar convite como enviado"
      }
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : conviteEnviado ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Enviado
        </>
      ) : (
        <>
          <Send className="h-3.5 w-3.5" />
          Convidado
        </>
      )}
    </button>
  );
}

interface KpiCardProps {
  label: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  variant: "teal" | "coral";
}

function KpiCard({ label, value, subtitle, icon, variant }: KpiCardProps) {
  const styles = {
    teal: "border-teal/20 bg-teal-light/20 text-teal",
    coral: "border-coral/20 bg-coral-light/25 text-coral",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[variant]}`}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          {label}
        </p>
        <span className="opacity-70">{icon}</span>
      </div>
      <p className="font-display text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs opacity-70">{subtitle}</p>
    </div>
  );
}

function calcularKpis(familias: FamiliaConvidada[]) {
  let pessoasConfirmadas = 0;
  let pessoasRecusadas = 0;
  let familiasConfirmadas = 0;
  let familiasRecusadas = 0;

  for (const familia of familias) {
    const totalMembros = familia.membros.length;

    if (familia.status === "confirmado") {
      familiasConfirmadas += 1;
      pessoasConfirmadas += totalMembros;
    } else if (familia.status === "recusado") {
      familiasRecusadas += 1;
      pessoasRecusadas += totalMembros;
    }
  }

  return {
    pessoasConfirmadas,
    pessoasRecusadas,
    familiasConfirmadas,
    familiasRecusadas,
  };
}

interface FamiliaFormFieldsProps {
  nomeFamilia: string;
  membros: string[];
  onNomeFamiliaChange: (value: string) => void;
  onMembroChange: (index: number, value: string) => void;
  onAdicionarMembro: () => void;
  onRemoverMembro: (index: number) => void;
  idPrefix: string;
}

function FamiliaFormFields({
  nomeFamilia,
  membros,
  onNomeFamiliaChange,
  onMembroChange,
  onAdicionarMembro,
  onRemoverMembro,
  idPrefix,
}: FamiliaFormFieldsProps) {
  return (
    <>
      <div>
        <label
          htmlFor={`${idPrefix}-nomeFamilia`}
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Nome da família
        </label>
        <input
          id={`${idPrefix}-nomeFamilia`}
          type="text"
          required
          value={nomeFamilia}
          onChange={(e) => onNomeFamiliaChange(e.target.value)}
          placeholder="Ex.: Família Silva"
          className="w-full rounded-xl border border-panel bg-cream px-4 py-3 text-foreground outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">Membros</label>
          <button
            type="button"
            onClick={onAdicionarMembro}
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
                onChange={(e) => onMembroChange(index, e.target.value)}
                placeholder={`Nome do membro ${index + 1}`}
                className="flex-1 rounded-xl border border-panel bg-cream px-4 py-3 text-foreground outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20"
              />
              {membros.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoverMembro(index)}
                  className="rounded-xl border border-panel px-3 text-foreground/40 transition-colors hover:border-coral hover:text-coral"
                  aria-label="Remover membro"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ResumoAcessos({ familia }: { familia: FamiliaConvidada }) {
  const total = familia.totalAcessos ?? 0;

  if (total === 0) {
    return (
      <p className="mt-2 text-xs text-foreground/45">Nunca acessou o convite</p>
    );
  }

  const ultimo = familia.ultimoAcessoEm
    ? formatarDataHora(familia.ultimoAcessoEm)
    : "—";

  return (
    <p className="mt-2 text-xs text-foreground/55">
      {total === 1 ? "1 acesso" : `${total} acessos`} · último em {ultimo}
    </p>
  );
}

function HistoricoAcessos({
  familiaId,
  totalAcessos,
}: {
  familiaId: string;
  totalAcessos: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [acessos, setAcessos] = useState<AcessoConvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function toggleHistorico() {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);

    if (acessos.length > 0) return;

    setLoading(true);
    setError(false);

    try {
      const lista = await listarAcessosConvite(familiaId);
      setAcessos(lista);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (totalAcessos === 0) return null;

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={toggleHistorico}
        className="text-xs font-semibold text-blue transition-colors hover:text-blue/80"
      >
        {expanded ? "Ocultar histórico" : "Ver histórico"}
      </button>

      {expanded && (
        <div className="mt-2 rounded-xl bg-white/70 px-3 py-2">
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue" />
            </div>
          ) : error ? (
            <p className="text-xs text-coral">Erro ao carregar histórico.</p>
          ) : (
            <ul className="max-h-40 space-y-1 overflow-y-auto">
              {acessos.map((acesso) => (
                <li
                  key={acesso.id}
                  className="text-xs text-foreground/60 tabular-nums"
                >
                  {formatarDataHora(acesso.acessadoEm)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

interface FamiliaItemProps {
  familia: FamiliaConvidada;
  isEditing: boolean;
  editNomeFamilia: string;
  editMembros: string[];
  saving: boolean;
  removing: boolean;
  markingConvite: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRemove: () => void;
  onToggleConviteEnviado: () => void;
  onEditNomeFamiliaChange: (value: string) => void;
  onEditMembroChange: (index: number, value: string) => void;
  onAdicionarEditMembro: () => void;
  onRemoverEditMembro: (index: number) => void;
}

function FamiliaItem({
  familia,
  isEditing,
  editNomeFamilia,
  editMembros,
  saving,
  removing,
  markingConvite,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRemove,
  onToggleConviteEnviado,
  onEditNomeFamiliaChange,
  onEditMembroChange,
  onAdicionarEditMembro,
  onRemoverEditMembro,
}: FamiliaItemProps) {
  if (isEditing) {
    return (
      <li className="rounded-2xl border border-blue/30 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-display text-sm font-bold text-blue">Editando família</p>
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-foreground/50 transition-colors hover:bg-panel hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Cancelar
          </button>
        </div>

        <div className="space-y-4">
          <FamiliaFormFields
            idPrefix={`edit-${familia.id}`}
            nomeFamilia={editNomeFamilia}
            membros={editMembros}
            onNomeFamiliaChange={onEditNomeFamiliaChange}
            onMembroChange={onEditMembroChange}
            onAdicionarMembro={onAdicionarEditMembro}
            onRemoverMembro={onRemoverEditMembro}
          />

          <button
            type="button"
            onClick={onSaveEdit}
            disabled={saving || !editNomeFamilia.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-2">
      <div className="min-w-0 flex-1 rounded-xl border border-panel bg-cream/50 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="font-display text-sm font-bold text-foreground">
            {familia.nomeFamilia}
          </p>
          <StatusBadge status={familia.status} />
          {familia.conviteEnviado && (
            <span className="rounded-full bg-blue-soft px-2 py-0.5 text-[10px] font-semibold text-blue">
              Enviado
            </span>
          )}
        </div>

        {familia.mensagem && (
          <p className="mt-1.5 rounded-lg bg-white/60 px-2 py-1.5 text-xs italic text-foreground/65">
            &ldquo;{familia.mensagem}&rdquo;
          </p>
        )}

        <ul className="mt-1.5 space-y-0.5">
          {familia.membros.map((membro, i) => (
            <li key={i} className="text-xs text-foreground/70">
              {membro.nome}
              {membro.confirmado && (
                <span className="ml-1.5 font-semibold text-teal">✓</span>
              )}
            </li>
          ))}
        </ul>

        <ResumoAcessos familia={familia} />
        {familia.id && (
          <HistoricoAcessos
            familiaId={familia.id}
            totalAcessos={familia.totalAcessos ?? 0}
          />
        )}
      </div>

      <div className="grid w-[11.5rem] shrink-0 grid-cols-2 gap-1.5 self-start">
        {familia.id && (
          <MarcarConvidadoButton
            conviteEnviado={Boolean(familia.conviteEnviado)}
            loading={markingConvite}
            onToggle={onToggleConviteEnviado}
          />
        )}
        {familia.id && <CopiarUrlButton familiaId={familia.id} />}
        <button
          type="button"
          onClick={onStartEdit}
          className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-panel bg-white px-2 py-1.5 text-[11px] font-semibold text-foreground/70 transition-colors hover:bg-blue-soft hover:text-blue"
        >
          <Pencil className="h-3.5 w-3.5 shrink-0" />
          Editar
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-panel bg-white px-2 py-1.5 text-[11px] font-semibold text-coral transition-colors hover:bg-coral-light/30 disabled:opacity-50"
        >
          {removing ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 shrink-0" />
          )}
          Remover
        </button>
      </div>
    </li>
  );
}

/** Formulário de cadastro, edição e remoção de famílias convidadas. */
export function CadastroConvidadosForm() {
  const [nomeFamilia, setNomeFamilia] = useState("");
  const [membros, setMembros] = useState([""]);
  const [familias, setFamilias] = useState<FamiliaConvidada[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNomeFamilia, setEditNomeFamilia] = useState("");
  const [editMembros, setEditMembros] = useState<string[]>([""]);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [markingConviteId, setMarkingConviteId] = useState<string | null>(null);
  const [showCadastroForm, setShowCadastroForm] = useState(false);
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

  function iniciarEdicao(familia: FamiliaConvidada) {
    if (!familia.id) return;

    setEditingId(familia.id);
    setEditNomeFamilia(familia.nomeFamilia);
    setEditMembros(
      familia.membros.length > 0
        ? familia.membros.map((membro) => membro.nome)
        : [""],
    );
    setMessage(null);
  }

  function cancelarEdicao() {
    setEditingId(null);
    setEditNomeFamilia("");
    setEditMembros([""]);
  }

  function adicionarEditMembro() {
    setEditMembros((prev) => [...prev, ""]);
  }

  function removerEditMembro(index: number) {
    setEditMembros((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarEditMembro(index: number, valor: string) {
    setEditMembros((prev) => prev.map((m, i) => (i === index ? valor : m)));
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
      setShowCadastroForm(false);
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

  async function handleSaveEdit(familiaId: string) {
    setMessage(null);
    setSavingEditId(familiaId);

    try {
      await atualizarFamilia(familiaId, {
        nomeFamilia: editNomeFamilia,
        nomesMembros: editMembros,
      });

      setMessage({
        type: "success",
        text: `Família "${editNomeFamilia.trim()}" atualizada com sucesso!`,
      });
      cancelarEdicao();
      await recarregarFamilias();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Erro ao atualizar família. Tente novamente.",
      });
    } finally {
      setSavingEditId(null);
    }
  }

  async function handleRemove(familia: FamiliaConvidada) {
    if (!familia.id) return;

    const confirmado = window.confirm(
      `Remover o cadastro da família "${familia.nomeFamilia}"?\n\nO link de confirmação deixará de funcionar.`,
    );

    if (!confirmado) return;

    setMessage(null);
    setRemovingId(familia.id);

    try {
      await removerFamilia(familia.id);

      if (editingId === familia.id) {
        cancelarEdicao();
      }

      setMessage({
        type: "success",
        text: `Família "${familia.nomeFamilia}" removida com sucesso!`,
      });
      await recarregarFamilias();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Erro ao remover família. Tente novamente.",
      });
    } finally {
      setRemovingId(null);
    }
  }

  async function handleToggleConviteEnviado(familia: FamiliaConvidada) {
    if (!familia.id) return;

    setMessage(null);
    setMarkingConviteId(familia.id);

    try {
      await marcarConviteEnviado(familia.id, !familia.conviteEnviado);
      await recarregarFamilias();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Erro ao atualizar status do convite. Tente novamente.",
      });
    } finally {
      setMarkingConviteId(null);
    }
  }

  const totalMembros = familias.reduce((acc, f) => acc + f.membros.length, 0);
  const kpis = calcularKpis(familias);

  function fecharCadastroForm() {
    setShowCadastroForm(false);
    setNomeFamilia("");
    setMembros([""]);
  }

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
          Painel interno — coleção{" "}
          <code className="rounded bg-panel px-1.5 py-0.5 text-xs">convidados</code>
        </p>
      </header>

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className="grid flex-1 grid-cols-2 gap-4">
          <KpiCard
            label="Confirmados"
            value={kpis.pessoasConfirmadas}
            subtitle={
              kpis.familiasConfirmadas === 1
                ? "1 família confirmada"
                : `${kpis.familiasConfirmadas} famílias confirmadas`
            }
            icon={<CheckCircle2 className="h-5 w-5" />}
            variant="teal"
          />
          <KpiCard
            label="Não vão"
            value={kpis.pessoasRecusadas}
            subtitle={
              kpis.familiasRecusadas === 1
                ? "1 família recusou"
                : `${kpis.familiasRecusadas} famílias recusaram`
            }
            icon={<UserX className="h-5 w-5" />}
            variant="coral"
          />
        </div>

        {!showCadastroForm && (
          <button
            type="button"
            onClick={() => setShowCadastroForm(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-blue px-5 py-4 font-bold text-white shadow-sm transition-opacity hover:opacity-90 sm:self-stretch"
          >
            <Plus className="h-5 w-5" />
            Família
          </button>
        )}
      </div>

      {showCadastroForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-panel bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-foreground">
              Nova família
            </h2>
            <button
              type="button"
              onClick={fecharCadastroForm}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-foreground/50 transition-colors hover:bg-panel hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
          </div>

          <FamiliaFormFields
            idPrefix="novo"
            nomeFamilia={nomeFamilia}
            membros={membros}
            onNomeFamiliaChange={setNomeFamilia}
            onMembroChange={atualizarMembro}
            onAdicionarMembro={adicionarMembro}
            onRemoverMembro={removerMembro}
          />

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
      )}

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
              <FamiliaItem
                key={familia.id}
                familia={familia}
                isEditing={editingId === familia.id}
                editNomeFamilia={editNomeFamilia}
                editMembros={editMembros}
                saving={savingEditId === familia.id}
                removing={removingId === familia.id}
                markingConvite={markingConviteId === familia.id}
                onStartEdit={() => iniciarEdicao(familia)}
                onCancelEdit={cancelarEdicao}
                onSaveEdit={() => familia.id && handleSaveEdit(familia.id)}
                onRemove={() => handleRemove(familia)}
                onToggleConviteEnviado={() => handleToggleConviteEnviado(familia)}
                onEditNomeFamiliaChange={setEditNomeFamilia}
                onEditMembroChange={atualizarEditMembro}
                onAdicionarEditMembro={adicionarEditMembro}
                onRemoverEditMembro={removerEditMembro}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
