import { useCallback, useRef, useState } from "react";
import { FETCHER_URL } from "@/lib/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaginationInfo = {
  page: number;
  limit: number;
  totalCount: number;
  hasNextPage: boolean;
};

export type SearchPageType = "marketplace" | "networking";

type GraphQLResult<T> = {
  data?: T;
  errors?: unknown;
};

// ---------------------------------------------------------------------------
// Generic paginated hook
// ---------------------------------------------------------------------------

/**
 * useSearchPagination — a generic hook that fetches a paginated GraphQL query
 * and exposes `items`, `pagination`, `loading`, `error`, `loadMore`, and `reset`.
 *
 * Usage:
 *   const { items, pagination, loading, loadMore } = useSearchPagination<MyType>(
 *     "products",          // The GraphQL root field name
 *     GET_PRODUCTS_PAGINATED_QUERY,
 *     { where: { category: "oils-and-fluids" } },
 *     10
 *   );
 */
export function useSearchPagination<TItem>(
  /** The root key in the GraphQL response data (e.g. "products" or "clubs") */
  rootField: string,
  /** The full GraphQL query string */
  query: string,
  /** Initial variables (will be merged with page/limit) */
  initialVariables: Record<string, unknown>,
  /** Items per page — default 10 */
  limit = 10,
) {
  const [items, setItems] = useState<TItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentPage = useRef(1);
  const variablesRef = useRef(initialVariables);

  const fetchPage = useCallback(
    async (page: number, append = false) => {
      console.log('first')
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await fetch(FETCHER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            variables: {
              ...variablesRef.current,
              page,
              limit,
            },
          }),
        });

        const result = (await res.json()) as GraphQLResult<Record<string, unknown>>;
        console.log('result', result);
        if (!res.ok || result.errors) {
          const msg =
            result.errors
              ? JSON.stringify(result.errors, null, 2)
              : "Request failed.";
          throw new Error(msg);
        }

        const pageData = result.data?.[rootField] as {
          items: TItem[];
          pagination: PaginationInfo;
        };

        if (!pageData) throw new Error("Unexpected response structure.");

        currentPage.current = page;
        setPagination(pageData.pagination);

        if (append) {
          setItems((prev) => [...prev, ...pageData.items]);
        } else {
          setItems(pageData.items);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, rootField, limit],
  );

  /** Kick off a fresh search (resets to page 1). Call when variables change. */
  const search = useCallback(
    (variables: Record<string, unknown>) => {
      variablesRef.current = variables;
      currentPage.current = 1;
      setItems([]);
      setPagination(null);
      fetchPage(1, false);
    },
    [fetchPage],
  );

  /** Append next page to existing results. */
  const loadMore = useCallback(() => {
    if (!pagination?.hasNextPage || loading || loadingMore) return;
    fetchPage(currentPage.current + 1, true);
  }, [pagination, loading, loadingMore, fetchPage]);

  /** Reset the hook state */
  const reset = useCallback(() => {
    setItems([]);
    setPagination(null);
    setError(null);
    currentPage.current = 1;
  }, []);

  return {
    items,
    pagination,
    loading,
    loadingMore,
    error,
    search,
    loadMore,
    reset,
  };
}
