import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { mockCollections } from "@/data/mock-data"
import { CollectionCard } from "@/components/collection-card"

export default function CollectionsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Collections</h1>
          <p className="text-muted-foreground">
            Organize your content into curated collections ({mockCollections.length} collections).
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCollections.map((collection) => (
          <CollectionCard key={collection.id} {...collection} />
        ))}
      </div>
    </div>
  )
}
