"use client"

import { Clock, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ArticleCardProps {
  id: string
  thumbnailUrl: string
  title: string
  description: string
  readTime: string
  domain: string
  link: string
  category?: string
  isRead?: boolean
  isSaved?: boolean
}

export function ArticleCard({
  id,
  thumbnailUrl,
  title,
  description,
  readTime,
  domain,
  link,
  category,
  isRead = false,
  isSaved = false,
}: ArticleCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md bg-card border-border">
      <CardContent className="p-0">
        <div className="flex">
          {/* Thumbnail */}
          <div className="w-32 h-24 flex-shrink-0 bg-muted border-r border-border flex items-center justify-center">
            <div className="text-xs text-muted-foreground">Image</div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between min-h-[96px]">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3
                  className={`font-semibold text-sm leading-tight line-clamp-2 flex-1 ${isRead ? "text-muted-foreground" : ""}`}
                >
                  {title}
                </h3>
                <Button variant="ghost" size="sm" className="ml-2 p-1 h-auto">
                  {isSaved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
              {category && <span className="inline-block mt-2 px-2 py-1 bg-muted rounded-md text-xs">{category}</span>}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-3 pt-2">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate max-w-20">{domain}</span>
                </div>
              </div>

              <Button asChild size="sm" variant="outline" className="h-7 px-3 text-xs bg-transparent">
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  {isRead ? "Read again" : "Read more"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
