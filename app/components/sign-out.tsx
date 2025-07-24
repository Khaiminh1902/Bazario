"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SignOutProps {
  className?: string;
}

export function SignOut({ className }: SignOutProps) {
  const { signOut } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <LoadingButton
      size="sm"
      onClick={async () => {
        setIsLoading(true);
        await signOut();
        router.push("/auth/sign-in");
      }}
      isLoading={isLoading}
      className={cn(
        "w-full text-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        "bg-[#5c3b27] text-white hover:bg-[#4b2f20]",
        className
      )}
    >
      Sign out
    </LoadingButton>
  );
}
