"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOut } from "./sign-out";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserDetails() {
  const user = useQuery(api.users.currentUser);

  if (!user) {
    return (
      <Avatar className="h-9 w-9 border border-gray-300 cursor-pointer">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
        <Avatar className="h-9 w-9 border border-gray-300 hover:shadow-md transition">
          <AvatarImage src={user.image} alt={user.name ?? "User"} />
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl shadow-xl border bg-white p-1"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-semibold leading-none truncate text-foreground">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
