"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/app/redux/hooks";
import {
  LayoutDashboard,
  User,
  Users,
  Calendar,
  Trophy,
  Image as ImageIcon,
  Package,
  PlusCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Store,
  Grid,
  Bell,
  Clock,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type DashboardNavItem = {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type DashboardContainerProps = {
  title: string;
  subtitle?: string;
  navItems: DashboardNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

// Map items to Lucide icons dynamically if none is provided
const getFallbackIcon = (id: string) => {
  switch (id) {
    case "overview":
      return LayoutDashboard;
    case "profile":
      return User;
    case "members":
      return Users;
    case "events":
      return Calendar;
    case "achievements":
      return Trophy;
    case "gallery":
      return ImageIcon;
    case "products":
      return Package;
    case "add-product":
      return PlusCircle;
    default:
      return Grid;
  }
};

// Map items to beautiful colors (matching the mobile layout screenshot)
const getTabColor = (id: string) => {
  switch (id) {
    case "overview":
      return "text-pink-500 bg-pink-500/10";
    case "profile":
      return "text-blue-500 bg-blue-500/10";
    case "members":
      return "text-sky-500 bg-sky-500/10";
    case "events":
      return "text-red-500 bg-red-500/10";
    case "achievements":
      return "text-amber-500 bg-amber-500/10";
    case "gallery":
      return "text-emerald-500 bg-emerald-500/10";
    case "products":
      return "text-indigo-500 bg-indigo-500/10";
    case "add-product":
      return "text-orange-500 bg-orange-500/10";
    default:
      return "text-[#19376D] bg-[#19376D]/10";
  }
};

export const DashboardContainer = ({
  title,
  subtitle,
  navItems,
  activeId,
  onNavigate,
  actions,
  children,
}: DashboardContainerProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  
  // Mobile view state: default to menu grid view
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync state if active tab is changed externally
  useEffect(() => {
    // If a tab is clicked or changed, we show the tab contents on mobile
    if (activeId !== "overview" && activeId !== "") {
      setShowMobileMenu(false);
    }
  }, [activeId]);

  const userName = user?.name || user?.email?.split("@")[0] || "Badr Fayyaz";
  const userEmail = user?.email || "";
  const avatarLetter = userName.charAt(0).toUpperCase();

  const handleSelectTab = (id: string) => {
    onNavigate(id);
    setShowMobileMenu(false);
  };

  return (
    <section className="min-h-screen bg-[#F3F4F6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ── MOBILE RESPONSIVE LAYOUT (based on Screenshot from 2026-06-21 23-52-52.png) ── */}
      <div className="block lg:hidden max-w-md mx-auto px-4 py-6 space-y-4">
        {showMobileMenu ? (
          /* Mobile Main Navigation Menu Hub */
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Top User Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-150 dark:border-slate-800 bg-[#19376D] text-white flex items-center justify-center font-bold text-lg">
                  {user?.profileData?.profileImage ? (
                    <img src={user.profileData.profileImage} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatarLetter}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{userName}</h3>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">View your profile</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Custom round status refresh badge */}
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-850 text-primary font-bold text-xs select-none">
                  {avatarLetter}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-850 cursor-pointer">
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Menu Cards Grid (2-column layout exactly like reference screenshot) */}
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon || getFallbackIcon(item.id);
                const colorClass = getTabColor(item.id);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className="flex flex-col items-start p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/50 dark:border-slate-850 hover:border-primary/30 transition-all text-left group cursor-pointer"
                  >
                    <div className={cn("p-2 rounded-xl mb-3 shrink-0", colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="mt-2 text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 border dark:border-slate-700 px-1.5 font-bold">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Settings & Privacy Collapsible row at the bottom */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/50 dark:border-slate-850 overflow-hidden">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-slate-550 dark:text-slate-400" />
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Settings & privacy</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", settingsOpen && "rotate-180")} />
              </button>
              
              {settingsOpen && (
                <div className="px-4 pb-4 pt-1 space-y-2 border-t dark:border-slate-800 animate-in fade-in duration-200 text-xs text-slate-500">
                  <p className="font-semibold cursor-pointer py-1.5 hover:text-primary transition" onClick={() => router.push("/list-your-business")}>Account Registration</p>
                  <p className="font-semibold cursor-pointer py-1.5 hover:text-primary transition" onClick={() => toast.success("Feature coming soon")}>Security Settings</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Mobile Active Tab Contents View */
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Back to menu bar */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xs border border-slate-200/50 dark:border-slate-850">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(true)}
                className="rounded-xl flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Button>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider px-3">
                {navItems.find(i => i.id === activeId)?.label}
              </span>
            </div>

            {/* Render tab contents */}
            <div className="bg-white/40 dark:bg-slate-900/10 rounded-2xl">
              {children}
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP LAYOUT (based on dashboard-layout-hierarchy.png) ── */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex overflow-hidden min-h-[640px]">
          
          {/* Desktop Left Sidebar Navigation */}
          <aside className="w-64 border-r border-slate-200/60 dark:border-slate-800 bg-[#FAFCFD] dark:bg-slate-900/20 p-5 shrink-0 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Logo / Title Area */}
              <div className="px-3 py-1">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/5">
                  Console Panel
                </span>
                <h2 className="mt-3.5 text-lg font-black text-slate-900 dark:text-white truncate">
                  {title}
                </h2>
              </div>

              {/* Vertical Tabs List matching the hierarchy screenshot */}
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = item.id === activeId;
                  const Icon = item.icon || getFallbackIcon(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all duration-150 text-left relative group overflow-hidden cursor-pointer",
                        isActive
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-transparent bg-transparent text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      {/* Left vertical border highlight */}
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md" />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-4.5 w-4.5", isActive ? "text-white" : "text-slate-450 dark:text-slate-500")} />
                        <span className="text-xs font-bold tracking-tight">
                          {item.label}
                        </span>
                      </div>
                      
                      {item.badge ? (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-450 border dark:border-slate-700",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5", isActive ? "text-white" : "text-slate-400")} />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar User profile footer */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                {user?.profileData?.profileImage ? (
                  <img src={user.profileData.profileImage} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{avatarLetter}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">{userName}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{userEmail}</p>
              </div>
            </div>
          </aside>

          {/* Desktop Right Main Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white/40 dark:bg-slate-900/10">
            {/* Topbar with Title & Actions */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 px-8 py-5">
              <div className="space-y-0.5">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {navItems.find(i => i.id === activeId)?.label || "Dashboard"}
                </h1>
                {subtitle && (
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-450">
                    {subtitle}
                  </p>
                )}
              </div>
              
              {/* Toolbar actions */}
              {actions && (
                <div className="flex items-center gap-3 shrink-0">
                  {actions}
                </div>
              )}
            </header>

            {/* Main Content Pane */}
            <main className="flex-1 p-8 overflow-y-auto max-h-[85vh]">
              <div className="animate-in fade-in duration-300">
                {children}
              </div>
            </main>
          </div>

        </div>
      </div>

    </section>
  );
};
export default DashboardContainer;
