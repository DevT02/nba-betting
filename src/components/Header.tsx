"use client";
import React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "@/components/utils/DarkModeToggle";

export default function Header() {
  return (
    <header
      className="w-full border-b p-5 px-8 text-white shadow-md flex items-center justify-between bg-[#C8102E] font-nfl"
      style={{ letterSpacing: "0.25em" }}
    >
    <div className="flex items-center gap-2">
        <Link href="/?tab=Today" className="text-6xl font-bold">
          Iverson
        </Link>
    </div>
    <button className="flex items-center justify-center p-2 hover:bg-opacity-80 rounded">
      {/* <Menu className="h-11 w-11" /> */}
      <DarkModeToggle />
    </button>
  </header>

    
  );
}
