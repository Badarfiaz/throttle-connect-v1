"use client";

import React, { useEffect, useState } from "react";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { useLeads } from "@/hooks/useLeads";
import { useAppSelector } from "@/app/redux/hooks";
import { MarketplaceProduct } from "@/types/marketplace";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import CategoryProductsSection from "../CategoryProductsSection";
import Link from "next/link";

import { Package, Tag, MapPin, Clock, Store, Layers, ChevronLeft, ShieldCheck, Mail, Phone, ShoppingCart, Heart } from "lucide-react";
import ContactButton from "../ContactButton";
import SellerProfileCard from "../SellerProfileCard";

const ProductDetailContainer = () => {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id as string;

  const { fetchProductById, loading } = useMarketplaceProducts();
  const { recordLead } = useLeads();
  const { user } = useAppSelector((s) => s.auth);

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!productId) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetchProductById(productId);
        if (mounted) setProduct(res);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load product",
          );
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [productId, fetchProductById]);

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

  if (loading || !product) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="w-full h-96 rounded-2xl" />
            <Skeleton className="w-2/3 h-8 rounded" />
            <Skeleton className="w-1/3 h-6 rounded" />
            <Skeleton className="w-full h-32 rounded" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-44 rounded-2xl" />
            <Skeleton className="w-full h-12 rounded" />
            <Skeleton className="w-full h-12 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const isInStock = product.stock && product.stock > 0;
  const conditionLabel = (product as any).condition || "New";

  return (
    <div className="bg-slate-50 dark:bg-slate-955 min-h-screen text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          Back to listings
        </button>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT COLUMN (image + details) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-4 flex items-center justify-center relative">
              {product.imageurl?.url ? (
                <img
                  src={product.imageurl.url}
                  alt={product.productName}
                  className="w-full max-h-[480px] object-contain rounded-2xl"
                />
              ) : (
                <div className="w-full h-96 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-2xl border border-dashed dark:border-slate-800">
                  <Package size={48} strokeWidth={1.2} />
                  <p className="mt-2 text-sm">No image available</p>
                </div>
              )}

              {/* Wishlist Button inside detail page */}
              <button 
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist");
                }}
                className={`absolute top-6 right-6 p-3 rounded-full border shadow-sm transition-all cursor-pointer ${
                  isWishlisted 
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                    : "bg-white dark:bg-slate-950 text-slate-400 hover:text-rose-500 border-slate-200 dark:border-slate-850"
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Title + Price Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-6 sm:p-8">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                >
                  <Tag size={12} />
                  {product.category ?? "Uncategorized"}
                </Badge>
                
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-650 dark:text-purple-400 border-purple-500/20"
                >
                  {conditionLabel}
                </Badge>

                <Badge
                  variant="secondary"
                  className={`text-xs font-bold uppercase tracking-wider border ${isInStock
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20"
                    }`}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
                {product.productName}
              </h1>

              {/* Location + time row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">
                {product.owner?.title && (
                  <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border dark:border-slate-800">
                    <MapPin size={14} className="text-red-500" />
                    {product.owner.title}
                  </span>
                )}
                <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border dark:border-slate-800">
                  <Clock size={14} />
                  Just listed
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-sm font-bold text-slate-400">PKR</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {Number(product.price).toLocaleString()}
                </span>
              </div>

              <Separator className="mb-6 dark:bg-slate-800" />

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Description</h3>
                <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
                  {product.description ?? "No description provided for this product."}
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (seller + contact + extra info) ── */}
          <div className="space-y-6">
            <SellerProfileCard
              store={product.owner}
              itemName={product.productName}
              itemType="product"
              showMetadata={false}
              onContact={() => {
                if (product && user) {
                  recordLead({
                    productId: product.id,
                    productName: product.productName,
                    productImage: product.imageurl?.url,
                    storeOwnerUid: product.ownerUid,
                  });
                }
              }}
            >
              <Button 
                onClick={() => {
                  toast.success("Added to Cart!");
                }}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-550 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
            </SellerProfileCard>

            {/* Category + Stock Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/80 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-slate-400" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</p>
                </div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white capitalize">
                  {product.category ?? "Uncategorized"}
                </p>
              </div>

              <Separator className="dark:bg-slate-800" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-slate-400" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Stock Quantity</p>
                </div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {product.stock ?? 0} units
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <CategoryProductsSection
            category={product.category ?? "Uncategorized"}
            categoryTitle="Related Products"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailContainer;