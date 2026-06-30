import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceProduct } from "@/types/marketplace";

type ProductsSectionProps = {
  products: MarketplaceProduct[];
  loading?: boolean;
  error?: string | null;
  onAddProduct: () => void;
  onEditProduct?: (product: MarketplaceProduct) => void;
  onDeleteProduct?: (productId: string) => void;
  deleting?: boolean;
};

const ProductsSection = ({
  products,
  loading,
  error,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  deleting,
}: ProductsSectionProps) => {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (product: MarketplaceProduct) => {
    if (!onDeleteProduct) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.productName}"? This action cannot be undone.`,
    );

    if (confirmed) {
      setDeletingId(product.id);
      try {
        await onDeleteProduct(product.id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Product Catalog
          </h2>
          <p className="text-sm text-slate-500">
            Keep your inventory fresh and visible.
          </p>
        </div>
        <Button onClick={onAddProduct}>Add Product</Button>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Loading products...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-medium text-slate-900">No products yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Get started by adding your first product.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                {(product.imageUrlMulti?.[0]?.url ?? product.imageurl?.url) && (
                  <img
                    src={product.imageUrlMulti?.[0]?.url ?? product.imageurl?.url}
                    alt={product.productName}
                    className="size-16 rounded-lg border border-slate-200 object-cover"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {product.productName}
                    </h3>
                    <Badge
                      variant={product.stock > 0 ? "default" : "secondary"}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    PKR {product.price.toLocaleString()} · Stock:{" "}
                    {product.stock} units
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProduct?.(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
