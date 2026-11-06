"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useCart } from "@/lib/cart";

export default function Header({ children }: { children?: ReactNode }) {
  const { count, ready } = useCart();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          ☠ Grand Line Goods
        </Link>
        <div className="flex items-center gap-4">
          {children}
          <Link href="/cart" className="rounded-full border px-4 py-1 text-sm">
            Cart ({ready ? count : 0})
          </Link>
        </div>
      </div>
    </header>
  );
}