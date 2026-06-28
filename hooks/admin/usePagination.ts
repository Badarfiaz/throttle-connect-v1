import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Reset to page 1 whenever the list length changes (e.g. after search)
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  const prev = () => goTo(safePage - 1);
  const next = () => goTo(safePage + 1);

  return {
    paged,
    page: safePage,
    totalPages,
    totalItems: items.length,
    pageSize,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
    prev,
    next,
    goTo,
  };
}
