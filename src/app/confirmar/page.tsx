import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { ConfirmarPresenca } from "@/components/confirmar-presenca";

export const metadata: Metadata = {
  title: "Confirmar presença — 1º Aninho do Liam",
  description: "Confirme sua presença na festa do Liam.",
  robots: { index: false, follow: false },
};

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <Loader2 className="h-8 w-8 animate-spin text-blue" />
    </div>
  );
}

/** Link único por família: /confirmar?f=ID_DO_DOCUMENTO */
export default function ConfirmarPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConfirmarPresenca />
    </Suspense>
  );
}
