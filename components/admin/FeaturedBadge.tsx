import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedBadgeProps {
  featured: boolean;
  className?: string;
}

export function FeaturedBadge({ featured, className }: FeaturedBadgeProps) {
  if (!featured) return null;
  return (
    <Badge
      className={cn(
        "bg-amber-100 text-amber-700 border border-amber-300 gap-1 font-semibold",
        className,
      )}
    >
      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
      Featured
    </Badge>
  );
}
