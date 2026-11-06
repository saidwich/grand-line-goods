import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { updateProduct } from "@/app/actions/admin";
import ProductForm from "@/components/ProductForm";

async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <ProductForm
      action={updateProduct.bind(null, product.id)}
      categories={categories}
      product={product}
    />
  );
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Edit product</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <EditProduct params={params} />
      </Suspense>
    </>
  );
}