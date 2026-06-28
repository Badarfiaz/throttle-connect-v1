"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchPage from "@/components/search/SearchPage";

/**
 * /networking/search?category=touring-clubs
 *
 * Reads the `category` query param and delegates to the shared SearchPage.
 */
function SearchPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return <SearchPage type="networking" category={category} />;
}

export default function NetworkingSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center dark:bg-slate-955 text-slate-500">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
