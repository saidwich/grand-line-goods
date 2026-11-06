"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    image: string;
    stock: number;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      image: product.image,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={product.stock === 0}
      className="bg-ink px-10 py-4 font-display text-xl uppercase tracking-wide text-paper transition-colors hover:bg-vermilion active:scale-95 disabled:opacity-50"
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}