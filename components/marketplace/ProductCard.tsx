"use client";

import React, { useState } from "react";
import { marketplaceProductType } from "@/dummydata/marketplace";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import SharedButton from "../shared/SharedButton";

type ProductCardProps = {
  product: marketplaceProductType;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group relative w-full bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 hover:border-primary/20 flex flex-col h-full backdrop-blur-sm">
      {/* Top Section: Image & Overlay Actions */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center overflow-hidden">
        {/* Product Image with Enhanced Hover Effect */}
        <div className="relative w-full h-full p-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Image
            fill
            src={product.image}
            alt={product.productName}
            className="rounded-b-sm"
          />
        </div>

        {/* Decorative Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
      </div>

      <CardContent className="flex flex-col flex-1 p-6 bg-white relative">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
          {product.productName}
        </h3>

        {/* Price & Action Section */}
        <div className="flex items-end justify-between mt-auto gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <span className="w-1 h-1 bg-primary rounded-full"></span>
              Price
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                ${product.price}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${Math.round(product.price * 1.2)}
              </span>
            </div>
          </div>

          <SharedButton
            variant="default"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
            iconLeft={<ShoppingCart size={16} />}
            label="Add"
            size="sm"
          />
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
