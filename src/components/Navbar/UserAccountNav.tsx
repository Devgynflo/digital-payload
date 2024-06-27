"use client";

import { NextPage } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { User } from "@/payload/payload.types";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface UserAccountNavProps {
  user: User;
}

export const UserAccountNav: NextPage<UserAccountNavProps> = ({ user }) => {
  const { signOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-hidden">
        <Button variant={"ghost"} size={"sm"} className="relative">
          Mon compte
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="text-sm font-medium text-black">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />
        {user && user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"}>Tableau de bord</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
