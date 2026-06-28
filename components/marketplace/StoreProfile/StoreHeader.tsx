"use client";

import React from "react";
import {
  MapPin,
  Navigation,
  Clock,
  MoreVertical,
  ShieldCheck,
} from "lucide-react";
import ContactButton from "@/components/marketplace/ContactButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MarketplaceStore } from "@/types/marketplace";
import { getMarketplaceCategoryName } from "@/ulity/getMarketplaceCategoryName";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";

type StoreWithExtras = MarketplaceStore & {
  category?: string;
  workingDays?: string[];
  opensAt?: string;
  closesAt?: string;
};

export default function StoreHeader({ store }: { store: StoreWithExtras }) {
  const categoryLabel = getMarketplaceCategoryName(store.category);
  return (
    <div className="relative border-b border-slate-100 px-4 pb-5 md:px-6">
      <div className="absolute -top-10 left-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg ring-4 ring-white/80 md:left-6 md:h-24 md:w-24">
        {store.logoUrl ? (
          <img
            src={store.logoUrl}
            alt={store.title ?? "Store"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="text-2xl font-black text-blue-700">
              {store.title?.charAt(0) ?? "S"}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-5 pt-3 pl-24 md:pl-28 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold leading-tight text-slate-900 md:text-2xl">
              {store.title}
            </h1>
            {store.completed && (
              <Badge className="gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                <ShieldCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
            {store.featured && <FeaturedBadge featured={true} />}
          </div>

          {store.location && (
            <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
              <span className="truncate">
                {store.location.area}, {store.location.city},{" "}
                {store.location.province}
              </span>
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {store.businessType?.map((type) => (
              <Badge
                key={type}
                variant="outline"
                className="rounded-md border-slate-300 px-2.5 py-1 text-xs capitalize text-slate-600"
              >
                {type}
              </Badge>
            ))}
            {store.category && (
              <span className="text-sm font-semibold text-blue-600">
                {categoryLabel}
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-0 rounded-lg overflow-hidden w-65">
              <ContactButton
                phone={store.phone}
                email={store.email}
                preferredMethod={store.contactMethod as any}
                menuIcon
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 self-start">
          <Button
            variant="outline"
            className="w-full gap-2 rounded-lg border-blue-200 bg-blue-50/60 font-medium text-blue-700 shadow-sm hover:bg-blue-100"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </Button>

          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-100/80 px-4 py-2.5 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600">
                <Clock className="h-4 w-4" />
                Opens on
              </div>
            </div>
            <CardContent className="px-4 py-3">
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-slate-700">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => {
                    const isOpen = store.workingDays?.includes(day);
                    return (
                      <span
                        key={day}
                        className={`font-medium ${isOpen ? "text-slate-700" : "text-slate-300"}`}
                      >
                        {day}
                        {day != "Sun" ? " |" : ""}
                      </span>
                    );
                  },
                )}
              </div>
              {store.opensAt && store.closesAt && (
                <p className="mt-3 text-center text-xs text-slate-500">
                  {store.opensAt} - {store.closesAt}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
