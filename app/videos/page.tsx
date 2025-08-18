import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Play, Clock, User } from "lucide-react"
import { mockVideos } from "@/data/mock-data"

export default function VideosPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Videos</h1>
          <p className="text-muted-foreground">Your video library and playlists ({mockVideos.length} videos).</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search videos..." className="pl-10" />
        </div>
      </div>

      <div className="space-y-4">
        {mockVideos.map((video) => (
          <Card key={video.id} className="group overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex">
                <div className="w-32 h-24 flex-shrink-0 bg-muted border-r border-border flex items-center justify-center">
                  <Play className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between min-h-[96px]">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{video.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-20">{video.channel}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 px-3 text-xs bg-transparent">
                      {video.isWatched ? "Watched" : "Watch"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
