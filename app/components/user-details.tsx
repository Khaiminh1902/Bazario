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
      <Avatar className="h-9 w-9 border cursor-pointer">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
        <Avatar className="h-9 w-9 border">
          <AvatarImage src={user.image} />
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl shadow-md bg-background border"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1 px-2.5 py-2">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-semibold leading-none truncate">
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
