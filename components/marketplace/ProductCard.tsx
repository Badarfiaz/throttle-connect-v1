"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { marketplaceProductType } from "@/dummydata/marketplace";
import CardLinkWrapper from "../shared/CardLinkWapper";
import CategoryLabel from "./product-card/CategoryLabel";
import ContactButton from "./product-card/ContactButton";
import FeaturedLabel from "./product-card/FeaturedLabel";
import HeartIconButton from "./product-card/HeartIconButton";
import PriceLabel from "./product-card/PriceLabel";

type ProductCardProps = {
  product: marketplaceProductType & {
    category?: string;
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <CardLinkWrapper link={`/marketplace/product/${product.id}`}>
      <Card className="group relative h-full overflow-hidden rounded-[20px] border border-[#BDD7EA] bg-[#F8FBFE] shadow-[0_5px_16px_rgba(14,28,46,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(14,28,46,0.14)] sm:rounded-[22px]">
        <div className="p-1.5 sm:p-2">
          <div className="relative aspect-[1.08/1] w-full overflow-hidden rounded-[16px] border border-[#B7D4E7] bg-slate-100 sm:aspect-[1.02/1] sm:rounded-[18px]">
            <Image
              fill
              src={product.image}
              alt={product.productName}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />

            <div className="absolute left-2.5 top-2.5 hidden sm:block sm:left-3 sm:top-3">
              <FeaturedLabel className="scale-90 sm:scale-100" />
            </div>

            <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
              <HeartIconButton
                active={isFavorite}
                onToggle={() => setIsFavorite((current) => !current)}
                className="h-9 w-9 sm:h-10 sm:w-10"
              />
            </div>

            <div className="absolute bottom-2 left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-white/85 shadow-sm sm:bottom-3 sm:h-1.5 sm:w-8" />
          </div>
        </div>

        <CardContent className="space-y-2 px-3 pb-3 pt-0 sm:space-y-3 sm:px-4 sm:pb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 text-[12.5px] font-semibold leading-snug text-slate-900 sm:text-base">
              {product.productName}
            </h3>
          </div>

          <PriceLabel
            price={product.price}
            compareAtPrice={Math.round(product.price * 1.18)}
            className="-mt-0.5"
          />

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <CategoryLabel label={product.category || "Marketplace Category"} />
          </div>

          <div className="flex items-center gap-2 pt-0.5 sm:pt-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-bold text-slate-700 shadow-sm sm:h-10 sm:w-10 sm:text-xs">
              {(product.profileName || "M").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-1 items-center gap-2">
              <ContactButton
                label="Whatsapp"
                className="h-10 flex-1 rounded-xl px-3 text-xs sm:h-11 sm:px-4 sm:text-sm"
              />
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDEBF6] text-[#0B2447] shadow-sm transition-all duration-300 hover:bg-[#cfe2f3] sm:h-11 sm:w-11"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                aria-label="More options"
              >
                <span className="text-xl leading-none sm:text-2xl">⋮</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardLinkWrapper>
  );
};

export default ProductCard;
