"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import HatMark from "./HatMark";

const INK = "#3b2a17";
const serif = { fontFamily: "var(--font-playfair), serif", fontWeight: 900 } as const;
const spaced = { fontFamily: "var(--font-cinzel), serif", fontWeight: 700 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

export type FeaturedProduct = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
};

function Curl({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      className="h-full w-full"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path d="M30 6 C8 10 8 36 24 38 C12 46 20 70 14 102 C9 140 18 172 30 194" />
      <circle cx="26" cy="14" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function resolveSrc(image: string) {
  return image && !image.startsWith("/") && !image.startsWith("http") ? `/${image}` : image;
}

export default function WantedPoster({ featured = [] }: { featured?: FeaturedProduct[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = featured[i];

  // advance every 4 seconds; restarts whenever the slide changes
  useEffect(() => {
    if (paused || featured.length < 2) return;
    const t = setTimeout(() => setI((p) => (p + 1) % featured.length), 4000);
    return () => clearTimeout(t);
  }, [i, paused, featured.length]);

  const poster = (
    <div
      className="relative w-full overflow-hidden"
      style={{
        containerType: "inline-size",
        aspectRatio: "1 / 1.414",
        color: INK,
        background: "linear-gradient(160deg, #d8ccae 0%, #c9bb98 55%, #bfae88 100%)",
        border: `0.9cqw solid ${INK}`,
        boxShadow: "inset 0 0 9cqw rgba(90,64,35,0.55), 0 30px 40px -25px rgba(20,17,15,0.7)",
      }}
    >
      {/* crumpled paper texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.035 .05' numOctaves='4' seed='8'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .25 0 0 0 0 .13 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* WANTED */}
        <h2
        className="absolute inset-x-0 text-center uppercase"
        style={{
            ...serif,
            top: "2.5%",
            fontSize: "20cqw",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            transform: "scaleX(1.06)",
            transformOrigin: "center",
        }}
        >
        Wanted
        </h2>

      {/* photo window */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: "26.5%",
          left: "9%",
          right: "9%",
          height: "40%",
          background: "#f4ecd6",
          border: `0.8cqw solid ${INK}`,
          boxShadow: "inset 0 0 4cqw rgba(90,64,35,0.45)",
        }}
      >
        <AnimatePresence initial={false}>
          {current && current.image !== "/placeholder.svg" ? (
            <motion.img
              key={current.id}
              src={resolveSrc(current.image)}
              alt={current.name}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
            />
          ) : (
            <motion.div
              key={current ? current.id : "hat"}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
            >
              <div className="halftone absolute inset-0 opacity-70" />
              <HatMark className="relative w-3/5" />
            </motion.div>
          )}
        </AnimatePresence>

        {current && (
          <span
            className="absolute font-display uppercase text-vermilion"
            style={{
              top: "5%",
              left: "3%",
              fontSize: "3.6cqw",
              padding: "0.6cqw 1.6cqw",
              border: "0.6cqw solid #e8391a",
              background: "rgba(244,236,214,0.9)",
              transform: "rotate(-7deg)",
              letterSpacing: "0.08em",
            }}
          >
            Featured
          </span>
        )}
      </div>

      {/* DEAD OR ALIVE */}
      <p
        className="absolute inset-x-0 text-center uppercase"
        style={{ ...spaced, top: "69.5%", fontSize: "5.2cqw", letterSpacing: "0.3em", paddingLeft: "0.3em" }}
      >
        Dead or Alive
      </p>

      {/* product name */}
      <div
        className="absolute flex items-center justify-center text-center"
        style={{ top: "75.5%", left: "11%", right: "11%", height: "10.5%" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current ? current.id : "you"}
            className="line-clamp-2 uppercase"
            style={{ ...serif, fontSize: "6.2cqw", lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease }}
          >
            {current ? current.name : "You"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* side curls */}
      <div className="absolute" style={{ left: "2%", top: "70%", height: "27%", width: "5%" }}>
        <Curl />
      </div>
      <div className="absolute" style={{ right: "2%", top: "70%", height: "27%", width: "5%" }}>
        <Curl flip />
      </div>

      {/* bottom row */}
      <div
        className="absolute flex items-end justify-between"
        style={{ left: "11%", right: "11%", bottom: "4%" }}
      >
        <p
          className="font-mono uppercase"
          style={{ fontSize: "2.1cqw", lineHeight: 1.4, letterSpacing: "0.05em", width: "34%" }}
        >
          Fan project.
          <br />
          Not an official poster.
        </p>
        <div className="text-right">
          <p className="font-mono uppercase" style={{ fontSize: "2.4cqw", letterSpacing: "0.2em" }}>
            Bounty
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current ? current.id : "priceless"}
              className="uppercase"
              style={{ ...serif, fontSize: "10cqw", lineHeight: 1 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
            >
              {current ? `$${(current.priceCents / 100).toFixed(2)}` : "Priceless"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {current ? (
        <Link href={`/products/${current.slug}`} aria-label={`View ${current.name}`} className="block">
          {poster}
        </Link>
      ) : (
        poster
      )}

      {featured.length > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {featured.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setI(idx)}
              aria-label={`Show ${p.name}`}
              className={`h-2 border border-ink transition-all duration-300 ${
                idx === i ? "w-8 bg-ink" : "w-2 bg-transparent hover:bg-ink/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}