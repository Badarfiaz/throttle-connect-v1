"use client";

import React from "react";
import { PackageSearch, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  type?: "marketplace" | "networking";
  category?: string | null;
  onReset?: () => void;
};

/**
 * EmptyState — shown when a search returns zero results.
 */
export default function EmptyState({
  type = "marketplace",
  category,
  onReset,
}: EmptyStateProps) {
  const Icon = type === "networking" ? UsersRound : PackageSearch;
  const noun = type === "networking" ? "clubs" : "products";
  const label = category
    ? `No ${noun} found in "${category.replace(/-/g, " ")}"`
    : `No ${noun} found`;

  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
      <div className="w-16 h-16 mb-5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {label}
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
        Try browsing a different category or check back later as new listings are
        added regularly.
      </p>
      {onReset && (
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          className="mt-6 rounded-xl font-semibold"
        >
          Browse All {type === "networking" ? "Clubs" : "Products"}
        </Button>
      )}
    </div>
  );
}
