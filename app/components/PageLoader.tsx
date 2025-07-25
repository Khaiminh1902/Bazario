"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader, Package } from "lucide-react";

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart();

    const timer = setTimeout(() => {
      handleComplete();
    }, 500);

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f5e3d2] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4 mx-auto animate-pulse">
            <Package className="w-10 h-10 text-[#5c3b27]" />
          </div>
          <h1 className="text-3xl font-bold text-[#5c3b27] mb-2">Bazario</h1>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Loader className="w-6 h-6 text-[#5c3b27] animate-spin" />
          <p className="text-[#5c3b27] text-lg font-medium">Loading...</p>
        </div>

        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#5c3b27] rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-[#5c3b27] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#5c3b27] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
