import React from "react";

export default function GameDetailsLoading() {
  return (
    <div
      className="min-h-screen animate-pulse"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="h-16 w-full bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
        <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 md:p-12 bg-gray-300 dark:bg-gray-700">
          <div className="h-10 w-3/4 bg-gray-400 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-48 w-full bg-gray-400 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-400 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-400 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
