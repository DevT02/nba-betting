"use client";
import React from "react";
import Link from "next/link";
import { DarkModeToggle } from "@/components/utils/DarkModeToggle";

export default function Header() {
  return (
    <header
      className="w-full border-b p-5 px-8 shadow-md flex items-center justify-between font-nfl bg-[#C8102E] text-white dark:bg-neutral-900 dark:text-white"
      style={{ letterSpacing: "0.25em" }}
    >
      <div className="flex items-center gap-2">
        <Link href="/?tab=Today" className="text-6xl font-bold">
          Iverson
        </Link>
      </div>
      <DarkModeToggle />
    </header>
  );
}
