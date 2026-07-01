import type { Metadata } from "next";
import { CadastroConvidadosForm } from "@/components/admin/cadastro-convidados-form";

export const metadata: Metadata = {
  title: "Cadastro de Famílias",
  robots: { index: false, follow: false },
};

/** Painel interno — cadastro de famílias convidadas. */
export default function CadastroFamiliasPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-10 sm:px-6">
      <CadastroConvidadosForm />
    </main>
  );
}
