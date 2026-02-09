import ProductCard from "@/components/marketplace/ProductCard";
import CategorySection from "@/components/shared/CategorySection";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";
import {
  markeptlaceCatgegoryies,
  marketplaceProducts,
} from "@/dummydata/marketplace";

function page() {
  return (
    <div>
      <HeroSection
        title="Discover Your Automotive Passion"
        subtitle="Explore our marketplace of automotive clubs and find your perfect match."
        ctaText="Explore products"
        layout={2}
      />
      <div className="max-w-5xl mt-20 mx-auto px-6">
        {/* Sections Heading */}
        <Title
          title="Explore Products"
          description="expore our marketplace of automotive clubs and find your perfect match."
        />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-0 pb-0">
        <PrimaryCarousel
          items={markeptlaceCatgegoryies}
          responsive={{
            mobile: 2,
            tablet: 3,
            desktop: 4,
          }}
          className="w-full"
          renderItem={(category) => (
            <div className="w-full h-full">
              <CategorySection key={category.id} items={category} />
            </div>
          )}
        />
      </div>
      <RegistureClubBanner
        title="Join the Throttle Connect Marletplace"
        description="Whether you’re a seller 
        looking to reach passionate automotive enthusiasts or a buyer seeking unique products, our marketplace is your destination for all things automotive."
        ctaButton1="Register as shop"
        ctaButton2="Find a Club"
      />
      <Title
        title="Featured Products"
        description="Discover our handpicked selection of automotive products, curated for quality and performance."
      />

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-0 pb-0">
        <PrimaryCarousel
          items={marketplaceProducts}
          className="w-full"
          responsive={{
            mobile: 1,
            tablet: 2,
            desktop: 4,
          }}
          renderItem={(product) => (
            <div className="w-full h-full">
              <ProductCard product={product} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default page;
