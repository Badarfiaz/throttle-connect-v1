"use client";
import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminStores, AdminStore } from "@/hooks/admin/useAdminStores";
import { usePagination } from "@/hooks/admin/usePagination";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Trash2, Eye, RefreshCw, Store } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";
import Link from "next/link";

export default function AdminStoresPage() {
  const { stores, loading, error, fetchStores, toggleFeatured, deleteStore } = useAdminStores();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminStore | null>(null);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const filtered = stores.filter((s) =>
    [s.title, s.email, s.location?.city].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const pagination = usePagination(filtered, 10);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Marketplace Stores" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Marketplace Stores</h1>
            <p className="text-sm text-slate-500 mt-1">{stores.length} stores registered</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchStores} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search stores by name, email, city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); pagination.goTo(1); }}
            className="pl-9"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>Store</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : pagination.paged.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            {store.logoUrl ? (
                              <img src={store.logoUrl} alt={store.title} className="object-cover" />
                            ) : (
                              <AvatarFallback className="bg-[#19376D] text-white text-xs font-bold">
                                {store.title?.charAt(0) ?? <Store className="h-4 w-4" />}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{store.title ?? "—"}</p>
                            <p className="text-xs text-slate-400">{store.email ?? "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {store.businessType?.slice(0, 2).map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                        {[store.location?.city, store.location?.country].filter(Boolean).join(", ") || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!store.featured}
                            onCheckedChange={() => toggleFeatured(store.id, !!store.featured)}
                          />
                          <FeaturedBadge featured={!!store.featured} />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {safeFormatDate(store.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {store.slugUrl && (
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                              <Link href={`/marketplace/storeProfile/${store.slugUrl}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteTarget(store)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                    No stores found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <AdminPagination {...pagination} />
        </div>
      </main>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Store"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteStore(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
