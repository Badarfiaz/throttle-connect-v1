"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { ProductCardSkeleton } from "@/components/marketplace/ProductCard";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import MarketplaceCategoryGrid from "@/components/marketplace/MarketplaceCategoryGrid";
import MarketplaceSearch from "@/components/marketplace/MarketplaceSearch";
import CategorySection, { CategorySectionSkeleton } from "@/components/shared/CategorySection";
import CategoryProductsSection from "@/components/marketplace/CategoryProductsSection";
import FeaturedServicesSection from "@/components/marketplace/FeaturedServicesSection";

import { cardDataMarketplace } from "@/dummydata/networking";
import { MARKETPLACE_ALL_STORES_QUERY } from "@/app/graphql/marketplace";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { getMarketplaceFeaturedProducts } from "@/ulity/marketplaceProducts";
import { mobileResponsiveCount } from "@/types/CommonType";

import { CENTER_TEXT, SECTION_CONTAINER } from "@/types/main";
import { SectionWrapper } from "@/components/shared/SectionWrapper";

function Page() {
  const [featuredProducts, setFeaturedProducts] = useState<
    Awaited<ReturnType<typeof getMarketplaceFeaturedProducts>>
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
        console.log("Fetched featured products:", products);
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
  
  const tophalf = featuredProducts.slice(0, 11);
  const bottomhalf = featuredProducts.slice(12, 22);
  const storeCards = useMemo(
    () =>
      (data ?? []).map((store, i) => ({
        id: store.id ?? `store-${i}`,
        title: store.title,
        logoUrl: store.logoUrl,
        slugUrl: store.slugUrl,
        businessType: store.businessType,
        location: store.location,
      })),
    [data],
  );

  const bg = "#D8E7ED";

  return (
    <div>
      <MarketplaceSearch />
      <div className="mt-8">
        <MarketplaceCategoryGrid />
      </div>

      {/* Stores */}
      <SectionWrapper
        bg={bg}
        title="Explore Stores"
        description="Explore our marketplace of automotive stores and find your perfect match."
      >
        <div className="pt-4">
          {loading ? (
            <PrimaryCarousel
              items={Array.from({ length: 5 })}
              responsive={{
                mobile: mobileResponsiveCount,
                tablet: 3,
                desktop: 6,
              }}
              className="w-full"
              renderItem={(_, i) => (
                <CategorySectionSkeleton key={i} />
              )}
            />
          ) : error ? (
            <p className={CENTER_TEXT}>Failed to load stores.</p>
          ) : storeCards.length > 0 ? (
            <PrimaryCarousel
              items={storeCards}
              responsive={{
                mobile: mobileResponsiveCount,
                tablet: 3,
                desktop: 6,
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
            <p className={CENTER_TEXT}>No stores available right now.</p>
          )}
        </div>
      </SectionWrapper>

      {/* Banner */}
      <RegistureClubBanner
        title="Why Choose Us?"
        description="Buy and sell securely, easily, and conveniently..."
        ctaButton1="Register now for free"
        cardData={cardDataMarketplace}
      />

      {/* Featured */}
      <SectionWrapper
        bg={bg}
        // className={SECTION_CONTAINER}
        title="Featured Products"
        description="Discover our handpicked selection..."
      >
        {featuredLoading ? (
          <PrimaryCarousel
            items={Array.from({ length: 4 })}
            className="w-full"
            responsive={{
              mobile: mobileResponsiveCount,
              tablet: 2,
              desktop: 5,
            }}
            renderItem={(_, i) => (
              <ProductCardSkeleton key={i} />
            )}
          />
        ) : featuredError ? (
          <p className={CENTER_TEXT}>Failed to load featured products.</p>
        ) : featuredProducts.length > 0 ? (
          <>
          <PrimaryCarousel
            items={tophalf}
            className="w-full"
            responsive={{
              mobile: mobileResponsiveCount,
              tablet: 2,
              desktop: 5,
            }}
            renderItem={(product) => (
              <ProductCard key={product.id} product={product} />
            )}
          />
           <PrimaryCarousel
            items={bottomhalf}
            className="w-full"
            responsive={{
              mobile: mobileResponsiveCount,
              tablet: 2,
              desktop: 5,
            }}
            renderItem={(product) => (
              <ProductCard key={product.id} product={product} />
            )}
          />
          </>

        ) : (
          <p className={CENTER_TEXT}>
            No featured products available right now.
          </p>
        )}
      </SectionWrapper>


      {/* Categories */}
      <div className={SECTION_CONTAINER}>
        <CategoryProductsSection
          category="accessories"
          categoryTitle="Accessories"
          categoryDescription="Find quality automotive accessories for your vehicle."
        />
      </div>
      
      <div className={SECTION_CONTAINER}>
        <CategoryProductsSection
          category="oils-and-fluids"
          categoryTitle="Oils & Fluids"
          categoryDescription="Premium automotive oils and fluids."
        />
      </div>

      <div className={SECTION_CONTAINER}>
        <CategoryProductsSection
          category="riding-gear"
          categoryTitle="Riding Gear"
          categoryDescription="Professional riding gear and safety equipment."
        />
      </div>
       {/* Vehicle Services */}
      <FeaturedServicesSection />

    </div>
  );
}

export default Page;
