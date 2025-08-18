import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Folder, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Flipd</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          A powerful content management & discovery platform. Organize your articles, discover new content, and
          collaborate with your team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/explore">Explore Content</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Folder className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Organize</h3>
            <p className="text-sm text-muted-foreground">
              Create collections to organize your articles, videos, and notes in one place.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Discover</h3>
            <p className="text-sm text-muted-foreground">
              Find new content tailored to your interests with our smart discovery engine.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Collaborate</h3>
            <p className="text-sm text-muted-foreground">
              Share collections and collaborate with your team on research projects.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
