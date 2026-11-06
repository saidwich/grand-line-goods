import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { deleteProduct } from "@/app/actions/admin";

async function ProductTable() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="py-2">{p.name}</td>
            <td>{p.category.name}</td>
            <td>${(p.priceCents / 100).toFixed(2)}</td>
            <td>{p.stock}</td>
            <td className="flex gap-3 py-2">
              <Link href={`/admin/products/${p.id}/edit`} className="underline">Edit</Link>
              <form action={deleteProduct.bind(null, p.id)}>
                <button className="text-red-600 underline">Delete</button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminPage() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="rounded bg-black px-4 py-2 text-sm text-white">
          + Add product
        </Link>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductTable />
      </Suspense>
    </>
  );
}