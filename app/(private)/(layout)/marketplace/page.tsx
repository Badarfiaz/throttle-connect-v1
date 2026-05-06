"use client";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/marketplace/ProductCard";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";

import type { marketplaceProductType } from "@/dummydata/marketplace";
import { cardDataMarketplace } from "@/dummydata/networking";
import { MARKETPLACE_ALL_STORES_QUERY } from "@/app/graphql/marketplace";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { MarketplaceStoreCard } from "@/types/marketplace";
import CategorySection from "@/components/shared/CategorySection";
import { getMarketplaceFeaturedProducts } from "@/ulity/marketplaceProducts";

function Page() {
  const [featuredProducts, setFeaturedProducts] = useState<
    marketplaceProductType[]
  >([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const { data, loading, error, fetchMarketplaceStores } = useMarketplaceStore({
    query: MARKETPLACE_ALL_STORES_QUERY,
    isPublic: true,
  });
  useEffect(() => {
    fetchMarketplaceStores().catch(() => undefined);
  }, [fetchMarketplaceStores]);

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      setFeaturedLoading(true);
      setFeaturedError(null);

      try {
        const products = await getMarketplaceFeaturedProducts();
        const mappedProducts = products.map((product, index) => ({
          id: product.id ,
          productName: product.productName,
          image: product.imageurl?.url || "/images/logos/segalmotors.jpg",
          profileName: product.ownerUid,
          price: product.price,
        }));

        if (isMounted) {
          setFeaturedProducts(mappedProducts);
        }
      } catch (error) {
        if (isMounted) {
          setFeaturedError(
            error instanceof Error
              ? error.message
              : "Failed to load featured products.",
          );
        }
      } finally {
        if (isMounted) {
          setFeaturedLoading(false);
        }
      }
    };

    loadFeaturedProducts().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  console.log("STORE DATA ", data); // coorect
  const storeCards: MarketplaceStoreCard[] = useMemo(
    () =>
      (data ?? []).map((store, index) => ({
        id: store.id ?? `store-${index}`,
        title: store.title,
        logoUrl: store.logoUrl,
        slugUrl: store.slugUrl,
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
              <CategorySection
                pageType="marketplace"
                key={store.id}
                items={store}
              />
            )}
          />
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No stores available right now.
          </p>
        )}
      </div>
      {/*  */}

      <RegistureClubBanner
        title="Join the Throttle Connect Marketplace"
        description="Whether you’re a seller looking to reach passionate enthusiasts or a buyer seeking unique products, our marketplace is your destination."
        ctaButton1="Register as shop"
        ctaButton2="Find a Club"
        cardData={cardDataMarketplace}
      />
      {/*  */}
      <Title
        title="Featured Products"
        description="Discover our handpicked selection of automotive products, curated for quality and performance."
      />

      <div className="px-4 mb-10 sm:px-6 md:px-12 lg:px-20">
        {featuredLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Loading featured products...
          </p>
        ) : featuredError ? (
          <p className="py-10 text-center text-sm text-destructive">
            Failed to load featured products.
          </p>
        ) : featuredProducts.length > 0 ? (
          <PrimaryCarousel
            items={featuredProducts}
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
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No featured products available right now.
          </p>
        )}
      </div>
    </div>
  );
}

export default Page;
