"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductItem } from "@/ulity/marketplaceDashboard";

type ProductsSectionProps = {
  products: ProductItem[];
  onAddProduct: () => void;
};

const ProductsSection = ({ products, onAddProduct }: ProductsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Product Catalog</h2>
          <p className="text-sm text-slate-500">
            Keep your inventory fresh and visible.
          </p>
        </div>
        <Button onClick={onAddProduct}>Add Product</Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {product.name}
                </h3>
                <Badge
                  variant={product.status === "Active" ? "default" : "secondary"}
                >
                  {product.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {product.category} · {product.price} · {product.stock}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;
