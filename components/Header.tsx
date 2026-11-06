"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/lib/cart";
import HatMark from "@/components/HatMark";

export default function Header({ children }: { children?: ReactNode }) {
  const { count, ready } = useCart();
  const shown = ready ? count : 0;

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <HatMark className="w-10 transition-transform duration-300 group-hover:-rotate-12" />
          <span className="font-display text-2xl uppercase tracking-wide">Grand Line Goods</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          {children}
          <Link
            href="/cart"
            className="flex items-center gap-2 border-2 border-ink px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-ink hover:text-paper"
          >
            Cart
            <span className="relative inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-vermilion text-paper">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={shown}
                  initial={{ y: -14, opacity: 0, scale: 0.6 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 14, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {shown}
                </motion.span>
              </AnimatePresence>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}