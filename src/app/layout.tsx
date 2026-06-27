import type { Metadata } from "next";
import { Fredoka, Nunito, Pacifico } from "next/font/google";
import { getHomeMetadata } from "@/lib/site-metadata";
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

export const metadata: Metadata = getHomeMetadata();

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
      <body className="flex min-h-full flex-col bg-transparent">{children}</body>
    </html>
  );
}
