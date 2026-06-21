"use client";

import React, { useState, useEffect, useMemo } from "react";
import { allowedPageType } from "@/types/CommonType";
import { useParams, useRouter } from "next/navigation";
import { getMarketplaceProducts } from "@/ulity/marketplaceProducts";
import ProductCard from "@/components/marketplace/ProductCard";
import { marketplaceCategories } from "@/data/category";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  Store,
  Grid,
  List,
  Info,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type SearchContainerProps = {
  pageType: allowedPageType;
};

export default function SearchContainer({ pageType }: SearchContainerProps) {
  const router = useRouter();
  const params = useParams();
  const activeCategorySlug = params.id as string || "all";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load products
  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const fetched = await getMarketplaceProducts();
        if (isMounted) {
          setProducts(fetched || []);
        }
      } catch (err) {
        console.error("Failed to load products in search:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered and sorted products
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category slug if not "all"
    if (activeCategorySlug && activeCategorySlug !== "all") {
      list = list.filter((p) => p.category?.toLowerCase() === activeCategorySlug.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Filter by min price
    if (minPrice) {
      const minVal = parseFloat(minPrice);
      if (!isNaN(minVal)) {
        list = list.filter((p) => p.price >= minVal);
      }
    }

    // Filter by max price
    if (maxPrice) {
      const maxVal = parseFloat(maxPrice);
      if (!isNaN(maxVal)) {
        list = list.filter((p) => p.price <= maxVal);
      }
    }

    // Filter by condition
    if (condition !== "all") {
      list = list.filter((p) => {
        const cond = (p as any).condition || "new";
        return cond.toLowerCase() === condition.toLowerCase();
      });
    }

    // Sort products
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.productName || "").localeCompare(b.productName || ""));
    }

    return list;
  }, [products, activeCategorySlug, searchQuery, minPrice, maxPrice, condition, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setCondition("all");
    setSortBy("newest");
  };

  const activeCategoryName = useMemo(() => {
    if (activeCategorySlug === "all") return "All Categories";
    const found = marketplaceCategories.find((c) => c.slug === activeCategorySlug);
    return found ? found.name : activeCategorySlug.replace("-", " ");
  }, [activeCategorySlug]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white py-12 px-6 shadow-sm border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight capitalize flex items-center gap-2">
              Browse Marketplace <Store className="h-6 w-6 text-amber-500" />
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Find premium parts, riding gear, tools, and accessories. Category:{" "}
              <span className="text-white font-bold">{activeCategoryName}</span>
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <Input
              placeholder="Search products in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 rounded-xl bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Side Filter Bar */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Category Filter List */}
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <CardHeader className="py-4 px-5 border-b dark:border-slate-800">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1">
                  <button
                    onClick={() => router.push("/marketplace/search/all")}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition ${
                      activeCategorySlug === "all"
                        ? "bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>All Products</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  {marketplaceCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => router.push(`/marketplace/search/${cat.slug}`)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition ${
                        activeCategorySlug === cat.slug
                          ? "bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filter controls */}
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <CardHeader className="py-4 px-5 border-b dark:border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advanced Filters</CardTitle>
                <Button variant="ghost" onClick={handleResetFilters} className="h-6 text-[10px] text-red-500 px-2 font-bold hover:bg-red-50 dark:hover:bg-red-950/20">
                  Reset All
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Price range */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price Range (PKR)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="rounded-lg h-9 text-xs"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="rounded-lg h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Condition</SelectItem>
                      <SelectItem value="new">Brand New</SelectItem>
                      <SelectItem value="used-like-new">Used - Like New</SelectItem>
                      <SelectItem value="used">Used - Good</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right Column: Listings grid / list */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Found <span className="font-bold text-slate-900 dark:text-white">{processedProducts.length}</span> matching products
              </div>
              
              <div className="flex items-center gap-3 justify-end">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-8 text-xs w-36">
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest Listed</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Product Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border dark:border-slate-850 shrink-0">
                  <Button
                    size="icon"
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    className="h-7 w-7 rounded-md p-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={viewMode === "list" ? "default" : "ghost"}
                    className="h-7 w-7 rounded-md p-0"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading state skeleton */}
            {loading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            ) : processedProducts.length === 0 ? (
              /* Empty state */
              <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 max-w-xl mx-auto mt-6">
                <SlidersHorizontal className="h-10 w-10 text-slate-355 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">No products match your criteria</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Try adjusting your filter options, changing categories, or resetting the search keywords.
                </p>
                <Button size="sm" onClick={handleResetFilters} className="mt-4">
                  Reset Search Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid Layout */
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {processedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} isLandingPage={true} />
                ))}
              </div>
            ) : (
              /* List Layout */
              <div className="space-y-4">
                {processedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/marketplace/product/${p.id}`)}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 hover:shadow-md cursor-pointer transition"
                  >
                    <div className="relative w-full sm:w-44 h-32 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden shrink-0">
                      <img
                        src={p.imageurl?.url || "/images/logos/segalmotors.jpg"}
                        alt={p.productName}
                        className="w-full h-full object-contain p-2"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[8px] font-bold rounded px-1.5 py-0.5 uppercase border border-white/10">
                        {p.condition || "New"}
                      </span>
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{p.productName}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {p.description || "No product description provided."}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-2 border-t dark:border-slate-800">
                        <span className="font-extrabold text-sm text-primary">PKR {p.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span className="text-[10px] text-slate-450">{p.owner?.location?.city || "Lahore"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
