import type { Metadata } from "next";
import { Suspense } from "react";
import { Anton, DM_Sans, Special_Elite, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import UserNav from "@/components/UserNav";
import Marquee from "@/components/Marquee";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const elite = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-elite" });
const playfair = Playfair_Display({ weight: "900", subsets: ["latin"], variable: "--font-playfair" });
const cinzel = Cinzel({ weight: "700", subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "Grand Line Goods",
  description: "A fan-made pirate merch store (portfolio project)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${dm.variable} ${elite.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Marquee />
          <Header>
            <Suspense fallback={null}>
              <UserNav />
            </Suspense>
          </Header>
          <div className="flex-1">{children}</div>
          <footer className="mt-20 overflow-hidden bg-ink px-6 pb-8 pt-12 text-paper">
            <p className="font-display text-[14vw] uppercase leading-none text-paper/90 md:text-[9rem]">
              Grand Line <span className="text-vermilion">Goods</span>
            </p>
          <div className="mt-8 flex flex-col gap-4 border-t border-paper/20 pt-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md font-mono text-xs uppercase tracking-widest text-paper/50">
              Fan project for portfolio purposes. Not for sale and not affiliated with any official brand.
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-paper/80">
              Designed &amp; built by <span className="text-vermilion"><a
              href="https://github.com/saidwich"
              target="_blank"
              rel="noreferrer"
              className="text-vermilion underline-offset-4 transition hover:underline"
            >
              Darrel Cedric Cirineo
            </a></span>
              <br />
              <span className="text-paper/50">© 2026</span>
            </p>
          </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}