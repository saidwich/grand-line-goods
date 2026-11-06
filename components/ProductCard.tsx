"use client";

import Link from "next/link";
import { motion } from "motion/react";
import ProductImage from "./ProductImage";

type Props = {
  index: number;
  product: {
    slug: string;
    name: string;
    priceCents: number;
    image: string;
    stock: number;
    category: { name: string; slug: string };
  };
};

export default function ProductCard({ index, product }: Props) {
  const tilt = index % 2 === 0 ? -1.2 : 1.2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: tilt * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        rotate: 0,
        y: -10,
        scale: 1.03,
        transition: { type: "spring", stiffness: 300, damping: 18 },
      }}
      className="relative"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative block border-2 border-ink bg-paper-light p-2 shadow-[0_14px_24px_-14px_rgba(20,17,15,0.6)]"
      >
        {/* tape */}
        <span className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 rotate-2 bg-[#d9a521]/80" />

        <div className="relative overflow-hidden border border-ink">
          <ProductImage image={product.image} name={product.name} category={product.category.slug} />
          {product.stock === 0 && (
            <span className="absolute right-2 top-2 -rotate-6 border-2 border-vermilion bg-paper-light px-2 py-0.5 font-display text-lg uppercase text-vermilion">
              Sold out
            </span>
          )}
        </div>

        <div className="px-1 pb-1 pt-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
            {product.category.name}
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-vermilion"> · only {product.stock} left</span>
            )}
          </p>
          <h2 className="mt-1 text-base font-semibold leading-tight">{product.name}</h2>
          <div className="mt-3 flex items-end justify-between border-t border-dashed border-ink/40 pt-2">
            <span className="font-mono text-[11px] uppercase tracking-widest">Bounty</span>
            <span className="font-display text-3xl leading-none text-vermilion">
              ${(product.priceCents / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}