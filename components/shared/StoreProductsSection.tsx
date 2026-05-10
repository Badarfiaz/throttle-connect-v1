"use client";

import { useEffect, useState } from "react";
import ProductCard from "../marketplace/ProductCard";
import PrimaryCarousel from "./PrimaryCarousel";
import Title from "./Title";
import { MarketplaceProduct, MarketplaceStore } from "@/types/marketplace";
import { getMarketplaceProductsByOwnerUid } from "@/ulity/marketplaceProducts";
type StoreProductsSectionProps = {
  store?: MarketplaceStore;
};
function StoreProductsSection({ store }: StoreProductsSectionProps) {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const ownerUid = store?.ownerUid;

    if (!ownerUid) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return () => {
        isMounted = false;
      };
    }

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedProducts =
          await getMarketplaceProductsByOwnerUid(ownerUid);

        if (isMounted) {
          setProducts(fetchedProducts);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load products.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [store?.ownerUid]);

  if (loading) {
    return (
      <div className="mt-6 flex justify-center py-10 text-sm text-muted-foreground">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 flex justify-center py-10 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="mt-8">
        <Title title={`Products by ${store?.title ?? "Store"}`} align="left" />
        <p className="text-sm text-muted-foreground">
          No products available for this store yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Title title={`Products by ${store?.title ?? "Store"}`} align="left" />
      <PrimaryCarousel
        items={products}
        responsive={{
          mobile: 2,
          tablet: 2,
          desktop: 4,
        }}
        renderItem={(product) => (
          <ProductCard key={product.id} product={product} />
        )}
      />
    </div>
  );
}

export default StoreProductsSection;
