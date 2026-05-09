"use client";

import { cn } from "@/lib/utils";

type CategoryLabelProps = {
  label?: string | null;
  className?: string;
};

export default function CategoryLabel({
  label,
  className,
}: CategoryLabelProps) {
  if (!label) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center text-[12px] font-semibold tracking-tight text-[#0D6FA8] transition-colors hover:text-[#0B5E90] sm:text-[13px]",
        className,
      )}
    >
      {label}
    </span>
  );
}
