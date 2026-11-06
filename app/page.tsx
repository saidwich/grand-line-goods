import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ category?: string }>;

async function Filters({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const base = "rounded-full border px-4 py-1 text-sm";
  const active = "bg-black text-white";

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href="/" className={`${base} ${!category ? active : ""}`}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/?category=${c.slug}`}
          className={`${base} ${category === c.slug ? active : ""}`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  const products = await prisma.product.findMany({
    where: category ? { category: { slug: category } } : {},
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) return <p>No products found.</p>;

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/products/${p.slug}`}
          className="rounded-lg border p-3 transition hover:shadow-md"
        >
          <img src={p.image} alt={p.name} className="mb-3 w-full rounded" />
          <p className="text-xs text-gray-500">{p.category.name}</p>
          <h2 className="font-semibold">{p.name}</h2>
          <p className="font-bold">${(p.priceCents / 100).toFixed(2)}</p>
        </Link>
      ))}
    </div>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <section className="mb-10 rounded-2xl bg-[#1e3a5f] px-6 py-14 text-center text-white">
        <p className="mb-2 text-sm uppercase tracking-widest text-[#f5c542]">Set sail for treasure</p>
        <h1 className="mb-3 text-4xl font-bold md:text-5xl">Grand Line Goods</h1>
        <p className="mx-auto max-w-xl text-gray-200">
          Figures, apparel, posters and accessories for pirates at heart.
        </p>
      </section>
      <Suspense fallback={<p>Loading...</p>}>
        <Filters searchParams={searchParams} />
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </main>
  );
}