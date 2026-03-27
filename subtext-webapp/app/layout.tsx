import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Subtext — Quello che le tue chat dicono davvero",
  description:
    "Analisi della comunicazione nelle chat WhatsApp: pre-analisi gratuita, report approfondito con massima attenzione alla privacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="font-ui flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="relative z-[1] flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
