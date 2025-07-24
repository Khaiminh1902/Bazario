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
      variant="destructive"
      size="sm"
      onClick={async () => {
        setIsLoading(true);
        await signOut();
        router.push("/auth/sign-in"); // 🚀 Redirect after sign out
      }}
      isLoading={isLoading}
      className={cn("w-full text-left px-2 py-1.5", className)}
    >
      Sign out
    </LoadingButton>
  );
}
