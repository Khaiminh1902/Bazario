"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl border border-gray-200 bg-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome
          </CardTitle>
          <CardDescription className="text-gray-500">
            Login with your GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-4">
            <LoadingButton
              onClick={() => {
                setIsLoading(true);
                void signIn("github", {
                  redirectTo: "/",
                });
              }}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 transition-all duration-200 rounded-lg py-2 font-medium"
              isLoading={isLoading}
            >
              <Github className="w-5 h-5" />
              Login with GitHub
            </LoadingButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
