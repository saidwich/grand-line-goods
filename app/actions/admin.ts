"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export type FormState = { error?: string } | undefined;

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be at least 0.01"),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  image: z.string().min(1, "Image path is required"),
  crew: z.string().optional(),
  categoryId: z.string().min(1, "Pick a category"),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  let slug = slugify(d.name);
  if (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  await prisma.product.create({
    data: {
      name: d.name,
      slug,
      description: d.description,
      priceCents: Math.round(d.price * 100),
      stock: d.stock,
      image: d.image,
      crew: d.crew?.trim() ? d.crew.trim() : null,
      categoryId: d.categoryId,
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  await prisma.product.update({
    where: { id },
    data: {
      name: d.name,
      description: d.description,
      priceCents: Math.round(d.price * 100),
      stock: d.stock,
      image: d.image,
      crew: d.crew?.trim() ? d.crew.trim() : null,
      categoryId: d.categoryId,
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  // Products that appear in past orders can't be deleted (it would break order history).
  // For those, we set stock to 0 instead so they show as "Out of stock".
  const used = await prisma.orderItem.count({ where: { productId: id } });
  if (used > 0) {
    await prisma.product.update({ where: { id }, data: { stock: 0 } });
  } else {
    await prisma.product.delete({ where: { id } });
  }

  revalidatePath("/", "layout");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status"));
  if (!["PENDING", "PAID", "SHIPPED"].includes(status)) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as "PENDING" | "PAID" | "SHIPPED" },
  });

  revalidatePath("/admin/orders");
}