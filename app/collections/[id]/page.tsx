import { collections } from "@/data/collections"
import { articles } from "@/data/articles"
import ArticleCard from "@/components/ArticleCard"

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const collection = collections.find((c) => c.id === params.id)

  if (!collection) {
    return <div>Collection not found</div>
  }

  // Mock some articles for this collection
  const collectionArticles = articles.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{collection.description}</p>
        <div className="text-sm text-gray-500 dark:text-gray-400">{collectionArticles.length} items in this collection</div>
      </div>

      <div className="space-y-4">
        {collectionArticles.map((article) => (
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
