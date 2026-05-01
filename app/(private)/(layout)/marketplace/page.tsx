"use client";
import { useEffect, useMemo } from "react";
import ProductCard from "@/components/marketplace/ProductCard";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";
import { useAppSelector } from "@/app/redux/hooks";

import { marketplaceProducts } from "@/dummydata/marketplace";
import { cardDataMarketplace } from "@/dummydata/networking";
import { MARKETPLACE_ALL_STORES_QUERY } from "@/app/graphql/marketplace";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { MarketplaceStoreCard } from "@/types/marketplace";
import CategorySection from "@/components/shared/CategorySection";

function Page() {
  const { data, loading, error, fetchMarketplaceStores } = useMarketplaceStore({
    query: MARKETPLACE_ALL_STORES_QUERY,
  });
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (user?.userId) {
      fetchMarketplaceStores();
    }
  }, [user?.userId, fetchMarketplaceStores]);

  console.log("STORcsdcE DATA ", data); // coorect
  const storeCards: MarketplaceStoreCard[] = useMemo(
    () =>
      (data ?? []).map((store, index) => ({
        id: store.id ?? `store-${index}`,
        title: store.title,
        logoUrl: store.logoUrl,
        // slugUrl: store.slugUrl,
      })),
    [data],
  );

  return (
    <div>
      <HeroSection
        title="Discover Your Automotive Passion"
        subtitle="Explore our marketplace of automotive clubs and find your perfect match."
        ctaText="Explore products"
        layout={2}
      />

      <div className="max-w-5xl mt-20 mx-auto px-6">
        <Title
          title="Explore Stores"
          description="Explore our marketplace of automotive stores and find your perfect match."
        />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20">
        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading stores...
          </p>
        ) : error ? (
          <p className="py-10 text-center text-sm text-destructive">
            Failed to load stores.
          </p>
        ) : storeCards.length > 0 ? (
          <PrimaryCarousel
            items={storeCards}
            responsive={{
              mobile: 2,
              tablet: 3,
              desktop: 4,
            }}
            className="w-full"
            renderItem={(store) => (
              <CategorySection key={store.id} items={store} />
            )}
          />
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No stores available right now.
          </p>
        )}
      </div>

      <RegistureClubBanner
        title="Join the Throttle Connect Marketplace"
        description="Whether you’re a seller looking to reach passionate enthusiasts or a buyer seeking unique products, our marketplace is your destination."
        ctaButton1="Register as shop"
        ctaButton2="Find a Club"
        cardData={cardDataMarketplace}
      />

      <Title
        title="Featured Products"
        description="Discover our handpicked selection of automotive products, curated for quality and performance."
      />

      <div className="px-4 mb-10 sm:px-6 md:px-12 lg:px-20">
        <PrimaryCarousel
          items={marketplaceProducts}
          className="w-full"
          responsive={{
            mobile: 2,
            tablet: 2,
            desktop: 4,
          }}
          renderItem={(product) => (
            <div key={product.id} className="w-full h-full">
              <ProductCard product={product} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default Page;
