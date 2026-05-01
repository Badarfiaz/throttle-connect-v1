"use client";

import { Home, Store, Plus, HardHat, LayoutGrid, Network } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/app/redux/hooks";
import { fa } from "zod/v4/locales";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const isMarketplaceSeller = user?.marketplace?.completed;
  const isNetworkingCompleted = user?.networking?.completed;
  const addHref = isMarketplaceSeller
    ? "/marketplace/dashboard"
    : "/networking/dashboard";

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Marketplace",
      icon: Store,
      href: "/marketplace",
    },
    {
      label: "Add",
      icon: Plus,
      href: addHref,
      isSpecial: true,
    },
    {
      label: "Networking",
      icon: Network,
      href: "/networking",
    },
    {
      label: "More",
      icon: LayoutGrid,
      href: "/more",
    },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (item.label === "Add") {
      return isMarketplaceSeller || isNetworkingCompleted;
    }
    return true;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block md:hidden bg-white border-t border-gray-200 px-4 py-2 pb-safe">
      <div className="flex justify-between items-end h-16 relative">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;
          const isSpecial = item.isSpecial;

          if (isSpecial) {
            return (
              <div key={item.label} className="relative -top-5">
                <Link
                  href={item.href}
                  className="flex flex-col items-center justify-center w-14 h-14 bg-[#0F4C75] text-white rounded-2xl shadow-lg hover:bg-[#0B3A5B] transition-colors"
                >
                  <item.icon className="w-8 h-8" strokeWidth={1.5} />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 gap-1 pb-2 transition-colors",
                isActive
                  ? "text-[#0F4C75]"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
