"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import CheckoutButton from "@/components/CheckoutButton";

export default function CartPage() {
  const { items, ready, totalCents, updateQuantity, removeItem } = useCart();

  if (!ready) return <main className="mx-auto max-w-4xl p-6">Loading cart...</main>;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-3xl font-bold">Your cart</h1>
        <p className="mb-4">Your cart is empty.</p>
        <Link href="/" className="underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Your cart</h1>

      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-4">
            <img src={item.image} alt={item.name} className="h-20 w-20 rounded border" />
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-semibold hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">${(item.priceCents / 100).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="h-8 w-8 rounded border"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="h-8 w-8 rounded border disabled:opacity-40"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-bold">
              ${((item.priceCents * item.quantity) / 100).toFixed(2)}
            </p>
            <button onClick={() => removeItem(item.productId)} className="text-sm text-red-600">
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t pt-6">
        <p className="text-xl font-bold">Total: ${(totalCents / 100).toFixed(2)}</p>
        <CheckoutButton />
      </div>
    </main>
  );
}