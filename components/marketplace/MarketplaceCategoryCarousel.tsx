"use client";

import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import Title from "@/components/shared/Title";
import { Card } from "@/components/ui/card";
import { marketplaceCategories } from "@/data/category";
import { cn } from "@/lib/utils";
import CardLinkWrapper from "../shared/CardLinkWapper";

type CategoryCardProps = {
  name: string;
  slug: string;
};

function CategoryCard({ name, slug }: CategoryCardProps) {
  return (
    <CardLinkWrapper link={`/marketplace/search/${slug}`}>
      <Card
        className={cn(
          "group flex h-full items-center justify-center rounded-2xl border border-slate-200 bg-white/90 px-4 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BFD7FF] hover:shadow-md",
          "backdrop-blur-sm",
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-semibold tracking-wide text-[#0B2447] transition-colors group-hover:text-[#19376D] sm:text-base">
            {name}
          </span>
          <span className="h-1 w-10 rounded-full bg-gradient-to-r from-[#dcecf6] to-[#BFD7FF] opacity-70 transition-all duration-300 group-hover:w-14" />
        </div>
      </Card>
    </CardLinkWrapper>
  );
}

export default function MarketplaceCategoryCarousel() {
  return (
    <section className="px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Title
          title="Browse Categories"
          description="Explore marketplace categories and jump straight to what you need."
        />

        <div className="mt-6">
          <PrimaryCarousel
            items={marketplaceCategories}
            responsive={{
              mobile: 2,
              tablet: 3,
              desktop: 5,
            }}
            className="w-full"
            renderItem={(category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}
