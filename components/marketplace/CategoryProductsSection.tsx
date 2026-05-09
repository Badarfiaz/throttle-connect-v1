"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/marketplace/ProductCard";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import Title from "@/components/shared/Title";
import { getProductsByCategory } from "@/ulity/marketplaceProducts";
import type { marketplaceProductType } from "@/dummydata/marketplace";

interface CategoryProductsSectionProps {
  category: string;
  categoryTitle?: string;
  categoryDescription?: string;
}

export default function CategoryProductsSection({
  category,
  categoryTitle,
  categoryDescription,
}: CategoryProductsSectionProps) {
  const [products, setProducts] = useState<marketplaceProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategoryProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedProducts = await getProductsByCategory(category);
        const mappedProducts = fetchedProducts.map((product) => ({
          id: product.id,
          productName: product.productName,
          image: product.imageurl?.url || "/images/logos/segalmotors.jpg",
          profileName: product.ownerUid,
          price: product.price,
          category: product.category,
        }));

        if (isMounted) {
          setProducts(mappedProducts);
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

    loadCategoryProducts().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <Title
        title={categoryTitle || `${category} Products`}
        // description={categoryDescription}
        align="left"
      />
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
