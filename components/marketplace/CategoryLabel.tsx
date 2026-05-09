"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getMarketplaceCategoryName } from "@/ulity/getMarketplaceCategoryName";

interface CategoryLabelProps {
  type?: "seller" | "category" | "standard";
  label: string;
  className?: string;
}

export default function CategoryLabel({
  type = "standard",
  label,
  className,
}: CategoryLabelProps) {
  const categoryName = getMarketplaceCategoryName(label);

  return (
    <p className={cn("min-h-[1rem] text-xs font-medium text-blue-600", className)}>
      {categoryName}
    </p>
  );
}
