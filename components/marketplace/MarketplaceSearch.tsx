"use client";

import { MapPin, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const popularCities = [
  "Pakistan",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Multan",
  "Quetta",
  "Faisalabad",
];

type Suggestion = {
  objectID: string;
  productName: string;
  price: number;
  category: string;
  imageUrl: string;
};

function useAlgoliaSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/algolia/search?query=${encodeURIComponent(query)}&hitsPerPage=6`,
        );
        const data = await res.json();
        const hits: Suggestion[] = (data.hits ?? []).map((h: any) => ({
          objectID: h.objectID,
          productName: h.productName ?? "",
          price: h.price ?? 0,
          category: h.category ?? "",
          imageUrl: h["imageurl.url"] ?? "",
        }));
        setSuggestions(hits);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return { suggestions, loading };
}

export default function MarketplaceSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("Pakistan");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions, loading } = useAlgoliaSuggestions(query);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch() {
    if (query.trim()) {
      router.push(`/marketplace/search?query=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  function handleSelect(s: Suggestion) {
    router.push(`/marketplace/product/${s.objectID}`);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setOpen(false);
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div className="w-full bg-[#f2f4f5] py-5 sticky top-[40px] md:top-[68px] z-40 border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-2 md:gap-0">
        {/* Location Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-full md:w-[300px] h-[48px] bg-white border-2 border-gray-300 md:border-r-0 rounded md:rounded-none md:rounded-l flex items-center justify-between px-3 cursor-pointer hover:border-[#002f34] transition-colors focus:border-[#002f34] z-10 focus:outline-none">
              <div className="flex items-center gap-3 w-full">
                <MapPin size={20} className="text-[#3a77ff] min-w-[20px]" />
                <span className="w-full text-left text-[15px] bg-transparent text-[#002f34] truncate outline-none select-none">
                  {location}
                </span>
              </div>
              <ChevronDown size={24} className="text-[#002f34] min-w-[24px]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-[300px] max-h-[300px] overflow-y-auto">
            {popularCities.map((city) => (
              <DropdownMenuItem
                key={city}
                className="cursor-pointer text-[15px] text-[#002f34] py-2.5"
                onClick={() => setLocation(city)}
              >
                <MapPin size={16} className="text-gray-400 mr-2" />
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar with Suggestions */}
        <div className="flex w-full flex-1 h-[48px] relative" ref={wrapperRef}>
          <div className="flex-1 flex items-center bg-white border-2 border-r-0 border-gray-300 rounded-l md:rounded-none focus-within:border-[#002f34] focus-within:z-20 relative px-4 hover:border-[#002f34] transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Find Cars, Mobile Phones and more..."
              className="w-full h-full outline-none text-[15px] bg-transparent text-[#002f34] placeholder:text-gray-500"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setOpen(false); }}
                className="text-gray-400 hover:text-gray-600 ml-2 shrink-0"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="h-[48px] px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-r flex items-center justify-center gap-2 transition-colors z-10"
          >
            <Search size={22} className="text-white font-bold" strokeWidth={2.5} />
            <span className="hidden md:block text-base">Search</span>
          </button>

          {/* Suggestions Dropdown */}
          {showDropdown && (
            <div className="absolute top-[48px] left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 overflow-hidden">
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
              ) : suggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
              ) : (
                <>
                  {suggestions.map((s) => (
                    <button
                      key={s.objectID}
                      onMouseDown={() => handleSelect(s)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                    >
                      {s.imageUrl && (
                        <img
                          src={s.imageUrl}
                          alt={s.productName}
                          className="w-10 h-10 object-contain rounded shrink-0 bg-gray-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#002f34] truncate">
                          {s.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          PKR {s.price.toLocaleString()} · {s.category.replace(/-/g, " ")}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    onMouseDown={handleSearch}
                    className="w-full flex items-center gap-2 px-4 py-2.5 border-t border-gray-100 text-sm text-primary font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <Search size={14} />
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
