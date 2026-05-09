"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketplaceStore } from "@/types/marketplace";

type StoreWithExtras = MarketplaceStore & {
  workingDays?: string[];
  opensAt?: string;
  closesAt?: string;
};

export default function OverviewCard({ store }: { store: StoreWithExtras }) {
  const [expanded, setExpanded] = useState(false);
  const lines = store.overview?.split("\n") || [];
  const preview = lines.slice(0, 3).join("\n");
  const hasMore = lines.length > 3;

  const renderText = (text: string) =>
    text.split("\n").map((line, index) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p
          key={index}
          className={
            line === "" ? "mt-2" : "text-sm leading-relaxed text-slate-600"
          }
        >
          {parts.map((part, partIndex) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={partIndex} className="font-semibold text-slate-800">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            ),
          )}
        </p>
      );
    });

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="px-5 pb-2 pt-4">
        <CardTitle className="text-base font-bold text-slate-800">
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-5 pb-4">
        <div>{renderText(expanded ? store.overview || "" : preview)}</div>
        {hasMore && (
          <button
            className="mt-1 flex items-center gap-1 self-start text-sm font-medium text-blue-600 hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </CardContent>
    </Card>
  );
}
