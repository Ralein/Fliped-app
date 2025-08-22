"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The landing page is at the root path "/"
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    // For the landing page, we don't show the sidebar and topbar.
    // The landing page has its own full-screen layout.
    return <>{children}</>;
  }

  // For all other pages, show the standard app layout.
  return (
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
  );
}
