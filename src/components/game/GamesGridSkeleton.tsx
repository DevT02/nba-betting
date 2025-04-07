import React from "react";

export default function GamesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="w-full rounded-lg p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-zinc-800 flex flex-col animate-pulse"
          style={{
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
          }}
        >
          <div className="h-5 w-40 bg-gray-400 dark:bg-gray-600 rounded mb-2" />
          <div className="flex items-center gap-2 mb-4">
            <div className="w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full" />
            <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full" />
            <div className="h-8 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
          </div>
          <div className="mt-5 pt-4 border-t border-gray-300 dark:border-gray-700 flex justify-between">
            <div className="h-4 w-24 bg-gray-400 dark:bg-gray-600 rounded" />
            <div className="h-4 w-16 bg-gray-400 dark:bg-gray-600 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
