import React from "react";
import Link from "next/link";

export interface Article {
  title: string;
  image: string;
  description: string;
  url: string;
}

type ArticlesProps = {
  articles: Article[];
  useHeader?: boolean;
};

const Articles: React.FC<ArticlesProps> = ({ articles, useHeader = true }) => {
  return (
    <div className="min-h-0 bg-card text-foreground mb-6">
      {useHeader && (
        <header>
          {/* idk if we do add a header lmao */}
        </header>
      )}
      <main className="mx-auto px-6 sm:px-8 lg:px-12 mt-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div
              key={article.url}
              className="p-4 rounded-xl border border-border/60 bg-gradient-to-br 
                         from-background via-card to-background shadow-sm 
                         dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 
                         dark:border-zinc-700/60 hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/articles/${article.url}`} className="group block">
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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Articles;
