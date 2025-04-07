import React from "react";

export default function GameDetailsLoading() {
  return (
    <div
      className="min-h-screen animate-pulse flex flex-col"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <div className="p-5 border-b shadow-md">
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="flex-1 max-w-6xl mx-auto p-4 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center justify-center gap-4">
            {/* left */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 dark:bg-gray-700 rounded-full" />
            {/* vs */}
            <div className="h-8 w-12 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center" />
            {/* right */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>
          {/* title */}
          <div className="w-full md:w-1/2">
            <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
            <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* game info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* table */}
        <div className="mt-6">
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
