import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import WantedPoster from "@/components/WantedPoster";

type SearchParams = Promise<{ category?: string }>;

async function Filters({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const base =
    "border-2 border-ink px-5 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors";
  const active = "bg-ink text-paper";
  const idle = "hover:bg-ink/10";

  return (
    <div className="mb-10 flex flex-wrap gap-3">
      <Link href="/#shop" className={`${base} ${!category ? active : idle}`}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/?category=${c.slug}#shop`}
          className={`${base} ${category === c.slug ? active : idle}`}
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

  if (products.length === 0) return <p>Nothing pinned to the board yet.</p>;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          index={i}
          product={{
            slug: p.slug,
            name: p.name,
            priceCents: p.priceCents,
            image: p.image,
            stock: p.stock,
            category: { name: p.category.name, slug: p.category.slug },
          }}
        />
      ))}
    </div>
  );
}

async function FeaturedPoster() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 }, NOT: { image: "/placeholder.svg" } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, slug: true, name: true, priceCents: true, image: true },
  });

  return <WantedPoster featured={products} />;
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main>
      <Hero
        poster={
          <Suspense fallback={<WantedPoster />}>
            <FeaturedPoster />
          </Suspense>
        }
      />
      <section id="shop" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-8 md:px-6">
        <div className="mb-8 flex items-end justify-between border-b-4 border-ink pb-3">
          <h2 className="font-display text-5xl uppercase leading-none md:text-7xl">The Loot</h2>
          <p className="hidden font-mono text-xs uppercase tracking-widest md:block">
            Pinned fresh from the Grand Line
          </p>
        </div>
        <Suspense fallback={<p className="font-mono text-sm">Unrolling posters...</p>}>
          <Filters searchParams={searchParams} />
          <ProductGrid searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}