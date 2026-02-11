import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/marketplace/ProductCard";
import ClubCard from "@/components/networking/ClubsCard";
import CategorySection from "@/components/shared/CategorySection";
import FeaturedSection from "@/components/shared/FeaturedSection";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";

import {
  markeptlaceCatgegoryies,
  marketplaceProducts,
} from "@/dummydata/marketplace";
import {
  cardDataNetworking,
  clubs,
  vehicleCategories,
} from "@/dummydata/networking";
import { cardDataMarketplace } from "@/dummydata/networking";

function Home() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-24">
        <Tabs defaultValue="networking" className="w-full space-y-12">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-14 bg-secondary/30 backdrop-blur-sm p-1.5 rounded-2xl">
              <TabsTrigger
                value="networking"
                className="rounded-xl text-base font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
              >
                Networking
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                className="rounded-xl text-base font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
              >
                Marketplace
              </TabsTrigger>
            </TabsList>
          </div>

          {/* NETWORKING TAB CONTENT */}
          <TabsContent
            value="networking"
            className="space-y-20 animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
          >
            {/* Categories */}
            <div className="space-y-8">
              <div className="max-w-3xl mx-auto text-center">
                <Title
                  title="Explore Categories"
                  description="Discover your next ride — from elegant sedans to powerful superbikes"
                />
              </div>
              <div className="px-0 sm:px-4">
                <PrimaryCarousel
                  items={vehicleCategories}
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
            </div>
          </TabsContent>

          {/* MARKETPLACE TAB CONTENT */}
          <TabsContent
            value="marketplace"
            className="space-y-20 animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
          >
            {/* Marketplace Categories */}
            <div className="space-y-8">
              <div className="max-w-3xl mx-auto text-center">
                <Title
                  title="Explore Shops & Categories"
                  description="Explore our marketplace of automotive clubs and find your perfect match."
                />
              </div>
              <div className="px-0 sm:px-4">
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Clubs Carousel */}
        <div className="space-y-8">
          <RegistureClubBanner
            title="Join the Club Network"
            description="Whether you’re looking to register your own club or discover new ones, we’ve got you covered."
            ctaButton1="Register Club"
            ctaButton2="Find a Club"
            cardData={cardDataNetworking}
          />
          <div className="max-w-5xl mt-20 mx-auto px-6">
            {/* Sections Heading */}
            <Title
              title="Explore Products"
              description="expore our marketplace of automotive clubs and find your perfect match."
            />
          </div>
          <div className="px-4  mb-10 sm:px-6 md:px-12 lg:px-20 pt-0 pb-0">
            <PrimaryCarousel
              items={marketplaceProducts}
              className="w-full"
              responsive={{
                mobile: 2,
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

        <FeaturedSection />
        <Title
          title="Discover Clubs"
          description="Explore our thriving network of automotive clubs — from off-roaders
            to superbikes."
        />

        <div className="px-0 sm:px-4">
          <PrimaryCarousel
            items={clubs}
            responsive={{
              mobile: 1,
              tablet: 2,
              desktop: 3,
            }}
            renderItem={(club) => <ClubCard club={club} />}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
