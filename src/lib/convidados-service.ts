import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  AcessoConvite,
  AtualizarFamiliaInput,
  FamiliaConvidada,
  FamiliaPublica,
  NovaFamiliaInput,
  RespostaConviteInput,
  RespostaStatus,
} from "@/lib/types/convidados";

const COLLECTION = "convidados";
const ACESSOS_SUBCOLLECTION = "acessos";

function parseStatus(
  data: Record<string, unknown>,
  membros: FamiliaConvidada["membros"],
): RespostaStatus {
  const status = data.status;
  if (
    status === "confirmado" ||
    status === "recusado" ||
    status === "pendente"
  ) {
    return status;
  }

  if (membros.length > 0 && membros.every((m) => m.confirmado)) {
    return "confirmado";
  }

  return "pendente";
}

function mapDoc(id: string, data: Record<string, unknown>): FamiliaConvidada {
  const criadoEm = data.criadoEm;
  const respondidoEm = data.respondidoEm;
  const ultimoAcessoEm = data.ultimoAcessoEm;
  const membros = Array.isArray(data.membros)
    ? data.membros.map((m: { nome?: string; confirmado?: boolean }) => ({
        nome: String(m.nome ?? ""),
        confirmado: Boolean(m.confirmado),
      }))
    : [];

  return {
    id,
    nomeFamilia: String(data.nomeFamilia ?? ""),
    membros,
    status: parseStatus(data, membros),
    mensagem: data.mensagem ? String(data.mensagem) : undefined,
    criadoEm: criadoEm instanceof Timestamp ? criadoEm.toDate() : undefined,
    respondidoEm:
      respondidoEm instanceof Timestamp ? respondidoEm.toDate() : undefined,
    totalAcessos:
      typeof data.totalAcessos === "number" ? data.totalAcessos : 0,
    ultimoAcessoEm:
      ultimoAcessoEm instanceof Timestamp ? ultimoAcessoEm.toDate() : undefined,
  };
}

/** Lista todas as famílias cadastradas. */
export async function listarFamilias(): Promise<FamiliaConvidada[]> {
  const q = query(collection(db, COLLECTION), orderBy("nomeFamilia", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => mapDoc(doc.id, doc.data()));
}

/** Cadastra uma nova família com membros (confirmado: false). */
export async function cadastrarFamilia(
  input: NovaFamiliaInput,
): Promise<string> {
  const membros = input.nomesMembros
    .map((nome) => nome.trim())
    .filter(Boolean)
    .map((nome) => ({ nome, confirmado: false }));

  if (membros.length === 0) {
    throw new Error("Adicione pelo menos um membro à família.");
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    nomeFamilia: input.nomeFamilia.trim(),
    membros,
    status: "pendente",
    criadoEm: serverTimestamp(),
  });

  return docRef.id;
}

function buildMembrosFromNomes(
  nomesMembros: string[],
  membrosAtuais: { nome: string; confirmado: boolean }[] = [],
): FamiliaConvidada["membros"] {
  const nomes = nomesMembros.map((nome) => nome.trim()).filter(Boolean);

  if (nomes.length === 0) {
    throw new Error("Adicione pelo menos um membro à família.");
  }

  const confirmadoPorNome = new Map(
    membrosAtuais.map((membro) => [
      membro.nome.trim().toLowerCase(),
      membro.confirmado,
    ]),
  );

  return nomes.map((nome) => ({
    nome,
    confirmado: confirmadoPorNome.get(nome.toLowerCase()) ?? false,
  }));
}

/** Atualiza nome da família e lista de membros (preserva confirmação por nome). */
export async function atualizarFamilia(
  familiaId: string,
  input: AtualizarFamiliaInput,
): Promise<void> {
  const ref = doc(db, COLLECTION, familiaId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Família não encontrada.");
  }

  const data = snap.data();
  const membrosAtuais = Array.isArray(data.membros)
    ? data.membros.map((m: { nome?: string; confirmado?: boolean }) => ({
        nome: String(m.nome ?? ""),
        confirmado: Boolean(m.confirmado),
      }))
    : [];

  await updateDoc(ref, {
    nomeFamilia: input.nomeFamilia.trim(),
    membros: buildMembrosFromNomes(input.nomesMembros, membrosAtuais),
  });
}

/** Remove o cadastro de uma família. */
export async function removerFamilia(familiaId: string): Promise<void> {
  const ref = doc(db, COLLECTION, familiaId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Família não encontrada.");
  }

  await deleteDoc(ref);
}

/** Busca família pelo ID — retorna apenas se o convite é válido e o status. */
export async function getFamiliaPublica(
  id: string,
): Promise<FamiliaPublica | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;

  const data = mapDoc(snap.id, snap.data());
  return { id: data.id!, status: data.status };
}

/** Registra abertura do link do convite (subcoleção + contadores no documento pai). */
export async function registrarAcessoConvite(familiaId: string): Promise<void> {
  const ref = doc(db, COLLECTION, familiaId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  await addDoc(collection(ref, ACESSOS_SUBCOLLECTION), {
    acessadoEm: serverTimestamp(),
  });

  await updateDoc(ref, {
    totalAcessos: increment(1),
    ultimoAcessoEm: serverTimestamp(),
  });
}

/** Lista histórico de acessos ao convite — mais recentes primeiro. */
export async function listarAcessosConvite(
  familiaId: string,
): Promise<AcessoConvite[]> {
  const ref = doc(db, COLLECTION, familiaId);
  const q = query(
    collection(ref, ACESSOS_SUBCOLLECTION),
    orderBy("acessadoEm", "desc"),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((acessoDoc) => {
    const acessadoEm = acessoDoc.data().acessadoEm;
    return {
      id: acessoDoc.id,
      acessadoEm: acessadoEm instanceof Timestamp ? acessadoEm.toDate() : new Date(),
    };
  });
}

/** Responde ao convite — confirma ou recusa presença de toda a família. */
export async function responderConvite(
  familiaId: string,
  input: RespostaConviteInput,
): Promise<void> {
  const ref = doc(db, COLLECTION, familiaId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Convite não encontrado.");
  }

  const data = snap.data();
  const membros = Array.isArray(data.membros)
    ? data.membros.map((m: { nome?: string; confirmado?: boolean }) => ({
        nome: String(m.nome ?? ""),
        confirmado: input.tipo === "confirmado",
      }))
    : [];

  if (membros.length === 0) {
    throw new Error("Convite sem membros cadastrados.");
  }

  const mensagem = input.mensagem?.trim();

  await updateDoc(ref, {
    membros,
    status: input.tipo,
    ...(mensagem ? { mensagem } : {}),
    respondidoEm: serverTimestamp(),
  });
}
