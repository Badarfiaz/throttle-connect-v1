"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  Wrench,
  MapPin,
  User,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MarketplaceService, SERVICE_TYPES } from "@/types/marketplace";
import { useMarketplaceServices } from "@/hooks/useMarketplaceServices";

const getServiceTypeLabel = (value: string) =>
  SERVICE_TYPES.find((t) => t.value === value)?.label ?? value;

const StarRating = ({
  rating,
  interactive = false,
  onRate,
  size = "sm",
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (n: number) => void;
  size?: "sm" | "xs";
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        onClick={() => interactive && onRate?.(star)}
        className={cn(
          size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5",
          interactive && "cursor-pointer hover:scale-110 transition-transform",
          star <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700",
        )}
      />
    ))}
  </div>
);

const ReviewForm = ({
  storeId,
  serviceId,
  onSubmitted,
}: {
  storeId: string;
  serviceId: string;
  onSubmitted: () => void;
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { addReview, submittingReview } = useMarketplaceServices();

  const handleSubmit = async () => {
    if (rating === 0) return;
    try {
      await addReview({ storeId, serviceId, rating, comment });
      setRating(0);
      setComment("");
      onSubmitted();
    } catch {
      // toasted in hook
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
      <p className="mb-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
        Leave a Review
      </p>
      <StarRating rating={rating} interactive onRate={setRating} />
      <Textarea
        className="mt-2 text-xs min-h-[56px]"
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        size="sm"
        className="mt-2 h-7 text-xs"
        disabled={rating === 0 || submittingReview}
        onClick={handleSubmit}
      >
        <Send className="mr-1 h-3 w-3" />
        {submittingReview ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

type ServiceCardProps = {
  service: MarketplaceService;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

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
    <Card
      className={cn(
        "relative overflow-hidden w-full",
        "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl",
        "shadow-sm hover:shadow-lg",
        "transition-all duration-200 ease-out hover:-translate-y-0.5",
        "flex flex-col",
      )}
    >
      {/* ── Image ── */}
      <div className="relative h-[160px] w-full overflow-hidden bg-slate-50 dark:bg-slate-950 shrink-0">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-350 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Wrench className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Service type badge overlay */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <Badge className="bg-slate-900/80 dark:bg-slate-900/90 text-white border border-white/10 backdrop-blur-xs text-[9px] uppercase tracking-wider font-bold rounded px-1.5 py-0.5">
            {getServiceTypeLabel(service.serviceType)}
          </Badge>
        </div>

        {/* Available / Unavailable pill */}
        {!service.isAvailable && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge className="bg-rose-600/90 text-white border-0 text-[9px] font-bold px-1.5 py-0.5">
              Unavailable
            </Badge>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-3.5 py-3 flex flex-col gap-2 flex-1">
        {/* Service title */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
          {service.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={avgRating} size="xs" />
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {reviewCount > 0
              ? `${avgRating.toFixed(1)} (${reviewCount})`
              : "No reviews yet"}
          </span>
        </div>

        {/* Price */}
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {service.price != null ? (
            <>
              PKR {service.price.toLocaleString()}
              {service.priceUnit && service.priceUnit !== "fixed" && (
                <span className="font-normal text-slate-400 ml-1 text-[10px]">
                  · {service.priceUnit.replace(/-/g, " ")}
                </span>
              )}
            </>
          ) : (
            <span className="italic text-slate-400 font-normal text-[11px]">
              Price on quote
            </span>
          )}
        </div>

        {/* Location */}
        {locationText && (
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {locationText}
            </span>
          </div>
        )}

        {/* Description */}
        {service.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        )}

        {/* ── Store footer — logo + title (same as ProductCard) ── */}
        <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
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
            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold truncate">
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

        {/* ── Contact button ── */}
        {service.store?.phone && (
          <a href={`tel:${service.store.phone}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8 mt-1"
            >
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              Contact Provider
            </Button>
          </a>
        )}

        {/* ── Reviews accordion ── */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
          <button
            className="flex w-full items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            onClick={() => setExpanded((v) => !v)}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">
              {reviewCount > 0
                ? `Reviews (${reviewCount})`
                : "Be the first to review"}
            </span>
            {expanded ? (
              <ChevronUp className="h-3 w-3 shrink-0" />
            ) : (
              <ChevronDown className="h-3 w-3 shrink-0" />
            )}
          </button>

          {expanded && (
            <div className="mt-2 space-y-2">
              {reviews.slice(0, 4).map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {review.reviewerName ?? "Anonymous"}
                    </span>
                    <StarRating rating={review.rating} size="xs" />
                  </div>
                  {review.comment && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}

              {!showReviewForm ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7"
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </Button>
              ) : (
                <ReviewForm
                  storeId={service.storeId}
                  serviceId={service.id}
                  onSubmitted={() => setShowReviewForm(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
