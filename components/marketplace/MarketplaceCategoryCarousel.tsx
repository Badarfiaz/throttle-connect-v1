"use client";

import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import Title from "@/components/shared/Title";
import { Card } from "@/components/ui/card";
import { marketplaceCategories } from "@/data/category";
import CardLinkWrapper from "../shared/CardLinkWapper";

type CategoryCardProps = {
  name: string;
  slug: string;
};

function CategoryCard({ name, slug }: CategoryCardProps) {
  return (
    <CardLinkWrapper link={`/marketplace/search/${slug}`}>
      <Card>
        <div>
          <span>{name}</span>
        </div>
      </Card>
    </CardLinkWrapper>
  );
}

export default function MarketplaceCategoryCarousel() {
  return (
    <section>
      <div>
        <Title
          title="Browse Categories"
          description="Explore marketplace categories and jump straight to what you need."
        />

        <div>
          <PrimaryCarousel
            items={marketplaceCategories}
            responsive={{
              mobile: 2,
              tablet: 3,
              desktop: 5,
            }}
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