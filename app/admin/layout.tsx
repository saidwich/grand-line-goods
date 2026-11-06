import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <nav className="mb-6 flex gap-4 border-b pb-3 text-sm">
        <span className="font-bold">Admin</span>
        <Link href="/admin" className="underline">Products</Link>
        <Link href="/admin/orders" className="underline">Orders</Link>
      </nav>
      {children}
    </main>
  );
}