"use client"
import Link from "next/link"

interface CollectionCardProps {
  id: string
  title: string
  description: string
  coverImage?: string
  itemCount?: number
}

export default function CollectionCard({ id, title, description, coverImage, itemCount = 0 }: CollectionCardProps) {
  return (
    <Link href={`/collections/${id}`}>
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden cursor-pointer">
        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
          {coverImage ? (
            <img src={coverImage || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-400 dark:text-gray-600">{title.charAt(0)}</div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{description}</p>
          <div className="text-xs text-gray-500 dark:text-gray-400">{itemCount} items</div>
        </div>
      </div>
    </Link>
  )
}
