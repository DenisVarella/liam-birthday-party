"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Construction } from "lucide-react";

const SENHA_PREVIEW = "DG";

interface ModalEmConstrucaoProps {
  descricao?: string;
  storageKey: string;
  onDesbloquear: () => void;
}

/** Modal informando que a página ainda está em construção. */
function ModalEmConstrucao({
  descricao = "Use o link do seu convite para acessar esta página e confirmar sua presença.",
  storageKey,
  onDesbloquear,
}: ModalEmConstrucaoProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro(false);

    if (senha === SENHA_PREVIEW) {
      sessionStorage.setItem(storageKey, "1");
      onDesbloquear();
      return;
    }

    setErro(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/10 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-construcao-titulo"
    >
      <div className="w-full max-w-sm rounded-3xl border border-panel bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setMostrarSenha(true);
            setErro(false);
          }}
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-light/40 transition-transform hover:scale-105"
          aria-label="Inserir senha de acesso"
          title="Acesso restrito"
        >
          <Construction className="h-7 w-7 text-orange" />
        </button>

        <h2
          id="modal-construcao-titulo"
          className="font-display text-xl font-bold text-foreground"
        >
          Página em construção
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">
          {descricao}
        </p>

        {mostrarSenha && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-left">
            <label htmlFor="senha-preview" className="sr-only">
              Senha de acesso
            </label>
            <input
              id="senha-preview"
              type="password"
              value={senha}
              onChange={(event) => {
                setSenha(event.target.value);
                setErro(false);
              }}
              placeholder="Senha de acesso"
              autoFocus
              className="w-full rounded-xl border border-panel bg-cream px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
            {erro && (
              <p className="text-xs font-medium text-coral">Senha incorreta.</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Acessar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface PaginaEmConstrucaoProps {
  children: React.ReactNode;
  ativa?: boolean;
  descricao?: string;
}

/** Embaça o conteúdo e exibe modal de construção quando ativa. */
export function PaginaEmConstrucao({
  children,
  ativa = true,
  descricao,
}: PaginaEmConstrucaoProps) {
  const pathname = usePathname();
  const storageKey = `preview-desbloqueado:${pathname}`;
  const [desbloqueada, setDesbloqueada] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(storageKey) === "1") {
      setDesbloqueada(true);
    }
  }, [storageKey]);

  if (!ativa || desbloqueada) return children;

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none min-h-screen select-none blur-md"
        aria-hidden
      >
        {children}
      </div>
      <ModalEmConstrucao
        descricao={descricao}
        storageKey={storageKey}
        onDesbloquear={() => setDesbloqueada(true)}
      />
    </div>
  );
}
