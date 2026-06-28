"use client";
import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminClubs, AdminClub } from "@/hooks/admin/useAdminClubs";
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
import { Search, Trash2, Eye, RefreshCw } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";
import Link from "next/link";

export default function AdminClubsPage() {
  const { clubs, loading, error, fetchClubs, toggleFeatured, deleteClub } = useAdminClubs();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminClub | null>(null);

  useEffect(() => { fetchClubs(); }, [fetchClubs]);

  const filtered = clubs.filter((c) =>
    [c.clubName, c.city, c.clubType].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const pagination = usePagination(filtered, 10);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Clubs" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clubs</h1>
            <p className="text-sm text-slate-500 mt-1">{clubs.length} clubs registered</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchClubs} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search clubs..."
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
                <TableHead>Club</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Members</TableHead>
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
                : pagination.paged.map((club) => (
                    <TableRow key={club.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            {club.logoUrl ? (
                              <img src={club.logoUrl} alt={club.clubName} className="object-cover" />
                            ) : (
                              <AvatarFallback className="bg-[#19376D] text-white text-xs font-bold">
                                {club.clubName?.charAt(0) ?? "C"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{club.clubName ?? "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{club.clubType ?? "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">{club.city ?? "—"}</TableCell>
                      <TableCell className="text-sm font-medium">{club.memberCount ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!club.featured}
                            onCheckedChange={() => toggleFeatured(club.id, !!club.featured)}
                          />
                          <FeaturedBadge featured={!!club.featured} />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {safeFormatDate(club.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                            <Link href={`/networking/Club-Profile/${club.id}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteTarget(club)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    No clubs found
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
        title="Delete Club"
        description={`Are you sure you want to delete "${deleteTarget?.clubName}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteClub(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
