"use client"
import Link from "next/link"
import { Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArticleCardProps {
  thumbnailUrl: string
  title: string
  description: string
  readTime: string
  domain: string
  link: string
}

export default function ArticleCard({ thumbnailUrl, title, description, readTime, domain, link }: ArticleCardProps) {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden">
      <div className="flex">
        <div className="w-32 h-32 flex-shrink-0">
          <img src={thumbnailUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{domain}</span>
              </div>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href={link} target="_blank" rel="noopener noreferrer">
                Read more
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
