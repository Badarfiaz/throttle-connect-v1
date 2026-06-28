"use client";

import React, { memo } from "react";
import Image from "next/image";
import { MapPin, ShieldCheck, Star, User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HorizontalProductCardProps = {
  id: string;
  title: string;
  image?: string | null;
  category?: string | null;
  description?: string | null;
  /** Numeric price — rendered as "PKR X,XXX" when provided */
  price?: number | null;
  /** Free-form metadata row (e.g. "Lahore · 3 members") */
  metadata?: string | null;
  /** 0–5 star rating */
  rating?: number | null;
  /** Seller / club name */
  sellerName?: string | null;
  sellerLogo?: string | null;
  sellerVerified?: boolean;
  ctaLabel?: string;
  onClick?: () => void;
  className?: string;
  /** Skeleton loading state */
  loading?: boolean;
};

// ---------------------------------------------------------------------------
// Category badge colours — reuse across both modules
// ---------------------------------------------------------------------------

const categoryBadgeColour = (category: string) => {
  const map: Record<string, string> = {
    accessories: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "spare-parts": "bg-orange-500/10 text-orange-600 border-orange-500/20",
    "riding-gear": "bg-violet-500/10 text-violet-700 border-violet-500/20",
    "performance-parts": "bg-red-500/10 text-red-600 border-red-500/20",
    electronics: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
    "oils-and-fluids": "bg-amber-500/10 text-amber-700 border-amber-500/20",
    "tires-and-wheels": "bg-slate-500/10 text-slate-600 border-slate-500/20",
    "tools-and-garage": "bg-stone-500/10 text-stone-700 border-stone-500/20",
    customization: "bg-pink-500/10 text-pink-700 border-pink-500/20",
    lighting: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    // Networking categories
    sedans: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    bikes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    offroad: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    superbikes: "bg-green-500/10 text-green-600 border-green-500/20",
    "sports-car": "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };
  return map[category] ?? "bg-slate-100 text-slate-600 border-slate-200";
};

// ---------------------------------------------------------------------------
// Skeleton version
// ---------------------------------------------------------------------------

export const HorizontalProductCardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={cn(
      "flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900",
      className,
    )}
  >
    {/* Image skeleton */}
    <Skeleton className="w-full sm:w-44 h-36 rounded-xl shrink-0" />

    {/* Content skeleton */}
    <div className="flex-grow flex flex-col gap-3 py-1">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/4 rounded-full" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
      <div className="flex items-center justify-between mt-auto">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  id,
  title,
  image,
  category,
  description,
  price,
  metadata,
  rating,
  sellerName,
  sellerLogo,
  sellerVerified,
  ctaLabel = "View Details",
  onClick,
  className,
  loading = false,
}) => {
  if (loading) return <HorizontalProductCardSkeleton className={className} />;

  const formattedPrice =
    price !== null && price !== undefined
      ? `PKR ${price.toLocaleString()}`
      : null;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`View ${title}`}
      id={`product-card-${id}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl",
        "border border-slate-200/60 dark:border-slate-800",
        "bg-white dark:bg-slate-900",
        "shadow-sm hover:shadow-lg",
        "transition-all duration-200 ease-out hover:-translate-y-0.5",
        "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        className,
      )}
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full sm:w-44 h-36 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <User className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-grow flex flex-col justify-between min-w-0 py-0.5">
        {/* Top: title + category */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 flex-1">
              {title}
            </h3>

            {/* Rating */}
            {rating !== null && rating !== undefined && (
              <div className="flex items-center gap-1 text-amber-500 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Category badge */}
          {category && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md capitalize border",
                categoryBadgeColour(category),
              )}
            >
              {category.replace(/-/g, " ")}
            </Badge>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Metadata row */}
          {metadata && (
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="text-[11px] font-medium truncate">{metadata}</span>
            </div>
          )}
        </div>

        {/* Bottom: seller + price + CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Seller info */}
          {sellerName && (
            <div className="flex items-center gap-2 min-w-0">
              {sellerLogo ? (
                <img
                  src={sellerLogo}
                  alt={sellerName}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                {sellerName}
              </span>
              {sellerVerified && (
                <Badge
                  variant="outline"
                  className="h-4 px-1 border-0 text-emerald-500 font-semibold bg-emerald-500/5 text-[8px] flex items-center gap-0.5 uppercase shrink-0"
                >
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified
                </Badge>
              )}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center gap-3 ml-auto">
            {formattedPrice && (
              <span className="text-sm font-extrabold text-primary">
                {formattedPrice}
              </span>
            )}
            <Button
              size="sm"
              id={`cta-${id}`}
              aria-label={`${ctaLabel} — ${title}`}
              className="rounded-xl font-semibold flex items-center gap-1 shadow-xs hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              {ctaLabel} <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(HorizontalProductCard);
