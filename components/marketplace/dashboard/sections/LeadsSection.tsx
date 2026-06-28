"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useLeads, Lead } from "@/hooks/useLeads";
import { usePagination } from "@/hooks/admin/usePagination";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { safeFormatDate } from "@/lib/utils";
import {
  Phone,
  Mail,
  Package,
  ArrowUpRight,
  RefreshCw,
  Users,
} from "lucide-react";

type Props = {
  products: { id: string; productName: string }[];
};

export default function LeadsSection({ products }: Props) {
  const { leads, loading, fetchLeads } = useLeads();
  const pagination = usePagination(leads, 5);

  useEffect(() => {
    fetchLeads(products.map((p) => p.id));
  }, [products.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const productIds = products.map((p) => p.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Product Leads
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Users who viewed your product listings
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchLeads(productIds)}
          className="gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Users className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-base font-semibold">No leads yet</p>
          <p className="text-sm mt-1 text-center max-w-xs">
            When users open your product listings, their info will appear here.
          </p>
        </div>
      )}

      {/* Lead cards */}
      {!loading && leads.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagination.paged.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
          {leads.length > 5 && <AdminPagination {...pagination} />}
        </>
      )}
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-4">
        {/* Buyer info */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-[#19376D] text-white font-bold text-sm flex items-center justify-center shrink-0">
            {(lead.clickerName || lead.clickerEmail)?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {lead.clickerName || "—"}
            </p>
            <p className="text-xs text-slate-400">{safeFormatDate(lead.viewedAt)}</p>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{lead.clickerEmail || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{lead.clickerPhone || "—"}</span>
          </div>
        </div>

        {/* Product viewed */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-slate-400" />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate flex-1">
            {lead.productTitle || "—"}
          </span>
          <Link
            href={`/marketplace/product/${lead.productId}`}
            target="_blank"
            className="shrink-0"
          >
            <Button size="icon" variant="ghost" className="h-7 w-7 text-[#19376D]">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
