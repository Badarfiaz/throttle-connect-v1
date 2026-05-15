"use client";

import React, { useEffect, useState, useRef } from "react";
import { searchWithTracking } from "@/lib/algoliaClient";

type Hit = {
  objectID: string;
  productName?: string;
  price?: string | number;
  imageurl?: { url?: string } | string;
  [k: string]: any;
};

export default function AlgoliaClientSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const c = new AbortController();
    abortRef.current = c;

    const doSearch = async () => {
      setLoading(true);
      try {
        const response = await searchWithTracking(
          {
            requests: [
              {
                indexName: "marketplace_products",
                params: `query=${encodeURIComponent(query)}&hitsPerPage=10`,
              },
            ],
          },
          { trigger: "autocomplete", source: "client" },
          c.signal as AbortSignal,
        );

        // If using the `search` method format, Algolia returns `results` per request
        const hits = Array.isArray(response?.results)
          ? (response.results[0]?.hits ?? [])
          : (response?.hits ?? []);
        setResults(hits);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        console.error("Search failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(doSearch, 200);
    return () => {
      clearTimeout(t);
      abortRef.current?.abort();
    };
  }, [query]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mt-3">
        {loading && (
          <div className="text-sm text-muted-foreground">Searching...</div>
        )}
        {!loading && results.length === 0 && query && (
          <div className="text-sm text-muted-foreground">No results</div>
        )}

        <ul className="mt-2 space-y-2">
          {results.map((hit) => (
            <li
              key={hit.objectID}
              className="flex items-center space-x-3 border rounded p-2"
            >
              <img
                src={
                  typeof hit.imageurl === "string"
                    ? hit.imageurl
                    : hit.imageurl?.url
                }
                alt={hit.productName || ""}
                className="w-12 h-12 object-cover rounded"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "/assets/placeholder.png")
                }
              />
              <div>
                <div className="font-medium">{hit.productName}</div>
                <div className="text-sm text-muted-foreground">{hit.price}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
