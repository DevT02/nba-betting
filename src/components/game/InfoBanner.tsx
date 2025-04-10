"use client";
import React from "react";
import Link from "next/link";
import { articleData } from "@/components/ArticleData";

type InfoBannerProps = {
  headerHeight?: number;
};

const InfoBanner: React.FC<InfoBannerProps> = ({
  headerHeight = 80,
}) => {
  return (
    <div
      className="bg-card p-4 border rounded-lg shadow-sm overflow-auto"
    >
      <h2 className="text-2xl font-extrabold mb-5 text-primary">
        Helpful Articles & Info
      </h2>
      <ul className="space-y-6">
        {articleData.map((article) => (
          <li
            key={article.url}
            className="p-4 rounded-lg shadow-md border border-border/50 
                   bg-gradient-to-r from-background via-card/90 to-background 
                   dark:from-zinc-900 dark:via-zinc-800/90 dark:to-zinc-900
                   dark:border-zinc-700/60 dark:shadow-zinc-900/30
                   hover:shadow-lg hover:border-border/70 hover:bg-gradient-to-r 
                   hover:from-background hover:via-card hover:to-background
                   dark:hover:from-zinc-900 dark:hover:via-zinc-800 dark:hover:to-zinc-900
                   dark:hover:border-zinc-600 dark:hover:shadow-zinc-800/40
                   transition-all duration-300"
          >
            <Link
              href={`/articles/${article.url}`}
              className="block text-xl font-semibold text-gray-800 dark:text-gray-100 hover:text-primary transition-colors"
            >
              {article.title}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {article.description || "Learn more by clicking this article."}
            </p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">
          Quick Tips
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>Understand your odds before placing bets.</li>
          <li>Check injury reports for key players.</li>
          <li>Explore our guides for advanced strategies.</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoBanner;
