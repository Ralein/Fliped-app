"use client"

import { useEffect, useState } from "react"
import { Search, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"

export default function Topbar() {
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-6 md:py-4 min-h-[64px]">
      <div className={`flex items-center gap-4 flex-1 ${isMobile ? "ml-10" : ""}`}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles, collections..."
            className="pl-10 bg-muted/50 border-input focus:bg-background"
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        {mounted && theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : mounted ? (
          <Moon className="h-4 w-4" />
        ) : (
          <div className="h-4 w-4" /> 
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  )
}