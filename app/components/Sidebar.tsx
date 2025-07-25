"use client";

import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, DollarSign, MessageCircle } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import UserDetails from "./user-details";

const navItems = [
  { icon: <ShoppingCart size={24} />, label: "Buy", href: "/" },
  { icon: <DollarSign size={24} />, label: "Sell", href: "/sell" },
  { icon: <MessageCircle size={24} />, label: "Message", href: "/message" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const unreadCount = useQuery(api.messages.getUnreadMessageCount);
  
  // Debug logging - remove this later
  console.log('Sidebar unreadCount:', unreadCount);

  return (
    <aside className="fixed inset-y-0 left-0 w-20 bg-[var(--kindly-medium)] p-4 flex flex-col justify-between items-center py-6 shadow-md">
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
              className={`cursor-pointer relative flex items-center justify-center w-12 h-12 rounded-xl transition
                ${
                  isActive
                    ? "bg-[var(--kindly-dark)] text-white"
                    : "text-[var(--kindly-dark)] hover:bg-[var(--kindly-light)]"
                }`}
            >
              {item.icon}
              {item.href === "/message" && typeof unreadCount === 'number' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!isLoading && isAuthenticated && <UserDetails />}
    </aside>
  );
}
