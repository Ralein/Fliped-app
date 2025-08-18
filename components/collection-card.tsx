"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Folder, Calendar } from "lucide-react"

interface CollectionCardProps {
  id: string
  title: string
  description: string
  itemCount: number
  coverImage?: string
  lastUpdated?: string
}

export function CollectionCard({ id, title, description, itemCount, coverImage, lastUpdated }: CollectionCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md bg-card border-border cursor-pointer">
      <CardContent className="p-0">
        <div className="h-32 bg-muted border-b border-border flex items-center justify-center">
          <Folder className="w-8 h-8 text-muted-foreground" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-1">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{itemCount} items</span>
            {lastUpdated && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(lastUpdated).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
