"use client";

import React, { useState } from "react";
import { marketplaceProductType } from "@/dummydata/marketplace";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag } from "lucide-react"; // Changed ShoppingCart to ShoppingBag for a more modern feel
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: marketplaceProductType;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group relative w-full h-full border-none shadow-none bg-transparent hover:shadow-none transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          fill
          src={product.image}
          alt={product.productName}
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />

        {/* Overlay Gradient (Subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart
            size={18}
            className={cn("transition-all", isFavorite ? "fill-red-500 text-red-500" : "")}
          />
        </button>

        {/* Quick Add Button (Bottom Right) - Visible on Hover for Desktop, Always for Mobile if desired, but here we keep it clean */}
        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-white text-black hover:bg-black hover:text-white shadow-md transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingBag size={18} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="px-1 py-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 leading-tight group-hover:underline decoration-1 underline-offset-2">
            {product.productName}
          </h3>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base md:text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          {product.price && (
            <span className="text-xs text-gray-400 line-through">
              ${Math.round(product.price * 1.2)}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 ">
          Profile: {product.profileName}
        </span>

        {/* Optional: Category or other meta info could go here, but keeping it minimal */}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
