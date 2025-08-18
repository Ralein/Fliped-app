import type React from "react"
import "./globals.css"
import { Bricolage_Grotesque } from "next/font/google"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import { ThemeProvider } from "@/components/theme-provider"

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Flipd - Content Management & Discovery",
  description: "A powerful content management & discovery platform",

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bricolage.variable}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              <main className="flex-1 overflow-auto">
                <div className="p-6">{children}</div>
              </main>
            </div>

            {/* Mobile Sidebar (rendered separately) */}
            <div className="md:hidden">
              <Sidebar />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
