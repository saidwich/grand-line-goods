"use client";

import Link from "next/link";
import { motion } from "motion/react";
import HatMark from "./HatMark";
import WantedPoster from "./WantedPoster";
import { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
const lines = ["Loot for", "Pirates", "at heart."];

export default function Hero({ poster }: { poster: ReactNode }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 md:grid-cols-[1.35fr_1fr] md:px-6 md:pt-16">
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-4 font-mono text-sm uppercase tracking-widest text-vermilion"
        >
          Grand Line Goods · Issue No. 01
        </motion.p>

        <h1 className="font-display text-[20vw] uppercase leading-[0.88] md:text-[8.5rem]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${i === 1 ? "text-vermilion" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.12 * i, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="mt-6 max-w-md text-lg text-ink/80"
        >
          Figures, apparel, posters and trinkets for anyone who has ever wanted to run away to sea.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease }}
        >
          <Link
            href="#shop"
            className="group mt-8 inline-flex items-center gap-3 bg-ink px-8 py-4 font-display text-xl uppercase tracking-wide text-paper transition-colors hover:bg-vermilion"
          >
            Browse the loot
            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
          </Link>
        </motion.div>
      </div>

      {/* wanted poster */}
        <motion.div
        initial={{ opacity: 0, rotate: 10, y: 80 }}
        animate={{ opacity: 1, rotate: 3, y: 0 }}
        transition={{ duration: 1.1, delay: 0.4, ease }}
        className="relative mx-auto w-full max-w-sm"
        >
        <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, -1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ rotate: 0, scale: 1.03 }}
            className="relative"
        >
            <span className="absolute -top-3 left-8 z-10 h-7 w-20 -rotate-6 bg-[#d9a521]/80" />
            <span className="absolute -top-3 right-8 z-10 h-7 w-20 rotate-6 bg-[#d9a521]/80" />
            {poster}
        </motion.div>
        </motion.div>
    </section>
  );
}