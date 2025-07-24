"use client";

import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, DollarSign } from "lucide-react";
import { useConvexAuth } from "convex/react";
import UserDetails from "./user-details"; // Client-friendly version expected

const navItems = [
  { icon: <ShoppingCart size={24} />, label: "Buy", href: "/" },
  { icon: <DollarSign size={24} />, label: "Sell", href: "/sell" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <aside className="fixed inset-y-0 left-0 w-20 bg-[var(--kindly-medium)] p-4 flex flex-col justify-between items-center py-6 shadow-md">
      {/* Top nav items */}
      <div className="flex flex-col gap-6">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              aria-label={item.label}
              onClick={() => router.push(item.href)}
              className={`cursor-pointer flex items-center justify-center w-12 h-12 rounded-xl transition
                ${
                  isActive
                    ? "bg-[var(--kindly-dark)] text-white"
                    : "text-[var(--kindly-dark)] hover:bg-[var(--kindly-light)]"
                }`}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
      {!isLoading && isAuthenticated && <UserDetails />}
    </aside>
  );
}
