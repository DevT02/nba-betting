import React from "react";

export default function GameDetailsLoading() {
  return (
    <div
      className="min-h-screen flex flex-col animate-pulse"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      {/*Header*/}
      <div className="w-full border-b p-5 px-8 shadow-md">
        <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/*main card*/}
      <div
        className="rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 md:p-12 flex flex-col justify-between mx-auto my-6 min-h-[550px] w-full max-w-6xl"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}
      >
        {/*logos and matchup */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            {/* left logo */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
            {/* matchup text */}
            <div className="hidden sm:block">
              <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
            {/* (mirrored) right logo */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>
        </div>

        {/*game info: time & arena */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/*H2H Section */}
        <div className="py-3 mb-6">
          <div className="flex justify-center gap-6">
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/*Prediction Banner */}
        <div className="flex flex-col items-center gap-4 border border-yellow-200 dark:border-yellow-900/50 p-4 rounded-xl bg-gradient-to-b from-yellow-50/40 to-transparent dark:from-yellow-900/20 shadow-sm mb-6">
          <div className="flex items-center gap-2">
            {/*Trophy icon placeholder */}
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
            {/*Prediction text placeholder */}
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          {/* Progress Bar sim */}
          <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full"
              style={{ width: "60%" }}
            />
          </div>
        </div>

        {/* Odds Table/Tabs Section */}
        <div>
          {/* Tabs header */}
          <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mb-4" />
          {/* Table rows */}
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

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <div className="w-32 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          <div className="w-32 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
