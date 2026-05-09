"use client";

import React from "react";
import { Clock } from "lucide-react";
import Image from "next/image";
import CardLinkWrapper from "../shared/CardLinkWapper";
import { MarketplaceProduct } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import PriceLabel from "./PriceLabel";
import CategoryLabel from "./CategoryLabel";
import HeartButton from "./HeartButton";
import ContactButton from "./ContactButton";

type ProductCardProps = {
  product: MarketplaceProduct;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <CardLinkWrapper link={`/marketplace/product/${product.id}`}>
      <TooltipProvider>
        {/* Image area (fixed height 170) */}
        <div className="relative w-full h-[170px] overflow-hidden bg-gray-100 group">
          <Image
            src={product.imageurl?.url || "/images/logos/segalmotors.jpg"}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          <div className="absolute top-3 right-3">
            <HeartButton />
          </div>
        </div>

        {/* Content area */}
        <CardContent className="p-3">
          <h3 className="text-base font-semibold text-[#083047] line-clamp-1 mb-2">
            {product.productName}
          </h3>

          <div className="space-y-1 mb-3">
            <PriceLabel price={product.price} />
            <CategoryLabel type="category" label={product.category ?? ""} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <ContactButton
              phone={product.owner?.phone}
              email={product.owner?.email}
              preferredMethod={product.owner?.contactMethod}
              menuIcon
            />
          </div>
        </CardContent>
      </TooltipProvider>
    </CardLinkWrapper>
  );
};

export default ProductCard;
