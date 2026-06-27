import type { Metadata } from "next";
import { CadastroConvidadosForm } from "@/components/admin/cadastro-convidados-form";

export const metadata: Metadata = {
  title: "Cadastro",
  robots: { index: false, follow: false },
};

/** Página oculta — cadastro temporário de famílias convidadas. */
export default function CadastroConvidadosPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-10 sm:px-6">
      <CadastroConvidadosForm />
    </main>
  );
}
