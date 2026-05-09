import { marketplaceCategories } from "@/data/category";

export function getMarketplaceCategoryName(categorySlug?: string | null) {
  if (!categorySlug) {
    return "";
  }

  const category = marketplaceCategories.find(
    (item) => item.slug === categorySlug,
  );

  return category?.name ?? categorySlug;
}
