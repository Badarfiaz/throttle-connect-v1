"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { marketplaceCategories, networkingCategories } from "@/data/category";
import {
  GET_PRODUCTS_PAGINATED_QUERY,
} from "@/app/graphql/marketplace";
import {
  GET_CLUBS_PAGINATED_QUERY,
} from "@/app/graphql/networking";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import { MarketplaceProduct } from "@/types/marketplace";
import SearchResults, { SearchResultItem } from "./SearchResults";
import SearchSkeleton from "./SearchSkeleton";
import EmptyState from "./EmptyState";
import {
  ChevronRight,
  Loader2,
  Search,
  SlidersHorizontal,
  Store,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SearchPageType = "marketplace" | "networking";

type SearchPageProps = {
  type: SearchPageType;
  /** The active category slug (from the URL query param or segment) */
  category?: string | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PAGE_LIMIT = 10;

function slugToLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SearchPage({ type, category }: SearchPageProps) {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isMarketplace = type === "marketplace";
  const categories = isMarketplace ? marketplaceCategories : networkingCategories;
  const categoryLabel =
    category
      ? categories.find((c) => c.slug === category)?.name ?? slugToLabel(category)
      : `All ${isMarketplace ? "Products" : "Clubs"}`;

  // ------------------------------------------------------------------
  // Paginated data via shared hook
  // ------------------------------------------------------------------
console.log('search page')
  const {
    items: rawItems,
    pagination,
    loading,
    loadingMore,
    error,
    search,
    loadMore,
  } = useSearchPagination<any>(
    isMarketplace ? "products" : "clubs",
    isMarketplace ? GET_PRODUCTS_PAGINATED_QUERY : GET_CLUBS_PAGINATED_QUERY,
    {
      where: category ? { category } : {},
    },
    PAGE_LIMIT,
  );

  // ------------------------------------------------------------------
  // Client-side text search on top of server results
  // ------------------------------------------------------------------
  const [textQuery, setTextQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Kick off initial fetch when category changes
  useEffect(() => {
    search({ where: category ? { category } : {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Map raw items to SearchResultItem union
  const searchResultItems: SearchResultItem[] = rawItems
    .filter((item: any) => {
      if (!textQuery.trim()) return true;
      const q = textQuery.toLowerCase();
      if (isMarketplace) {
        return (
          item.productName?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
        );
      }
      return (
        item.clubName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    })
    .sort((a: any, b: any) => {
      if (isMarketplace) {
        if (sortBy === "price-low") return (a.price ?? 0) - (b.price ?? 0);
        if (sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
        if (sortBy === "name")
          return (a.productName ?? "").localeCompare(b.productName ?? "");
      }
      return 0; // default: server order (newest)
    })
    .map((item: any): SearchResultItem =>
      isMarketplace
        ? { kind: "marketplace", data: item as MarketplaceProduct }
        : { kind: "networking", data: item },
    );

  // Category navigation helper
  const navigateToCategory = useCallback(
    (slug: string | null) => {
      const base = isMarketplace ? "/marketplace/search" : "/networking/search";
      if (slug) {
        router.push(`${base}?category=${slug}`);
      } else {
        router.push(base);
      }
    },
    [isMarketplace, router],
  );

  // ------------------------------------------------------------------
  // Intersection observer for auto load-more (optional enhancement)
  // ------------------------------------------------------------------
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && pagination?.hasNextPage && !loading && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pagination, loading, loadingMore, loadMore]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  const Icon = isMarketplace ? Store : Users;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24">
      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white py-12 px-6 shadow-sm border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight capitalize flex items-center gap-2">
              {isMarketplace ? "Browse Marketplace" : "Browse Clubs"}{" "}
              <Icon className="h-6 w-6 text-amber-500" />
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {isMarketplace
                ? "Find premium parts, riding gear, tools, and accessories."
                : "Discover automotive clubs that match your passion."}{" "}
              <span className="text-white font-bold">{categoryLabel}</span>
            </p>

            {/* Pagination summary */}
            {pagination && (
              <p className="text-xs text-slate-500 mt-1">
                Showing {rawItems.length} of {pagination.totalCount}{" "}
                {isMarketplace ? "products" : "clubs"}
              </p>
            )}
          </div>

          {/* Live text search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <Input
              id="search-text-input"
              placeholder={
                isMarketplace
                  ? "Search products in this category..."
                  : "Search clubs in this category..."
              }
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              className="pl-10 pr-4 h-11 rounded-xl bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Left Sidebar ── */}
          <aside className="lg:col-span-3 space-y-5">
            {/* Category list */}
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <CardHeader className="py-4 px-5 border-b dark:border-slate-800">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isMarketplace ? "Market Categories" : "Club Categories"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1">
                  {/* "All" option */}
                  <button
                    id="category-all"
                    onClick={() => navigateToCategory(null)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition",
                      !category
                        ? "bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                    )}
                  >
                    <span>All {isMarketplace ? "Products" : "Clubs"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      id={`category-${cat.slug}`}
                      onClick={() => navigateToCategory(cat.slug)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition",
                        category === cat.slug
                          ? "bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      <span className="truncate">{cat.name}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sort (marketplace only) */}
            {isMarketplace && (
              <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="py-4 px-5 border-b dark:border-slate-800">
                  <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sort By
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-select" className="h-9 text-xs">
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest Listed</SelectItem>
                      <SelectItem value="price-low">Price: Low → High</SelectItem>
                      <SelectItem value="price-high">Price: High → Low</SelectItem>
                      <SelectItem value="name">Product Name</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Active filter badge */}
            {category && (
              <div className="flex flex-wrap gap-2 px-1">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold border-slate-300 dark:border-slate-700"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  {categoryLabel}
                  <button
                    aria-label="Remove category filter"
                    onClick={() => navigateToCategory(null)}
                    className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </aside>

          {/* ── Main results area ── */}
          <main className="lg:col-span-9 space-y-6">
            {/* Results summary bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-xl shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {loading ? (
                  "Fetching results…"
                ) : (
                  <>
                    Found{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {pagination?.totalCount ?? 0}
                    </span>{" "}
                    {isMarketplace ? "products" : "clubs"}
                    {textQuery && (
                      <>
                        {" "}
                        — <span className="text-primary">{searchResultItems.length}</span>{" "}
                        match your search
                      </>
                    )}
                  </>
                )}
              </span>
            </div>

            {/* Content */}
            {loading ? (
              <SearchSkeleton count={6} />
            ) : error ? (
              <div className="text-center py-20 px-6 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Failed to load results
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  {error}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() =>
                    search({ where: category ? { category } : {} })
                  }
                >
                  Retry
                </Button>
              </div>
            ) : searchResultItems.length === 0 ? (
              <EmptyState
                type={type}
                category={category}
                onReset={() => navigateToCategory(null)}
              />
            ) : (
              <>
                <SearchResults items={searchResultItems} />

                {/* Load More / Infinite scroll sentinel */}
                <div ref={loadMoreRef} className="mt-6 flex justify-center">
                  {loadingMore ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more…
                    </div>
                  ) : pagination?.hasNextPage ? (
                    <Button
                      id="load-more-btn"
                      variant="outline"
                      className="rounded-xl font-semibold px-8"
                      onClick={loadMore}
                    >
                      Load More
                    </Button>
                  ) : (
                    rawItems.length > 0 && (
                      <p className="text-xs text-slate-400 dark:text-slate-600 font-medium py-4">
                        All {isMarketplace ? "products" : "clubs"} loaded ·{" "}
                        {pagination?.totalCount ?? 0} total
                      </p>
                    )
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
