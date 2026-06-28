import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasPrev: boolean;
  hasNext: boolean;
  prev: () => void;
  next: () => void;
  goTo: (p: number) => void;
}

export function AdminPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  hasPrev,
  hasNext,
  prev,
  next,
  goTo,
}: AdminPaginationProps) {
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  // Build page numbers to show: always show first, last, current ±1, with "…" gaps
  const pages: (number | "…")[] = [];
  const add = (n: number) => {
    if (!pages.includes(n)) pages.push(n);
  };

  add(1);
  if (page - 2 > 2) pages.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i);
  if (page + 2 < totalPages - 1) pages.push("…");
  if (totalPages > 1) add(totalPages);

  return (
    <div className="flex items-center justify-between px-2 py-3 border-t border-slate-200/60 dark:border-slate-800">
      <span className="text-xs text-slate-400">
        Showing <span className="font-semibold text-slate-600 dark:text-slate-300">{from}–{to}</span> of{" "}
        <span className="font-semibold text-slate-600 dark:text-slate-300">{totalItems}</span>
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!hasPrev}
          onClick={prev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-400 select-none">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "ghost"}
              size="icon"
              className={`h-7 w-7 text-xs ${p === page ? "bg-[#0B2447] text-white hover:bg-[#19376D]" : ""}`}
              onClick={() => goTo(p)}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!hasNext}
          onClick={next}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
