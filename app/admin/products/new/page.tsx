import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { createProduct } from "@/app/actions/admin";
import ProductForm from "@/components/ProductForm";

async function NewProduct() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <ProductForm action={createProduct} categories={categories} />;
}

export default function NewProductPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Add product</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <NewProduct />
      </Suspense>
    </>
  );
}