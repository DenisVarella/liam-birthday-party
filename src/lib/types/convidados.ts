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
