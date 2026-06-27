import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ConfirmarPresenca } from "@/components/confirmar-presenca";
import {
  BalloonBackground,
  PageDecorBackground,
} from "@/components/ui/invitation-decor";
import { getConfirmarMetadata } from "@/lib/site-metadata";

export const metadata = getConfirmarMetadata();

function LoadingFallback() {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue" />
    </div>
  );
}

/** Link único por família: /confirmar?f=ID_DO_DOCUMENTO */
export default function ConfirmarPage() {
  return (
    <>
      <PageDecorBackground />
      <BalloonBackground />
      <Suspense fallback={<LoadingFallback />}>
        <ConfirmarPresenca />
      </Suspense>
    </>
  );
}
