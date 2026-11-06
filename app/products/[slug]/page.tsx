import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImage from "@/components/ProductImage";

async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <ProductImage
        image={product.image}
        name={product.name}
        category={product.category.slug}
        color
        className="border-2 border-ink shadow-[0_25px_40px_-25px_rgba(20,17,15,0.7)]"
        />
      <div>
        <p className="text-sm text-gray-500">
          {product.category.name}
          {product.crew ? ` · ${product.crew}` : ""}
        </p>
        <h1 className="mb-2 font-display text-6xl uppercase leading-none">{product.name}</h1>
        <p className="mb-4 font-display text-5xl text-vermilion">${(product.priceCents / 100).toFixed(2)}</p>
        <p className="mb-6 text-gray-700">{product.description}</p>
        <p className="mb-4 text-sm">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <AddToCartButton
            product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                image: product.image,
                stock: product.stock,
            }}
        />
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <Link href="/" className="mb-6 inline-block text-sm underline">
        ← Back to shop
      </Link>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductDetail params={params} />
      </Suspense>
    </main>
  );
}