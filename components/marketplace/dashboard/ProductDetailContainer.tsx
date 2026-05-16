"use client";

import React, { useEffect, useState } from "react";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "@/types/marketplace";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import CategoryProductsSection from "../CategoryProductsSection";
import Link from "next/link";

import { Package, Tag, MapPin, Clock, Store, Layers, ChevronLeft } from "lucide-react";
import ContactButton from "../ContactButton";
import { clonePageVaryPathWithNewSearchParams } from "next/dist/client/components/segment-cache/vary-path";

const ProductDetailContainer = () => {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id as string;

  const { fetchProductById, loading } = useMarketplaceProducts();

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="w-full h-80 rounded-xl" />
          <Skeleton className="w-2/3 h-8 rounded" />
          <Skeleton className="w-1/3 h-6 rounded" />
          <Skeleton className="w-full h-32 rounded" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-full h-40 rounded-xl" />
          <Skeleton className="w-full h-12 rounded" />
          <Skeleton className="w-full h-12 rounded" />
        </div>
      </div>
    );
  }

  const isInStock = product.stock && product.stock > 0;
  console.log('product => ', product.owner?.logoUrl)
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to listings
        </button>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN (image + details) ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Image Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              {product.imageurl?.url ? (
                <img
                  src={product.imageurl.url}
                  alt={product.productName}
                  className="w-full h-72 sm:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-72 sm:h-96 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                  <Package size={48} strokeWidth={1.2} />
                  <p className="mt-2 text-sm">No image available</p>
                </div>
              )}
            </div>

            {/* Title + Price Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  <Tag size={11} />
                  {product.category ?? "Uncategorized"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium border ${isInStock
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-red-50 text-red-600 border-red-100"
                    }`}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-2">
                {product.productName}
              </h1>

              {/* Location + time row (mimics Zameen layout) */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
                {product.owner?.title && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {product.owner.title}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  Just listed
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-5">
                <span className="text-sm font-semibold text-gray-500">PKR</span>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {Number(product.price).toLocaleString()}
                </span>
              </div>

              <Separator className="mb-5" />



              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description ?? "No description provided for this product."}
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (seller + contact + extra info) ── */}
          <div className="space-y-4">

            {/* Seller Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <Link
                href={
                  product.owner?.slugUrl
                    ? `/marketplace/storeProfile/${product.owner.slugUrl}`
                    : "#"
                }
                className="flex items-center gap-3 group mb-4"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#19376D] flex items-center justify-center shrink-0">
                  {product.owner?.logoUrl ? (
                    <img
                      src={product.owner.logoUrl}
                      alt={product.owner?.title || "Store"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store size={22} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">Posted by</p>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#19376D] transition-colors truncate">
                    {product.owner?.title || "Unknown Store"}
                  </p>
                </div>

                <ChevronLeft size={16} className="text-gray-400 rotate-180 shrink-0" />
              </Link>

              <Separator className="mb-4" />

              <div className="flex items-center gap-2">
                <ContactButton
                  phone={product.owner?.phone}
                  email={product.owner?.email}
                  preferredMethod="phone"
                  menuIcon={true}
                  detailPage={true}
                />
              </div>

              <Link
                href={
                  product.owner?.slugUrl
                    ? `/marketplace/storeProfile/${product.owner.slugUrl}`
                    : "#"
                }
                className="mt-3 flex items-center justify-center gap-1.5 w-full h-9 rounded-md border border-[#19376D] text-[#19376D] text-xs font-medium hover:bg-[#19376D]/5 transition-colors"
              >
                <Store size={14} />
                View Store
              </Link>
            </div>

            {/* ── NEW: Category + Stock Cards ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">

              {/* Category Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-600">Category</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {product.category ?? "Uncategorized"}
                </p>
              </div>

              <Separator />

              {/* Stock Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-gray-400" />
                  <p className="text-sm text-gray-600">Stock</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {product.stock ?? 0} units
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        <div className="mt-8">
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