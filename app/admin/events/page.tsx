"use client";
import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminEvents, AdminEvent } from "@/hooks/admin/useAdminEvents";
import { usePagination } from "@/hooks/admin/usePagination";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Trash2, RefreshCw, Calendar } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";

export default function AdminEventsPage() {
  const { events, loading, error, fetchEvents, toggleFeatured, deleteEvent } = useAdminEvents();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const filtered = events.filter((e) =>
    [e.title, e.clubName, e.city, e.eventType].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const pagination = usePagination(filtered, 10);

  const statusColor = (status?: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-700 border-blue-200";
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "completed": return "bg-slate-100 text-slate-600 border-slate-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Events" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h1>
            <p className="text-sm text-slate-500 mt-1">{events.length} events total</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchEvents} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search events by title, club, city..."
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
                <TableHead>Event</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : pagination.paged.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg border bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                            {event.coverImage ? (
                              <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                              <Calendar className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white max-w-[160px] truncate">{event.title ?? "—"}</p>
                            <p className="text-xs text-slate-400">{event.city ?? "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300 max-w-[120px] truncate">{event.clubName ?? "—"}</TableCell>
                      <TableCell className="text-xs text-slate-500">{safeFormatDate(event.startDateTime)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(event.status)}`}>
                          {event.status ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{event.participantCount ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!event.featured}
                            onCheckedChange={() => toggleFeatured(event.id, !!event.featured)}
                          />
                          <FeaturedBadge featured={!!event.featured} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(event)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    No events found
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
        title="Delete Event"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteEvent(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
