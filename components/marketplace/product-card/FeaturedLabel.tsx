"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type FeaturedLabelProps = {
  label?: string;
  className?: string;
};

export default function FeaturedLabel({
  label = "Featured",
  className,
}: FeaturedLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm sm:px-3 sm:py-1 sm:text-[11px]",
        className,
      )}
    >
      <Sparkles className="size-3" />
      {label}
    </span>
  );
}
