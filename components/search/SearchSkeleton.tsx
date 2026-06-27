"use client";

import React from "react";
import { HorizontalProductCardSkeleton } from "@/components/shared/HorizontalProductCard";

type SearchSkeletonProps = {
  count?: number;
};

/**
 * SearchSkeleton — renders N horizontal card skeletons while data is loading.
 */
export default function SearchSkeleton({ count = 6 }: SearchSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <HorizontalProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
