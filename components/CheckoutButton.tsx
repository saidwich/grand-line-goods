"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

export default function CheckoutButton() {
  const { items } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data = await res.json();
    if (!res.ok || !data.url) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="text-right">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="rounded bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Redirecting..." : "Checkout"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}