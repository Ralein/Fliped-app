import { Button } from "@/components/ui/button"

export default function CollabPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Collab (Pro)</h1>
        <p className="text-muted-foreground">Collaborate with your team on collections and projects.</p>
      </div>

      <div className="text-center py-16">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold mb-2">Pro Feature</h3>
        <p className="text-muted-foreground mb-6">Collaboration features are available with a Pro subscription.</p>
        <Button>Upgrade to Pro</Button>
      </div>
    </div>
  )
}
