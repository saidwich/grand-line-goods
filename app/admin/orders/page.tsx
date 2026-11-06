import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { updateOrderStatus } from "@/app/actions/admin";

async function OrderTable() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-lg border p-4 text-sm">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span>
              #{o.id.slice(-8)} · {o.user.email} · {o.createdAt.toLocaleDateString("en-US")}
            </span>
            <form action={updateOrderStatus} className="flex gap-2">
              <input type="hidden" name="orderId" value={o.id} />
              <select name="status" defaultValue={o.status} className="rounded border p-1">
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
              </select>
              <button className="rounded border px-3 py-1">Update</button>
            </form>
          </div>
          <ul className="mb-2 text-gray-700">
            {o.items.map((i) => (
              <li key={i.id}>
                {i.quantity} × {i.product.name}
              </li>
            ))}
          </ul>
          <p className="font-bold">Total: ${(o.totalCents / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <OrderTable />
      </Suspense>
    </>
  );
}