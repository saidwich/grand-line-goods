import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { logout } from "@/app/actions/auth";

export default async function UserNav() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link href="/login" className="underline">Log in</Link>
        <Link href="/signup" className="underline">Sign up</Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  });

  return (
    <div className="flex items-center gap-3 text-sm">
      <span>Hi, {user?.name ?? user?.email}</span>
        <Link href="/orders" className="underline">Orders</Link>
        {session.role === "ADMIN" && (
            <Link href="/admin" className="underline">Admin</Link>
        )}
      <form action={logout}>
        <button className="underline">Log out</button>
      </form>
    </div>
  );
}