"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Wrench,
  MapPin,
  Clock,
  Store,
  ShieldCheck,
  ChevronLeft,
  Star,
  Send,
  User,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMarketplaceServices } from "@/hooks/useMarketplaceServices";
import { MarketplaceService, SERVICE_TYPES } from "@/types/marketplace";
import SellerProfileCard from "./SellerProfileCard";

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
  size?: "xs" | "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => interactive && onRate?.(star)}
          className={`${sizeClasses[size]} ${
            interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""
          } ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-700"
          }`}
        />
      ))}
    </div>
  );
};

export default function ServiceDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const { fetchServiceById, addReview, submittingReview, loading } = useMarketplaceServices();

  const [service, setService] = useState<MarketplaceService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    let mounted = true;
    (async () => {
      try {
        const res = await fetchServiceById(serviceId);
        if (mounted) setService(res);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load service detail",
          );
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [serviceId, fetchServiceById]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    try {
      const newReview = await addReview({
        storeId: service?.storeId || "",
        serviceId: service?.id || "",
        rating,
        comment,
        reviewerName: reviewerName.trim() || undefined,
      });

      if (newReview) {
        setService((prev) => {
          if (!prev) return null;
          const reviews = [newReview, ...(prev.reviews ?? [])];
          const reviewCount = reviews.length;
          const averageRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
          return { ...prev, reviews, reviewCount, averageRating };
        });

        setRating(0);
        setComment("");
        setReviewerName("");
        setIsDialogOpen(false);
      }
    } catch {
      // Error handled in hook
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 dark:bg-slate-950">
        <p className="text-red-500 font-semibold">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  if (loading || !service) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-full h-[400px] rounded-3xl" />
            <Skeleton className="w-2/3 h-8 rounded-lg" />
            <Skeleton className="w-1/3 h-6 rounded-lg" />
            <Skeleton className="w-full h-36 rounded-3xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="w-full h-[250px] rounded-3xl" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const reviews = service.reviews ?? [];
  const avgRating = service.averageRating ?? 0;
  const reviewCount = service.reviewCount ?? reviews.length;

  const locationText = [
    service.store?.location?.area,
    service.store?.location?.city,
    service.store?.location?.province,
  ]
    .filter(Boolean)
    .join(", ");

  // Calculate rating distribution
  const starDistribution = [0, 0, 0, 0, 0]; // 1 to 5 stars
  reviews.forEach((r) => {
    const idx = Math.min(Math.max(r.rating - 1, 0), 4);
    starDistribution[idx]++;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
          Back to marketplace
        </button>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ── LEFT COLUMN (Image, Title, Info, Description, Reviews) ── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-800 p-3 sm:p-4 flex items-center justify-center relative min-h-[320px] md:min-h-[420px]">
              {service.imageUrl ? (
                <div className="relative w-full h-[280px] sm:h-[380px] md:h-[460px]">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    priority
                    className="object-cover rounded-2xl"
                  />
                </div>
              ) : (
                <div className="w-full h-96 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-2xl border border-dashed dark:border-slate-800">
                  <Wrench size={54} strokeWidth={1} />
                  <p className="mt-2 text-sm font-bold">No image available</p>
                </div>
              )}
            </div>

            {/* Title & Core Details Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 space-y-6">
              
              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15 rounded-md px-2.5 py-0.5"
                >
                  {getServiceTypeLabel(service.serviceType)}
                </Badge>

                <Badge
                  variant="secondary"
                  className={`text-xs font-extrabold uppercase tracking-wider border rounded-md px-2.5 py-0.5 ${
                    service.isAvailable
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/15"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/15"
                  }`}
                >
                  {service.isAvailable ? "Available" : "Currently Unavailable"}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {service.title}
              </h1>

              {/* Ratings Summary */}
              <div className="flex items-center gap-2">
                <StarRating rating={avgRating} size="sm" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {reviewCount > 0
                    ? `${avgRating.toFixed(1)} (${reviewCount} ${
                        reviewCount === 1 ? "review" : "reviews"
                      })`
                    : "No reviews yet"}
                </span>
              </div>

              {/* Price Display */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Price Estimate</p>
                  <div className="flex items-baseline gap-1">
                    {service.price != null ? (
                      <>
                        <span className="text-xs font-black text-slate-400 mr-0.5">PKR</span>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                          {service.price.toLocaleString()}
                        </span>
                        {service.priceUnit && service.priceUnit !== "fixed" && (
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
                            / {service.priceUnit.replace(/-/g, " ")}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-lg font-black text-slate-500 dark:text-slate-400 italic">
                        Price on Quote
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  {locationText && (
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border dark:border-slate-800">
                      <MapPin size={14} className="text-red-500" />
                      <span>{service.store?.location?.city || "Lahore"}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border dark:border-slate-800">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Verified Provider</span>
                  </div>
                </div>
              </div>

              <Separator className="dark:bg-slate-800" />

              {/* Service Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Service Overview</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold whitespace-pre-wrap">
                  {service.description ?? "No description has been provided for this service yet."}
                </p>
              </div>
            </div>

            {/* ── Reviews & Feedback Section ── */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 space-y-8">
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Customer Reviews</h2>
                </div>

                {/* Write a Review Modal Trigger */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-extrabold text-xs px-4 h-10 rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-current" />
                      Write a Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px] bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">Submit a Review</DialogTitle>
                      <DialogDescription className="text-xs text-slate-500 dark:text-slate-450">
                        Your feedback helps other riders find trusted service providers.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleReviewSubmit} className="space-y-5 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Select Rating</label>
                        <StarRating rating={rating} interactive onRate={setRating} size="md" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Your Name (Optional)</label>
                        <Input
                          type="text"
                          placeholder="e.g. Ali Khan"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-950 text-sm h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Your Review</label>
                        <Textarea
                          placeholder="Share details of your experience with this provider..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-950 text-sm min-h-[120px] rounded-xl"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="rounded-xl font-bold h-11 text-xs px-4 cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={rating === 0 || submittingReview}
                          className="bg-primary hover:bg-primary/90 text-white font-bold h-11 text-xs px-5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Send size={14} />
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Ratings Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-800/40 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-850">
                
                {/* Average Score */}
                <div className="flex flex-col items-center justify-center text-center space-y-2 md:border-r md:border-slate-200 dark:md:border-slate-800">
                  <span className="text-6xl font-black text-slate-900 dark:text-white leading-none">
                    {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
                  </span>
                  <StarRating rating={avgRating} size="md" />
                  <span className="text-xs font-bold text-slate-400">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>

                {/* Rating Distribution Bars */}
                <div className="md:col-span-2 flex flex-col justify-center space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = starDistribution[stars - 1];
                    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs font-bold">
                        <span className="w-3 text-right">{stars}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-slate-400">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-600">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30 stroke-1" />
                    <p className="text-sm font-bold">No reviews yet.</p>
                    <p className="text-xs text-slate-405 mt-1">Be the first to share your experience with this service!</p>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                    {reviews.map((review, idx) => (
                      <div key={review.id} className={`flex gap-4 items-start ${idx > 0 ? "pt-5" : ""}`}>
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>

                        {/* Review Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                {review.reviewerName || "Anonymous Rider"}
                              </h4>
                              <p className="text-[9px] font-semibold text-slate-400">
                                Verified Reviewer
                              </p>
                            </div>
                            <StarRating rating={review.rating} size="xs" />
                          </div>

                          {review.comment && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>

          {/* ── RIGHT COLUMN (Sticky Provider Details & Actions) ── */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <SellerProfileCard
              store={service.store}
              itemName={service.title}
              itemType="service"
              showMetadata={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
