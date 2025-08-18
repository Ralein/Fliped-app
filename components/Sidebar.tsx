"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sparkles, Bookmark, FileText, Mic, Play, StickyNote, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/explore", label: "Explore", icon: Sparkles },
  { href: "/collections", label: "Saved Articles Collection", icon: Bookmark },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/podcast", label: "Podcast", icon: Mic },
  { href: "/videos", label: "Videos", icon: Play },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/collab", label: "Collab (Pro)", icon: Users },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold">Flipd</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="w-72 h-screen bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 sticky top-0">
      <SidebarContent />
    </div>
  )
}