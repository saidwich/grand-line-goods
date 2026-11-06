import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import { Suspense } from "react";
import UserNav from "@/components/UserNav";

export const metadata: Metadata = {
  title: "Grand Line Goods",
  description: "A fan-made pirate merch store (portfolio project)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header>
            <Suspense fallback={null}>
              <UserNav />
            </Suspense>
          </Header>
          {children}
          <footer className="mt-12 border-t p-6 text-center text-xs text-gray-500">
            Fan project for portfolio purposes. Not for sale and not affiliated with any official brand.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}