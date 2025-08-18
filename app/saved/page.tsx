import ArticleCard from "@/components/ArticleCard"
import { articles as savedArticles } from "@/data/articles"

export default function SavedPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Articles</h1>
        <p className="text-gray-600 dark:text-gray-400">Your bookmarked articles for later reading.</p>
      </div>

      <div className="space-y-4">
        {savedArticles.map((article) => (
          <ArticleCard
            key={article.link}
            thumbnailUrl={article.thumbnailUrl}
            title={article.title}
            description={article.description}
            readTime={article.readTime}
            domain={article.domain}
            link={article.link}
          />
        ))}
      </div>
    </div>
  )
}
