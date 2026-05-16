"use client";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/marketplace/ProductCard";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";
import MarketplaceCategoryCarousel from "@/components/marketplace/MarketplaceCategoryCarousel";
import MarketplaceBanner from "@/components/marketplace/MarketplaceBanner";

import { cardDataMarketplace } from "@/dummydata/networking";
import { MARKETPLACE_ALL_STORES_QUERY } from "@/app/graphql/marketplace";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { MarketplaceProduct, MarketplaceStoreCard } from "@/types/marketplace";
import CategorySection from "@/components/shared/CategorySection";
import { getMarketplaceFeaturedProducts } from "@/ulity/marketplaceProducts";
import CategoryProductsSection from "@/components/marketplace/CategoryProductsSection";
import { mobileResponsiveCount } from "@/types/CommonType";
function Page() {
  const [featuredProducts, setFeaturedProducts] = useState<
    MarketplaceProduct[]
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

        if (isMounted) {
          setFeaturedProducts(products);
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

  const storeCards: MarketplaceStoreCard[] = useMemo(
    () =>
      (data ?? []).map((store, index) => ({
        id: store.id ?? `store-${index}`,
        title: store.title,
        logoUrl: store.logoUrl,
        slugUrl: store.slugUrl,
        businessType: store.businessType,
        location: store.location,
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

      <div className="mt-14">
        <MarketplaceCategoryCarousel />
      </div>

      <MarketplaceBanner />

      <div className="max-w-5xl mt-20 mx-auto px-6">
        <Title
          title=" Explore Stores"
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
              mobile: mobileResponsiveCount,
              tablet: 3,
              desktop: 5,
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
        title="Why Choose Us?
"
        description="Buy and sell securely, easily, and conveniently from your vehicle. Enjoy a professional experience designed for your comfort and peace of mind.."
        ctaButton1="Register now for free"
        // ctaButton2="Find a Club"
        cardData={cardDataMarketplace}
      />
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
              mobile: mobileResponsiveCount,
              tablet: 2,
              desktop: 4,
            }}
            renderItem={(product) => (
              <div key={product.id} className="s">
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

      <div className="px-4 sm:px-6 md:px-12 lg:px-20">
        <CategoryProductsSection
          category="accessories"
          categoryTitle="Accessories"
          categoryDescription="Find quality automotive accessories for your vehicle."
        />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20">
        <CategoryProductsSection
          category="oils-and-fluids"
          categoryTitle="Oils & Fluids"
          categoryDescription="Premium automotive oils and fluids for optimal performance."
        />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20">
        <CategoryProductsSection
          category="riding-gear"
          categoryTitle="Riding Gear"
          categoryDescription="Professional riding gear and safety equipment."
        />
      </div>
    </div>
  );
}

export default Page;
