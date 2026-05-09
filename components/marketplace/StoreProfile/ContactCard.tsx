"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MarketplaceStore } from "@/types/marketplace";

type StoreWithExtras = MarketplaceStore & {
  location?: { area?: string; city?: string; province?: string } | null;
};

export default function ContactCard({ store }: { store: StoreWithExtras }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="px-5 pb-2 pt-4">
        <CardTitle className="text-base font-bold text-slate-800">
          Contact Details
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-5 pb-4">
        {store.phone && (
          <a
            href={`tel:${store.phone}`}
            className="group flex items-center gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-slate-700 transition-colors group-hover:text-blue-600">
              {store.phone}
            </span>
          </a>
        )}
        {store.phone && store.email && <Separator className="bg-slate-100" />}
        {store.email && (
          <a
            href={`mailto:${store.email}`}
            className="group flex items-center gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <span className="truncate text-sm text-slate-700 transition-colors group-hover:text-blue-600">
              {store.email}
            </span>
          </a>
        )}
        {store.address && (
          <>
            <Separator className="bg-slate-100" />
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-700">{store.address}</p>
                {store.location && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {store.location.city}, {store.location.province}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
