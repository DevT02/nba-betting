import Articles from "@/components/Articles";
import { articleData } from "@/components/ArticleData";

export default function ArticlesPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <Articles articles={articleData} />
    </div>
  );
}
