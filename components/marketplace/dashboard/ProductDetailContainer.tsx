"use client";

import React, { useEffect, useState } from "react";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "@/types/marketplace";
import { useParams, useRouter } from "next/navigation";

const ProductDetailContainer = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { fetchProductById, loading } = useMarketplaceProducts();

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetchProductById(productId);

        if (mounted) {
          setProduct(res);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load product",
          );
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [productId, fetchProductById]);

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.back()}>Back to Marketplace</button>

      <div>
        {product.imageurl?.url ? (
          <img src={product.imageurl.url} alt={product.productName} />
        ) : (
          <div>
            <p>No image available</p>
          </div>
        )}
      </div>

      <div>
        <p>{product.category ?? "Uncategorized"}</p>

        <p>
          {product.stock && product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <h1>{product.productName}</h1>

        <p>PKR {Number(product.price).toLocaleString()}</p>

        <div>
          <p>{product.description}</p>
        </div>

        <div>
          <p>Phone: {product.owner?.phone}</p>
          <p>Email: {product.owner?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailContainer;
