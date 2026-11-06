import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/session";

const bodySchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().min(1) }))
    .min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in to check out" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.data.items.map((i) => i.productId) } },
  });

  // Build the order from DATABASE prices, never from what the browser sent
  const lines = [];
  for (const item of parsed.data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: "A product no longer exists" }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
    }
    lines.push({ product, quantity: item.quantity });
  }

  const totalCents = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      totalCents,
      items: {
        create: lines.map((l) => ({
          productId: l.product.id,
          quantity: l.quantity,
          priceCents: l.product.priceCents,
        })),
      },
    },
  });

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lines.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: "usd",
        unit_amount: l.product.priceCents,
        product_data: { name: l.product.name },
      },
    })),
    metadata: { orderId: order.id },
    success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/cart`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkout.id },
  });

  return NextResponse.json({ url: checkout.url });
}