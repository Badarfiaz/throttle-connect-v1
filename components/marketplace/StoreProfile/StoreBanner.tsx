"use client";

import React from "react";
import { Store } from "lucide-react";
import type { MarketplaceStore } from "@/types/marketplace";

export default function StoreBanner({ store }: { store: MarketplaceStore }) {
  return (
    <div className="relative h-52 overflow-hidden bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 md:h-64">
      {store?.bannerUrl ? (
        <img
          src={store.bannerUrl}
          alt={store.title ?? "Store banner"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_34%),linear-gradient(135deg,_#0f1f5b_0%,_#1e4b9b_45%,_#2f7de1_100%)]" />
          <div className="absolute -right-10 top-0 h-full w-1/2 skew-x-[-12deg] bg-blue-400/15" />
          <div className="absolute bottom-0 right-0 h-1/2 w-2/3 rounded-tl-[80px] bg-white/5" />
          <div className="relative flex h-full flex-col items-center justify-center gap-2 select-none">
            <Store className="h-14 w-14 text-white/20 md:h-16 md:w-16" />
            <span className="text-3xl font-black tracking-[0.25em] text-white/30 uppercase md:text-4xl">
              {store?.title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
