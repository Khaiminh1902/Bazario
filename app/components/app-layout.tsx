"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/auth/sign-in" || pathname === "/auth/login";

  return (
    <>
      {!hideSidebar && <Sidebar />}
      {children}
    </>
  );
}
