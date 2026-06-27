/**
 * Rotas internas — não linkar na landing page pública.
 */
export const CADASTRO_CONVIDADOS_PATH = "/pv-registro-familias-7x2k";
export const CONFIRMAR_PRESENCA_PATH = "/confirmar";

/** Monta o link de confirmação de presença para enviar via WhatsApp. */
export function buildLinkConfirmacao(familiaId: string, origin: string): string {
  const url = new URL(CONFIRMAR_PRESENCA_PATH, origin);
  url.searchParams.set("f", familiaId);
  return url.toString();
}
