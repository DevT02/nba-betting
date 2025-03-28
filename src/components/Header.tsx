"use client";
import React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "@/components/utils/DarkModeToggle";

export default function Header() {
  return (
    <header className="header">
      <div className="flex items-center gap-2">
        <Link href="/?tab=Today" className="text-6xl font-bold">
          Iverson
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        <button className="flex items-center justify-center p-2 hover:bg-opacity-80 rounded md:hidden">
          <Menu className="h-11 w-11" />
        </button>
      </div>
    </header>
  );
}
