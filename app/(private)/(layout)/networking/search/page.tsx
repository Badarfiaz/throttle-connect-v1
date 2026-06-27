"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SearchPage from "@/components/search/SearchPage";

/**
 * /networking/search?category=touring-clubs
 *
 * Reads the `category` query param and delegates to the shared SearchPage.
 */
export default function NetworkingSearchPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return <SearchPage type="networking" category={category} />;
}
