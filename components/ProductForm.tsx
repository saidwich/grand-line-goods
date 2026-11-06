"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/admin";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  categories: { id: string; name: string }[];
  product?: {
    name: string;
    description: string;
    priceCents: number;
    stock: number;
    image: string;
    crew: string | null;
    categoryId: string;
  };
};

export default function ProductForm({ action, categories, product }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const input = "rounded border p-2";

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-3">
      <input name="name" placeholder="Name" defaultValue={product?.name} required className={input} />
      <textarea
        name="description"
        placeholder="Description"
        defaultValue={product?.description}
        required
        rows={4}
        className={input}
      />
      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price (e.g. 24.99)"
        defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""}
        required
        className={input}
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        defaultValue={product?.stock ?? 10}
        required
        className={input}
      />
      <input
        name="image"
        placeholder="Image path (e.g. /placeholder.svg)"
        defaultValue={product?.image ?? "/placeholder.svg"}
        required
        className={input}
      />
      <input name="crew" placeholder="Crew (optional)" defaultValue={product?.crew ?? ""} className={input} />
      <select name="categoryId" defaultValue={product?.categoryId ?? ""} required className={input}>
        <option value="" disabled>
          Select category
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="rounded bg-black p-2 text-white disabled:opacity-50">
        {pending ? "Saving..." : "Save product"}
      </button>
    </form>
  );
}