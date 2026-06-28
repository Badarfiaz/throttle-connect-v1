"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { Menu, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";
import { auth } from "@/firebase";
import { toast } from "sonner";
import Link from "next/link";

interface AdminTopNavProps {
  breadcrumb?: string;
}

export function AdminTopNav({ breadcrumb }: AdminTopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector((s: RootState) => s.auth.user, shallowEqual);

  const avatarLetter = user?.email?.trim().charAt(0).toUpperCase() ?? "A";

  const handleLogout = () => {
    auth.signOut();
    toast.success("Logged out");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-white dark:bg-slate-950 px-4 shadow-sm">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/admin" className="hover:text-slate-900 transition-colors font-medium">
              Admin
            </Link>
            {breadcrumb && (
              <>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-semibold">{breadcrumb}</span>
              </>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Avatar className="h-8 w-8 border border-[#19376D]/30">
                  <AvatarFallback className="bg-[#19376D] text-white text-sm font-semibold">
                    {avatarLetter}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-normal text-slate-500">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Back to App</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
