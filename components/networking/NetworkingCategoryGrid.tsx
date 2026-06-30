"use client";

import Image from "next/image";
import Link from "next/link";
import Title from "@/components/shared/Title";
import { networkingCategories } from "@/data/category";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";

type CategoryCardProps = {
  name: string;
  slug: string;
  imageUrl: string | null;
};

function CategoryGridCard({ name, slug, imageUrl }: CategoryCardProps) {
  return (
    <Link
      href={`/networking/search?category=${slug}`}
      className="flex flex-col items-center group w-full"
    >
      <div className="w-[88px] h-[88px] md:w-[104px] md:h-[104px] bg-[#f2f4f5] rounded-[24px] flex items-center justify-center mb-3 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:-translate-y-1 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={64}
            height={64}
            className="object-contain z-10 transition-transform duration-300 group-hover:scale-110 mix-blend-multiply"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full z-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span className="text-[13px] md:text-sm font-semibold text-center text-[#002f34] leading-tight w-full max-w-[104px] break-words transition-colors duration-200 group-hover:text-primary">
        {name}
      </span>
    </Link>
  );
}

export default function NetworkingCategoryGrid() {
  // Group categories into arrays of 2 for the 2-row carousel
  const groupedCategories = [];
  for (let i = 0; i < networkingCategories.length; i += 2) {
    groupedCategories.push(networkingCategories.slice(i, i + 2));
  }

  return (
    <section className="mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title
          title="Browse Categories"
          description="Explore automotive networking club categories and find your community."
        />

        <div className="mt-8 relative category-carousel">
          <PrimaryCarousel
            items={groupedCategories}
            responsive={{
              mobile: 2,
              tablet: 3,
              desktop: 6,
            }}
            className="w-full"
            renderItem={(group) => (
              <div className="flex flex-col gap-y-8 px-2 py-4">
                {group.map((category) => (
                  <CategoryGridCard
                    key={category.slug}
                    name={category.name}
                    slug={category.slug}
                    imageUrl={category.imageUrl}
                  />
                ))}
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
