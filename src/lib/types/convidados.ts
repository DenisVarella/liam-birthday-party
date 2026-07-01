/** Membro de uma família convidada. */
export interface ConvidadoMembro {
  nome: string;
  confirmado: boolean;
}

/** Status da resposta do convite. */
export type RespostaStatus = "pendente" | "confirmado" | "recusado";

/** Documento da coleção "convidados" — uma família por documento. */
export interface FamiliaConvidada {
  id?: string;
  nomeFamilia: string;
  membros: ConvidadoMembro[];
  status: RespostaStatus;
  mensagem?: string;
  criadoEm?: Date;
  respondidoEm?: Date;
  totalAcessos?: number;
  ultimoAcessoEm?: Date;
}

/** Registro de abertura do link do convite. */
export interface AcessoConvite {
  id?: string;
  acessadoEm: Date;
}

/** Dados públicos da família — sem nomes nem nomeFamilia. */
export interface FamiliaPublica {
  id: string;
  status: RespostaStatus;
}

/** Payload para responder ao convite. */
export interface RespostaConviteInput {
  tipo: "confirmado" | "recusado";
  mensagem?: string;
}

/** Payload para criar uma nova família. */
export interface NovaFamiliaInput {
  nomeFamilia: string;
  nomesMembros: string[];
}

/** Payload para atualizar uma família existente. */
export interface AtualizarFamiliaInput {
  nomeFamilia: string;
  nomesMembros: string[];
}
