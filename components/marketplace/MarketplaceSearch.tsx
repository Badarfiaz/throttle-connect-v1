"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Suggestion = {
  objectID: string;
  productName: string;
  price: number;
  category: string;
  imageUrl: string;
};

interface MarketplaceSearchProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  onSearchSubmit?: (val: string) => void;
}

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

export default function MarketplaceSearch({
  value,
  onChange,
  placeholder = "Search premium parts, accessories, and riding gear...",
  onSearchSubmit,
}: MarketplaceSearchProps) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync local query with prop value if provided
  useEffect(() => {
    if (value !== undefined) {
      setLocalQuery(value);
    }
  }, [value]);

  const { suggestions, loading } = useAlgoliaSuggestions(localQuery);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    setOpen(true);
    if (onChange) {
      onChange(val);
    }
  };

  const handleSearch = () => {
    if (localQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(localQuery.trim());
      } else {
        router.push(`/marketplace/search?query=${encodeURIComponent(localQuery.trim())}`);
      }
      setOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSelect = (s: Suggestion) => {
    router.push(`/marketplace/product/${s.objectID}`);
    setLocalQuery("");
    if (onChange) {
      onChange("");
    }
    setOpen(false);
  };

  const showDropdown = open && localQuery.trim().length > 0;

  return (
    <div className="w-full bg-white/95 dark:bg-slate-950/95 py-4 sticky top-[54px] md:top-[62px] z-40 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8" ref={wrapperRef}>
        <form onSubmit={handleSubmit} className="relative flex items-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-250 dark:border-slate-800 focus-within:border-blue-500/50 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-250 h-12 w-full shadow-xs">
          <Search size={18} className="text-slate-400 dark:text-slate-500 ml-4 shrink-0" />
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="w-full h-full bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-550 font-medium px-3"
          />
          
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery("");
                if (onChange) onChange("");
                setOpen(false);
              }}
              className="text-slate-400 hover:text-slate-600 mr-2 shrink-0 transition-colors"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className="h-9 mr-1.5 px-5 bg-[#0B2447] hover:bg-[#19376D] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-98 shrink-0"
          >
            <Search size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline text-xs">Search</span>
          </button>

          {/* Suggestions Dropdown */}
          {showDropdown && (
            <div className="absolute top-[52px] left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[360px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-555" />
                  Searching premium database…
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">No results found</div>
              ) : (
                <>
                  <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800">
                    Suggestions
                  </div>
                  {suggestions.map((s) => (
                    <button
                      key={s.objectID}
                      type="button"
                      onMouseDown={() => handleSelect(s)}
                      className="w-full flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-left transition-colors"
                    >
                      {s.imageUrl ? (
                        <img
                          src={s.imageUrl}
                          alt={s.productName}
                          className="w-10 h-10 object-contain rounded-lg shrink-0 bg-slate-100 dark:bg-slate-855 border border-slate-200/50 dark:border-slate-750"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                          <Search size={16} className="text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {s.productName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          PKR {s.price.toLocaleString()} · <span className="text-blue-600 dark:text-blue-400 capitalize">{s.category.replace(/-/g, " ")}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onMouseDown={handleSearch}
                    className="w-full flex items-center gap-2 px-4 py-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-[#19376D] dark:text-blue-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800/85 transition-colors text-left"
                  >
                    <Search size={14} />
                    See all results for &ldquo;{localQuery}&rdquo;
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
