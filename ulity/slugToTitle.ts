import { marketplaceCategories } from "@/data/category";

export const slugToTitle = (slug: string): string => {
  const match = marketplaceCategories.find((cat) => cat.slug === slug);

  return match?.name || slug;
};
