"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

type HeartIconButtonProps = {
  active?: boolean;
  onToggle?: () => void;
  className?: string;
};

export default function HeartIconButton({
  active = false,
  onToggle,
  className,
}: HeartIconButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle?.();
      }}
      className={cn(
        "h-11 w-11 rounded-full border-white/40 bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-rose-500",
        active && "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100",
        className,
      )}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "size-3.5 transition-all duration-300 sm:size-4",
          active ? "fill-current" : "",
        )}
      />
    </Button>
  );
}
