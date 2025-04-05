import React from "react";

export default function HomeSkeleton() {
  return (
    <div
      className="min-h-screen animate-pulse"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <header
        className="w-full border-b p-5 px-8 shadow-md flex items-center justify-between font-nfl"
        style={{
          backgroundColor: "hsl(var(--card))",
          letterSpacing: "0.25em",
        }}
      >
        <div className="h-12 w-48 bg-gray-400 dark:bg-gray-600 rounded" />
        <div className="h-8 w-8 bg-gray-400 dark:bg-gray-600 rounded-full" />
      </header>

      <div className="pt-4 flex items-center justify-center gap-6 px-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-6 w-24 bg-gray-400 dark:bg-gray-600 rounded"
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-lg p-4 sm:p-5 shadow-sm border dark:border-gray-800 flex flex-col"
              style={{
                backgroundColor: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 bg-gray-400 dark:bg-gray-600 rounded" />
                <div className="h-6 w-40 bg-gray-400 dark:bg-gray-600 rounded" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full" />
                <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full" />
                <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
              </div>
              <div className="mt-5 pt-4 border-t border-gray-300 dark:border-gray-700 flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
                <div className="h-4 w-16 bg-gray-400 dark:bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
