"use client";

import React from "react";
import Image from "next/image";
import CardLinkWrapper from "../shared/CardLinkWapper";
import {
  Star,
  Wrench,
  MapPin,
  User,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MarketplaceService, SERVICE_TYPES } from "@/types/marketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";
import FavoriteButton from "../shared/FavoriteButton";

type ServiceCardSkeletonProps = {
  size?: "sm" | "md" | "lg";
  isLandingPage?: boolean;
  className?: string;
};

export function ServiceCardSkeleton({
  size = "md",
  isLandingPage = false,
  className,
}: ServiceCardSkeletonProps) {
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
        "relative overflow-hidden mb-2.5 flex flex-col h-[350px]",
        "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl",
        "shadow-sm",
        isLandingPage ? "w-full" : sizeStyles[size],
        className,
      )}
    >
      {/* Image skeleton */}
      <Skeleton className={cn("w-full rounded-t-2xl shrink-0", imageHeightStyles[size])} />

      {/* Content skeleton */}
      <div className="px-4 py-3.5 flex flex-col flex-1 justify-between">
        <div className="space-y-2.5">
          {/* Title */}
          <Skeleton className="h-4.5 w-5/6 rounded" />

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-3 w-3 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-3 w-16 rounded" />
          </div>

          {/* Price */}
          <Skeleton className="h-5 w-24 rounded" />

          {/* Description */}
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
          </div>
        </div>

        {/* Bottom section (Location & Store Info) */}
        <div className="space-y-2 mt-2">
          {/* Location */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full shrink-0" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>

          {/* Store footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Skeleton className="w-5 h-5 rounded-full shrink-0" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-3.5 w-14 rounded shrink-0" />
          </div>
        </div>
      </div>
    </Card>
  );
}

const getServiceTypeLabel = (value: string) =>
  SERVICE_TYPES.find((t) => t.value === value)?.label ?? value;

const StarRating = ({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "xs";
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={cn(
          size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5",
          star <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800",
        )}
      />
    ))}
  </div>
);

type ServiceCardProps = {
  service?: MarketplaceService;
  size?: "sm" | "md" | "lg";
  isLandingPage?: boolean;
  loading?: boolean;
};

export default function ServiceCard({
  service,
  size = "md",
  isLandingPage = false,
  loading = false,
}: ServiceCardProps) {
  if (loading || !service) {
    return <ServiceCardSkeleton size={size} isLandingPage={isLandingPage} />;
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

  const reviews = service.reviews ?? [];
  const avgRating = service.averageRating ?? 0;
  const reviewCount = service.reviewCount ?? reviews.length;

  const locationText = [
    service.store?.location?.area,
    service.store?.location?.city,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <CardLinkWrapper link={`/marketplace/service/${service.id}`}>
      <TooltipProvider>
        <Card
          className={cn(
            "relative overflow-hidden cursor-pointer mb-2.5 flex flex-col h-[350px]",
            "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl",
            "shadow-sm hover:shadow-xl hover:border-slate-300/80 dark:hover:border-slate-700",
            "transition-all duration-300 ease-out hover:-translate-y-1",
            isLandingPage ? "w-full" : sizeStyles[size],
          )}
        >
          {/* ── Image ── */}
          <div
            className={cn(
              "relative w-full overflow-hidden bg-slate-50 dark:bg-slate-950 shrink-0",
              imageHeightStyles[size],
            )}
          >
            {service.imageUrl ? (
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-950 text-slate-300 dark:text-slate-700">
                <Wrench className="h-10 w-10 stroke-1" />
              </div>
            )}

            {/* Service type badge overlay */}
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-slate-900/80 dark:bg-slate-900/90 text-white border border-white/10 backdrop-blur-xs text-[9px] uppercase tracking-wider font-bold rounded-md px-2 py-0.5">
                {getServiceTypeLabel(service.serviceType)}
              </Badge>
            </div>

            {/* Heart / Favourite */}
            <div className="absolute top-3 right-3 z-10">
              <FavoriteButton
                itemId={service.id}
                itemType="service"
                itemData={{
                  title: service.title,
                  image: service.imageUrl ?? undefined,
                  details: service.price ? `PKR ${service.price.toLocaleString()}` : "Price on quote",
                  link: `/marketplace/service/${service.id}`,
                }}
              />
            </div>

            {/* Available / Unavailable pill */}
            {!service.isAvailable && (
              <div className="absolute top-14 right-3 z-10">
                <Badge className="bg-rose-600/90 text-white border-0 text-[9px] font-bold px-2 py-0.5 rounded-md">
                  Unavailable
                </Badge>
              </div>
            )}
          </div>

          {/* ── Content ── */}
          <div className="px-4 py-3.5 flex flex-col flex-1 justify-between">
            <div className="space-y-1.5">
              {/* Service title */}
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-primary transition-colors flex-1">
                  {service.title}
                </h3>
                {service.featured && <FeaturedBadge featured={true} />}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <StarRating rating={avgRating} size="xs" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {reviewCount > 0
                    ? `${avgRating.toFixed(1)} (${reviewCount})`
                    : "No reviews yet"}
                </span>
              </div>

              {/* Price */}
              <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {service.price != null ? (
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 mr-0.5">PKR</span>
                    <span className="text-sm font-black">{service.price.toLocaleString()}</span>
                    {service.priceUnit && service.priceUnit !== "fixed" && (
                      <span className="font-normal text-slate-400 ml-1 text-[10px]">
                        · {service.priceUnit.replace(/-/g, " ")}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="italic text-slate-400 font-normal text-[11px]">
                    Price on quote
                  </span>
                )}
              </div>

              {/* Description */}
              {service.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              )}
            </div>

            {/* Bottom section (Location & Store Info) */}
            <div className="space-y-2 mt-2">
              {/* Location */}
              {locationText && (
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                    {locationText}
                  </span>
                </div>
              )}

              {/* ── Store footer — logo + title ── */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {service.store?.logoUrl ? (
                    <img
                      src={service.store.logoUrl}
                      alt={service.store.title ?? "Store"}
                      className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                  <span className="text-[10px] text-slate-700 dark:text-slate-400 font-extrabold truncate">
                    {service.store?.title ?? "Service Provider"}
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className="h-4 p-0 px-1 border-0 text-emerald-500 font-semibold bg-emerald-500/5 text-[8px] flex items-center gap-0.5 uppercase shrink-0"
                >
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </TooltipProvider>
    </CardLinkWrapper>
  );
}
