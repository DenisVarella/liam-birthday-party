import type { Metadata } from "next";
import { Fredoka, Nunito, Pacifico } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "1º Aninho do Liam — 16 de agosto de 2026",
  description:
    "Venha comemorar o 1º aninho do Liam! Festa no Condomínio Class, Guarulhos-SP — 16/08/2026 às 14h.",
  openGraph: {
    title: "1º Aninho do Liam",
    description: "Venha comemorar esse dia especial!",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${fredoka.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
