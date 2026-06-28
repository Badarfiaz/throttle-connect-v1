"use client";
import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminServices, AdminService } from "@/hooks/admin/useAdminServices";
import { usePagination } from "@/hooks/admin/usePagination";
import { AdminPagination } from "@/components/admin/AdminPagination";
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
import { Search, Trash2, RefreshCw, Wrench } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";

export default function AdminServicesPage() {
  const { services, loading, error, fetchServices, toggleFeatured, deleteService } = useAdminServices();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const filtered = services.filter((s) =>
    [s.title, s.serviceType, s.storeId].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const pagination = usePagination(filtered, 10);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Services" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
            <p className="text-sm text-slate-500 mt-1">{services.length} services across all stores</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchServices} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); pagination.goTo(1); }}
            className="pl-9"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : pagination.paged.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg border bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                            {service.imageUrl ? (
                              <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
                            ) : (
                              <Wrench className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{service.title ?? "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{service.serviceType ?? "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {service.price != null ? `PKR ${service.price}` : "—"}
                        {service.priceUnit && <span className="text-xs text-slate-400 ml-1">/{service.priceUnit}</span>}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={service.isAvailable ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {service.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!service.featured}
                            onCheckedChange={() => {
                              if (service.storeId) toggleFeatured(service.storeId, service.id, !!service.featured);
                            }}
                          />
                          <FeaturedBadge featured={!!service.featured} />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {safeFormatDate(service.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(service)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    No services found
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
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget?.storeId) deleteService(deleteTarget.storeId, deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
