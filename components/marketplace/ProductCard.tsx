"use client";

import React, { useState } from "react";
import { Heart, ShoppingBag, Clock, MessageCircle } from "lucide-react";
import Image from "next/image";
import CardLinkWrapper from "../shared/CardLinkWapper";
import { MarketplaceProduct } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: MarketplaceProduct;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFavorite((s) => !s);
                  }}
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "absolute top-3 right-3 rounded-full h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white",
                    isFavorite && "text-red-500"
                  )}
                >
                  <Heart
                    size={18}
                    className={cn(isFavorite && "fill-red-500")}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
            </Tooltip>

            {/* Quick Add Button */}
            <div className="absolute bottom-3 right-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => e.preventDefault()}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg bg-white/90 hover:bg-white"
                  >
                    <ShoppingBag size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quick add</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Content area */}
          <CardContent className="p-3">
            <h3 className="text-base font-semibold text-[#083047] line-clamp-2 mb-2">
              {product.productName}
            </h3>

            <div className="space-y-1 mb-3">
              <p className="text-sm font-medium text-red-600">
                Rs {product.price} / Unit
              </p>
              <p className="text-xs font-medium text-blue-600">Whole seller</p>
              <p className="text-xs text-gray-500">{product.owner?.title}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={(e) => e.preventDefault()}
                className={cn(
                  "flex-1 h-9 text-xs font-medium gap-1.5",
                  "bg-[#0F6AA6] hover:bg-[#0E5A8E] text-white"
                )}
              >
                <MessageCircle size={16} />
                Whatsapp
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 text-slate-600 hover:text-slate-800"
                  >
                    <Clock size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View details</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
       </TooltipProvider>
    </CardLinkWrapper>
  );
};

export default ProductCard;
