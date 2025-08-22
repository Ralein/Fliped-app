import type React from "react"
import "./globals.css"
import { Bricolage_Grotesque } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import AppLayout from "@/components/AppLayout"

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
