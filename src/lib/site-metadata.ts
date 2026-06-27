import type { Metadata } from "next";
import { eventInfo } from "@/lib/event-data";

/** URL pública do site — necessária para preview no WhatsApp (Open Graph). */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

const ogImage = {
  url: "/images/liam.jpg",
  width: 809,
  height: 1024,
  alt: `Foto do ${eventInfo.childName} — ${eventInfo.title}`,
};

const ogImageConvite = {
  url: eventInfo.conviteImage,
  width: 790,
  height: 790,
  alt: `Convite digital — ${eventInfo.title}`,
};

/** Metadados Open Graph compartilhados (WhatsApp, iMessage, etc.). */
export const sharedOpenGraph = {
  type: "website" as const,
  locale: "pt_BR",
  siteName: eventInfo.title,
  images: [ogImage],
};

/** Metadados da landing page principal. */
export function getHomeMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: `${eventInfo.title} — 16 de agosto de 2026`,
    description: `Venha comemorar o 1º aninho do ${eventInfo.childName}! Festa no Condomínio Class, Guarulhos-SP — 16/08/2026 às 14h.`,
    openGraph: {
      ...sharedOpenGraph,
      title: `🎉 ${eventInfo.title}`,
      description: "Venha comemorar esse dia especial! 16/08/2026 às 14h — Guarulhos-SP.",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: eventInfo.title,
      description: "Venha comemorar esse dia especial!",
      images: [ogImage.url],
    },
  };
}

/** Metadados da página de confirmação de presença. */
export function getConfirmarMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: `Convite — ${eventInfo.title}`,
    description: `Você está convidado! Confirme sua presença na festa do ${eventInfo.childName} — 16/08/2026 às 14h, Guarulhos-SP.`,
    robots: { index: false, follow: false },
    openGraph: {
      ...sharedOpenGraph,
      title: `🎉 Você está convidado — ${eventInfo.title}`,
      description: `Confirme sua presença! ${eventInfo.date} às ${eventInfo.time} · Guarulhos-SP`,
      url: "/confirmar",
      images: [ogImageConvite],
    },
    twitter: {
      card: "summary_large_image",
      title: `Convite — ${eventInfo.title}`,
      description: "Confirme sua presença na festa!",
      images: [ogImageConvite.url],
    },
  };
}

/** URL absoluta da imagem do convite para preview no WhatsApp. */
export function getPhotoUrl(origin?: string): string {
  const base = (origin ?? getSiteUrl()).replace(/\/$/, "");
  return `${base}${eventInfo.conviteImage}`;
}

/** Texto formatado para colar no WhatsApp junto com o link. */
export function buildWhatsAppConviteMessage(
  link: string,
  origin?: string,
): string {
  const photoUrl = getPhotoUrl(origin);

  return [
    `🎉 *${eventInfo.title}*`,
    "",
    photoUrl,
    "",
    "Você está convidado(a) para celebrar conosco!",
    "",
    `📅 ${eventInfo.date}`,
    `🕐 ${eventInfo.time}`,
    `📍 ${eventInfo.location.name} — ${eventInfo.location.city}/${eventInfo.location.state}`,
    "",
    "Confirme sua presença pelo link:",
    link,
  ].join("\n");
}

/** Link direto para abrir WhatsApp com a mensagem pré-preenchida. */
export function buildWhatsAppShareUrl(
  link: string,
  phone?: string,
  origin?: string,
): string {
  const text = encodeURIComponent(buildWhatsAppConviteMessage(link, origin));
  if (phone) {
    return `https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
}
