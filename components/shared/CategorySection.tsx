import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MarketplaceStoreCard } from "@/types/marketplace";
import { allowedPageType } from "@/types/CommonType";
import { slugToTitle } from "@/ulity/slugToTitle";
import { Skeleton } from "@/components/ui/skeleton";

type CategorySectionSkeletonProps = {
  className?: string;
};

export const CategorySectionSkeleton: React.FC<
  CategorySectionSkeletonProps
> = ({ className }) => {
  return (
    <Card
      className={cn(
        "w-[185px] h-[234px] p-3 flex flex-col items-start justify-start gap-3",
        "bg-[#F5F9FB] border border-[#0C679233] rounded-[6px]",
        "shadow-[0_2px_6px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      {/* Logo skeleton */}
      <Skeleton className="w-20 h-20 rounded-xl shrink-0" />

      {/* Content skeleton */}
      <div className="flex flex-col justify-between flex-1 w-full min-h-0">
        <div className="flex flex-col gap-2 w-full">
          {/* Store name */}
          <Skeleton className="h-4 w-3/4 rounded" />

          {/* Badge */}
          <Skeleton className="h-5 w-16 rounded" />

          {/* Categories */}
          <div className="space-y-1 mt-1">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 w-full">
          <Skeleton className="h-3 w-3 rounded-full shrink-0" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
    </Card>
  );
};

type CategorySectionProps = {
  items?: MarketplaceStoreCard;
  pageType?: allowedPageType;
  loading?: boolean;
};

export default function CategorySection({
  items,
  pageType,
  loading = false,
}: CategorySectionProps) {
  if (loading || !items) {
    return <CategorySectionSkeleton />;
  }
  const link =
    pageType === "marketplace"
      ? `/marketplace/storeProfile/${items?.slugUrl}`
      : `/networking/Club-list/${items?.slugUrl}`;

  const badge = "Distributor";

  const allCategories = items?.businessType || [];
  const categoriesText =
    allCategories.length > 0 ? allCategories.slice(0, 3).join(" | ") : null;
  const categoriesName = slugToTitle(categoriesText || "unknown");
  console.log("categoriesName => ", categoriesName);
  const locationText = [items?.location?.area, items?.location?.city]
    .filter(Boolean)
    .join(", ");

  return (
    <Link href={link} className="inline-block">
      <Card
        className={cn(
          // dimensions & layout
          "w-[170px] h-[234px] p-3 flex flex-col items-start justify-start gap-3",
          // colours & border
          "bg-[#F5F9FB] border border-[#0C679233] rounded-[6px]",
          // shadow
          "shadow-[0_2px_6px_rgba(0,0,0,0.08)]",
          // hover
          "transition-all duration-200 ease-out cursor-pointer",
          "hover:shadow-[0_6px_18px_rgba(12,103,146,0.15)] hover:-translate-y-0.5",
        )}
      >
        {/* ── Logo ── */}
        <div className="w-20 h-20 rounded-xl flex-shrink-0 shadow-[0_4px_10px_rgba(12,104,146,0.18)]">
          <div className="relative w-20 h-20 rounded-xl bg-white overflow-hidden">
            <Image
              src={items?.logoUrl || "/images/placeholder.webp"}
              alt={items?.title || "Store logo"}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col justify-between flex-1 w-full min-h-0">
          <div className="flex flex-col gap-1.5">
            {/* Store name */}
            <h3 className="text-sm font-semibold text-[#031A25] leading-[22px] truncate">
              {items?.title || "Unknown Store"}
            </h3>

            {/* Badge */}
            {badge && (
              <Badge
                variant="secondary"
                className={cn(
                  "self-start h-auto px-3 py-1 rounded border-0",
                  "bg-[#D8E7ED] text-[#0C6792] hover:bg-[#D8E7ED]",
                  "text-[11px] font-medium leading-[14px]",
                )}
              >
                {badge}
              </Badge>
            )}

            {/* Categories */}
            {categoriesName && (
              <p className="text-[11px] font-normal text-[#0C6792] leading-[18px] line-clamp-2 break-words">
                {categoriesName}
              </p>
            )}
          </div>

          {/* Location */}
          {locationText && (
            <div className="flex items-center gap-1 w-full">
              <MapPin
                size={14}
                className="text-[#0C6792] shrink-0"
                fill="currentColor"
                stroke="none"
              />
              <span className="text-[11px] font-medium text-[#68767C] truncate">
                {locationText}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
