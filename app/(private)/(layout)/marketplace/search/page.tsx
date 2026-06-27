"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SearchPage from "@/components/search/SearchPage";

/**
 * /marketplace/search?category=oils-and-fluids
 *
 * Reads the `category` query param and delegates to the shared SearchPage.
 */
export default function MarketplaceSearchPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
console.log('search make marketplace')
  return <SearchPage type="marketplace" category={category} />;
}
