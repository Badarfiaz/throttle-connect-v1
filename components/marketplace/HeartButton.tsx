"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  onFavoriteChange?: (isFavorite: boolean) => void;
  initialFavorite?: boolean;
  className?: string;
}

export default function HeartButton({
  onFavoriteChange,
  initialFavorite = false,
  className,
}: HeartButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteChange?.(newState);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleClick}
          size="icon"
          variant="ghost"
          className={cn(
            "rounded-full h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white",
            isFavorite && "text-red-500",
            className
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={18}
            className={cn(isFavorite && "fill-red-500")}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </TooltipContent>
    </Tooltip>
  );
}
