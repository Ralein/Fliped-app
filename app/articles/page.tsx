import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"
import { mockArticles } from "@/data/mock-data"
import { ArticleCard } from "@/components/article-card"

export default function ArticlesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Articles</h1>
          <p className="text-muted-foreground">
            Browse and manage your article library ({mockArticles.length} articles).
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search articles..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Technology", "Design", "AI", "Business"].map((category) => (
          <Button key={category} variant={category === "All" ? "default" : "outline"} size="sm">
            {category}
          </Button>
        ))}
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {mockArticles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </div>
    </div>
  )
}
