"use client";
import React from "react";
import Link from "next/link";
import { articleData } from "@/components/ArticleData";

type InfoBannerProps = {
  headerHeight?: number;
};

const InfoBanner: React.FC<InfoBannerProps> = ({ headerHeight = 80 }) => {
  return (
    <div className="bg-card p-4 border border-border rounded-lg shadow-md">
      <h2 className="text-2xl font-extrabold mb-5 text-primary">
        Helpful Articles & Info
      </h2>
      <ul className="space-y-6">
        {articleData.map((article) => (
          <li
            key={article.url}
            className="p-4 rounded-xl border border-border/60 bg-gradient-to-br 
                       from-background via-card to-background shadow-sm 
                       dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900
                       dark:border-zinc-700/60 hover:shadow-lg transition-all duration-300"
          >
            <Link
              href={`/articles/${article.url}`}
              className="group block"
            >
              <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {article.title}
              </span>
              <p className="text-sm mt-2 text-muted-foreground">
                {article.description || "Learn more by clicking this article."}
              </p>
              <span className="mt-2 inline-block text-primary text-sm font-medium group-hover:underline transition-all">
                Read more →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-3 text-foreground">
          Quick Tips
        </h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Understand your odds before placing bets.</li>
          <li>Check injury reports for key players.</li>
          <li>Explore our guides for advanced strategies.</li>
        </ul>
      </div>
    </div>
  );
};

export default InfoBanner;
