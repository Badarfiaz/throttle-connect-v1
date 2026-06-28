"use client";
import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminUsers, AdminUser } from "@/hooks/admin/useAdminUsers";
import { usePagination } from "@/hooks/admin/usePagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Trash2, RefreshCw, MoreHorizontal, Shield, User, Store, Users2 } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";
import type { UserRole } from "@/types/CommonType";

export default function AdminUsersPage() {
  const { users, loading, error, fetchUsers, changeRole, deleteUser } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) =>
    [u.name, u.email, u.role].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const pagination = usePagination(filtered, 10);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Users" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
            <p className="text-sm text-slate-500 mt-1">{users.length} registered users</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email or role..."
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
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : pagination.paged.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.name} className="object-cover" />
                            ) : (
                              <AvatarFallback className="bg-[#19376D] text-white text-xs font-bold">
                                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{user.name ?? "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 max-w-[180px] truncate">{user.email ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "superAdmin" ? "default" : "secondary"}
                          className={user.role === "superAdmin" ? "bg-[#19376D] text-white gap-1" : "gap-1"}
                        >
                          {user.role === "superAdmin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {user.role === "superAdmin" ? "Super Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {user.hasMarketplace ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <Store className="h-3 w-3" /> Marketplace
                            </span>
                          ) : null}
                          {user.hasNetworking ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                              <Users2 className="h-3 w-3" /> Club
                            </span>
                          ) : null}
                          {!user.hasMarketplace && !user.hasNetworking && (
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {safeFormatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => changeRole(user.id, (user.role === "superAdmin" ? "user" : "superAdmin") as UserRole)}
                              >
                                {user.role === "superAdmin" ? (
                                  <><User className="h-4 w-4 mr-2" /> Demote to User</>
                                ) : (
                                  <><Shield className="h-4 w-4 mr-2" /> Promote to Super Admin</>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteTarget(user)}
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
                    No users found
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
        title="Delete User"
        description={`Are you sure you want to delete "${deleteTarget?.name ?? deleteTarget?.email}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteUser(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
