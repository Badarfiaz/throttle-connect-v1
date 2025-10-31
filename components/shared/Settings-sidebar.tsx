"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Settings } from "lucide-react"
import clsx from "clsx"

export function SettingsSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar className="w-64 border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          {/* 🔹 Updated heading with proper font and spacing */}
          <SidebarGroupLabel className="text-base font-medium text-[#0B2447] mb-4 mt-6">
            Activity
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {links.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={href}
                      className={clsx(
                        "flex items-center px-3 py-2 rounded-md transition-colors duration-200",
                        pathname === href
                          ? "bg-[#19376D] text-white"
                          : "text-[#0B2447] hover:bg-[#EAF0F8] hover:text-[#19376D]"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
