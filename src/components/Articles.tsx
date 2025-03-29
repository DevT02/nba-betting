import React from "react";
import Header from "./Header";
import Link from "next/link";

export interface Article {
  title: string;
  image: string;
  description: string;
  url: string;
}

type ArticlesProps = {
  articles: Article[];
};

const Articles: React.FC<ArticlesProps> = ({ articles }) => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <Header />
      <main className="mx-auto px-6 sm:px-8 lg:px-12 mt-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}>
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="mb-4">{article.description}</p>
                <Link href={`/articles/${article.url}`} className="text-blue-500 hover:underline">
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Articles;
