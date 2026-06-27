"use client";

import React, { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import HorizontalProductCard from "@/components/shared/HorizontalProductCard";
import { MarketplaceProduct } from "@/types/marketplace";

// We use a union type so the component can handle both marketplace products
// and networking clubs without needing separate lists
export type SearchResultItem =
  | {
      kind: "marketplace";
      data: MarketplaceProduct;
    }
  | {
      kind: "networking";
      data: {
        id: string;
        clubName?: string | null;
        clubType?: string | null;
        description?: string | null;
        city?: string | null;
        logoUrl?: string | null;
        bannerUrl?: string | null;
        slugUrl?: string | null;
      };
    };

type SearchResultsProps = {
  items: SearchResultItem[];
};

const SearchResults: React.FC<SearchResultsProps> = ({ items }) => {
  const router = useRouter();

  const renderItem = useCallback(
    (item: SearchResultItem, index: number) => {
      if (item.kind === "marketplace") {
        const p = item.data;
        const location = [p.owner?.location?.area, p.owner?.location?.city]
          .filter(Boolean)
          .join(", ");

        return (
          <HorizontalProductCard
            key={p.id}
            id={p.id}
            title={p.productName}
            image={p.imageurl?.url}
            category={p.category}
            description={p.description}
            price={p.price}
            metadata={location || undefined}
            sellerName={p.owner?.title ?? undefined}
            sellerLogo={p.owner?.logoUrl ?? undefined}
            sellerVerified={p.owner?.completed}
            ctaLabel="View Product"
            onClick={() => router.push(`/marketplace/product/${p.id}`)}
          />
        );
      }

      // Networking club
      const c = item.data;
      return (
        <HorizontalProductCard
          key={c.id}
          id={c.id}
          title={c.clubName ?? "Unnamed Club"}
          image={c.bannerUrl ?? c.logoUrl}
          category={c.clubType}
          description={c.description}
          metadata={c.city ?? undefined}
          sellerName={undefined}
          ctaLabel="View Club"
          onClick={() => router.push(`/networking/Club-Profile/${c.id}`)}
        />
      );
    },
    [router],
  );

  return (
    <div className="space-y-4">
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};

export default memo(SearchResults);
