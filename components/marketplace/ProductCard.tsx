"use client";

import React from "react";
import Image from "next/image";
import CardLinkWrapper from "../shared/CardLinkWapper";
import { MarketplaceProduct } from "@/types/marketplace";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MapPin, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import PriceLabel from "./PriceLabel";
import CategoryLabel from "./CategoryLabel";
import FavoriteButton from "../shared/FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";
import { useTrackClick } from "@/hooks/analytics/useTrackClick";

type ProductCardSkeletonProps = {
  size?: "sm" | "md" | "lg";
  isLandingPage?: boolean;
  className?: string;
};
// ... [rest of skeleton omitted for brevity, let's target the exact lines] ...

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  size = "md",
  isLandingPage = false,
  className,
}) => {
  const sizeStyles = {
    sm: "w-[200px]",
    md: "w-[252px]",
    lg: "w-[320px]",
  };

  const imageHeightStyles = {
    sm: "h-[130px]",
    md: "h-[160px]",
    lg: "h-[200px]",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden mb-2.5",
        "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl",
        "shadow-sm",
        isLandingPage ? "w-full" : sizeStyles[size],
        className,
      )}
    >
      {/* Image skeleton */}
      <Skeleton className={cn("w-full rounded-t-xl", imageHeightStyles[size])} />

      {/* Content skeleton */}
      <div className="px-3.5 py-3 flex flex-col gap-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4 rounded" />

        {/* Price & Stock */}
        <div className="flex items-center justify-between mt-1">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>

        {/* Category */}
        <div className="flex items-center mt-1">
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1">
          <Skeleton className="h-3 w-3 rounded-full shrink-0" />
          <Skeleton className="h-3 w-2/3 rounded" />
        </div>

        {/* Seller Info Footer */}
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Skeleton className="w-5 h-5 rounded-full shrink-0" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <Skeleton className="h-3.5 w-14 rounded shrink-0" />
        </div>
      </div>
    </Card>
  );
};

type ProductCardProps = {
  product?: MarketplaceProduct;
  size?: "sm" | "md" | "lg";
  isLandingPage?: boolean;
  loading?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, size = "md", isLandingPage = false, loading = false }) => {
  const { trackClick } = useTrackClick("productAnalytics", product?.id ?? "");

  if (loading || !product) {
    return <ProductCardSkeleton size={size} isLandingPage={isLandingPage} />;
  }

  const sizeStyles = {
    sm: "w-[200px]",
    md: "w-[252px]",
    lg: "w-[320px]",
  };

  const imageHeightStyles = {
    sm: "h-[130px]",
    md: "h-[160px]",
    lg: "h-[200px]",
  };

  const locationText =
    [product.owner?.location?.area, product.owner?.location?.city]
      .filter(Boolean)
      .join(", ") || "Lahore";

  const conditionLabel = (product as any).condition || "New";

  return (
    <CardLinkWrapper link={`/marketplace/product/${product.id}`}>
      <TooltipProvider>
        <Card
          onClick={() => trackClick()}
          className={cn(
            "relative overflow-hidden cursor-pointer mb-2.5",
            "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl",
            "shadow-sm hover:shadow-lg",
            "transition-all duration-200 ease-out hover:-translate-y-0.5",
            isLandingPage ? "w-full" : sizeStyles[size],
          )}
        >
          {/* ── Image ── */}
          <div
            className={cn(
              "relative w-full overflow-hidden bg-slate-50 dark:bg-slate-950",
              imageHeightStyles[size],
            )}
          >
            <Image
              src={product.imageurl?.url || "/images/logos/segalmotors.jpg"}
              alt={product.productName}
              fill
              className="object-contain p-2 rounded-t-xl transition-transform duration-350 hover:scale-102"
            />

            {/* Heart / Favourite */}
            <div className="absolute top-2.5 right-2.5 z-10">
              <FavoriteButton
                itemId={product.id}
                itemType="product"
                itemData={{
                  title: product.productName,
                  image: product.imageurl?.url,
                  details: `PKR ${product.price?.toLocaleString()}`,
                  link: `/marketplace/product/${product.id}`,
                }}
              />
            </div>

            {/* Condition Badge overlay on image */}
            <div className="absolute top-2.5 left-2.5 z-10">
              <Badge className="bg-slate-900/80 dark:bg-slate-900/90 text-white border border-white/10 backdrop-blur-xs text-[9px] uppercase tracking-wider font-bold rounded px-1.5 py-0.5">
                {conditionLabel}
              </Badge>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="px-3.5 py-3 flex flex-col gap-2">
            {/* Title row */}
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 flex-1">
                {product.productName || "Product Title"}
              </h3>
              {product.featured && <FeaturedBadge featured={true} />}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <PriceLabel price={product.price} />
              {product.stock <= 3 && product.stock > 0 && (
                <span className="text-[9px] text-red-500 font-bold bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded">
                  Only {product.stock} left
                </span>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center justify-between mt-1">
              <CategoryLabel type="category" label={product.category ?? ""} />
            </div>

            {/* Location */}
            {locationText && (
              <div className="flex items-center gap-1">
                <MapPin
                  size={13}
                  className="text-slate-400 shrink-0"
                />
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {locationText}
                </span>
              </div>
            )}

            {/* Seller Info Footer inside card */}
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {product.owner?.logoUrl ? (
                  <img
                    src={product.owner.logoUrl}
                    alt={product.owner.title}
                    className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    <User className="w-3 h-3 text-slate-400" />
                  </div>
                )}
                <span className="text-[10px] text-slate-550 dark:text-slate-400 font-bold truncate">
                  {product.owner?.title || "Independent Seller"}
                </span>
              </div>

              {product.owner?.completed && (
                <Badge variant="outline" className="h-4 p-0 px-1 border-0 text-emerald-500 font-semibold bg-emerald-500/5 text-[8px] flex items-center gap-0.5 uppercase shrink-0">
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </TooltipProvider>
    </CardLinkWrapper>
  );
};

export default ProductCard;
