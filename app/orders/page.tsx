import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function OrderList() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId, status: { not: "PENDING" } },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <p>
        No orders yet. <Link href="/" className="underline">Start shopping</Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span>
              Order #{order.id.slice(-8)} · {order.createdAt.toLocaleDateString("en-US")}
            </span>
            <span className="rounded-full border px-3 py-0.5">{order.status}</span>
          </div>
          <ul className="mb-2 text-sm text-gray-700">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.product.name}
              </li>
            ))}
          </ul>
          <p className="font-bold">Total: ${(order.totalCents / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">My orders</h1>
      <Suspense fallback={<p>Loading orders...</p>}>
        <OrderList />
      </Suspense>
    </main>
  );
}