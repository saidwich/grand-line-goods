import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";
import ClearCart from "@/components/ClearCart";

type SearchParams = Promise<{ session_id?: string }>;

async function Result({ searchParams }: { searchParams: SearchParams }) {
  const { session_id } = await searchParams;
  const user = await getSession();
  if (!user) redirect("/login");
  if (!session_id) notFound();

  const checkout = await stripe.checkout.sessions.retrieve(session_id);
  const orderId = checkout.metadata?.orderId;
  const order = orderId
    ? await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
    : null;

  if (!order || order.userId !== user.userId) notFound();

  if (checkout.payment_status !== "paid") {
    return (
      <>
        <h1 className="mb-2 text-3xl font-bold">Payment not completed</h1>
        <Link href="/cart" className="underline">Back to cart</Link>
      </>
    );
  }

  // Mark as paid and reduce stock, only once
  await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id: order.id, status: "PENDING" },
      data: { status: "PAID" },
    });
    if (updated.count === 1) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  });

  return (
    <>
      <ClearCart />
      <h1 className="mb-2 text-3xl font-bold">Thank you! 🏴‍☠️</h1>
      <p className="mb-1">Your order was placed successfully.</p>
      <p className="mb-6 text-sm text-gray-500">Order #{order.id.slice(-8)}</p>
      <div className="flex gap-4">
        <Link href="/orders" className="underline">View my orders</Link>
        <Link href="/" className="underline">Keep shopping</Link>
      </div>
    </>
  );
}

export default function SuccessPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Suspense fallback={<p>Confirming your payment...</p>}>
        <Result searchParams={searchParams} />
      </Suspense>
    </main>
  );
}