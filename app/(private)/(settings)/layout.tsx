import React from "react"
import { SettingsSidebar } from "@/components/shared/Settings-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* Wrapper for sidebar and main content */}
      <div className="flex relative z-0">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white z-40 shadow-lg mt-[70px]">
          <SettingsSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          <h1>yahan pe settings ka component lagana apna</h1>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Layout
