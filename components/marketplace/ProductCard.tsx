"use client";

import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import CardLinkWrapper from "../shared/CardLinkWapper";
import { MarketplaceProduct } from "@/types/marketplace";

type ProductCardProps = {
  product: MarketplaceProduct;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <CardLinkWrapper link={`/marketplace/product/${product.id}`}>
      <div className="w-[268px] flex flex-col gap-4">
        {/* Image area (fixed height 170) */}
        <div className="relative w-full h-[170px] overflow-hidden rounded-t-2xl bg-gray-100">
          <Image
            src={product.imageurl?.url || "/images/logos/segalmotors.jpg"}
            alt={product.productName}
            fill
            className="object-cover transition-transform duration-700 ease-in-out"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite((s) => !s);
            }}
            aria-label="favorite"
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart
              size={18}
              className={isFavorite ? "fill-red-500 text-red-500" : ""}
            />
          </button>

          <div className="absolute bottom-3 right-3">
            <button
              onClick={(e) => e.preventDefault()}
              className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
              aria-label="quick-add"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>

        {/* Content area (width 264, padding 8px, rounded-bottom 12px) */}
        <div className="w-[264px] bg-white rounded-b-xl shadow-sm p-2">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-semibold text-[#083047] line-clamp-2">
              {product.productName}
            </h3>
          </div>

          <div className="mt-2">
            <p className="text-sm text-red-600">
              Starting from Rs {product.price} / Unit
            </p>
            <p className="text-sm text-blue-700 font-semibold mt-1">
              Whole seller
            </p>
            <p className="text-xs text-gray-500 mt-2">{product.owner?.title}</p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={(e) => e.preventDefault()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0F6AA6] text-white rounded-md py-2 text-sm font-medium"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15.46C20.5 15.04 18.9 14.07 18.5 13.88C18.1 13.69 17.8 13.61 17.5 13.88C17.2 14.15 16.4 14.73 16 14.98C15.6 15.23 15.2 15.23 14.9 14.98C13.8 14.12 10.9 11.92 9.6 10.83C9.1 10.45 8.6 10.34 8.2 10.46C7.8 10.57 6.6 11.06 5.2 9.9C4.2 9.03 3.7 7.9 4 6.9C4.1 6.49 4.3 6.13 4.5 5.86C4.7 5.6 4.8 5.29 4.6 4.98C4.2 4.25 3.7 3.56 3.3 3.04C2.9 2.5 2.7 2.2 2.1 2C1.5 1.8 0.9 2.04 0.4 2.78C-0.1 3.53 0.1 4.57 0.9 6.02C1.8 7.66 3.5 9.97 6.2 12.62C8.9 15.27 11.3 17.01 13.1 17.9C14.1 18.32 15.3 18.65 16.5 18.65C17.1 18.65 17.7 18.55 18.2 18.34C18.7 18.13 19.1 17.91 19.5 17.7C20.1 17.4 20.7 17 21 15.46Z"
                  fill="white"
                />
              </svg>
              Whatsapp
            </button>

            <button className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 7V12L15 15"
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12C21 17.5228 16.5228 22 11 22C5.47715 22 1 17.5228 1 12C1 6.47715 5.47715 2 11 2C16.5228 2 21 6.47715 21 12Z"
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </CardLinkWrapper>
  );
};

export default ProductCard;
