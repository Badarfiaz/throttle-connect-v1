"use client";

import React from "react";
import Image from "next/image";
import CardLinkWrapper from "../shared/CardLinkWapper";
import { MarketplaceProduct } from "@/types/marketplace";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import PriceLabel from "./PriceLabel";
import CategoryLabel from "./CategoryLabel";
import HeartButton from "./HeartButton";

type ProductCardProps = {
  product: MarketplaceProduct;
  size?: "sm" | "md" | "lg";
};

const ProductCard: React.FC<ProductCardProps> = ({ product, size = "md" }) => {
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

  return (
    <CardLinkWrapper link={`/marketplace/product/${product.id}`}>
      <TooltipProvider>
        <Card
          className={cn(
            "relative overflow-hidden cursor-pointer mb-2.5",
            "bg-[#F5F9FB] border border-[#0C679266] rounded-xl",
            "shadow-[0_4px_6px_0_rgba(3,26,37,0.16)]",
            "transition-all duration-200 ease-out",
            "hover:shadow-[0_8px_20px_rgba(12,103,146,0.18)] hover:-translate-y-0.5",
            sizeStyles[size],
          )}
        >
          {/* ── Image ── */}
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-t-xl",
              imageHeightStyles[size],
            )}
          >
            <Image
              src={product.imageurl?.url || "/images/logos/segalmotors.jpg"}
              alt={product.productName}
              fill
              className="object-contain rounded-2xl"
            />

            {/* Heart / Favourite */}
            <div className="absolute top-2.5 right-2.5 z-10">
              <HeartButton />
            </div>
          </div>

          {/* ── Content ── */}
          <div className="px-3 py-2.5 bg-[#F5F9FB] flex flex-col gap-1.5">
            {/* Title row */}
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-base font-medium text-[#031A25] leading-snug line-clamp-1 flex-1">
                {product.productName || "Product Title"}
              </h3>
            </div>

            {/* Price */}
            <PriceLabel price={product.price} />

            {/* Category */}
            <CategoryLabel type="category" label={product.category ?? ""} />

            {/* Location */}
            {locationText && (
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin
                  size={13}
                  className="text-[#0C6792] shrink-0"
                  fill="currentColor"
                  stroke="none"
                />
                <span className="text-[12px] font-medium text-[#68767C] truncate">
                  {locationText}
                </span>
              </div>
            )}
          </div>
        </Card>
      </TooltipProvider>
    </CardLinkWrapper>
  );
};

export default ProductCard;
