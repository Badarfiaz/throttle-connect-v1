"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchPage from "@/components/search/SearchPage";

/**
 * /marketplace/search?category=oils-and-fluids
 *
 * Reads the `category` query param and delegates to the shared SearchPage.
 */
function SearchPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  console.log('search make marketplace');
  return <SearchPage type="marketplace" category={category} />;
}

export default function MarketplaceSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-slate-500">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
