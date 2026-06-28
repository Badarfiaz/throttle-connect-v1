"use client";
import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminNotes, AdminNote } from "@/hooks/admin/useAdminNotes";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, RefreshCw, StickyNote } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";

export default function AdminNotesPage() {
  const { notes, loading, saving, fetchNotes, createNote, updateNote, deleteNote } = useAdminNotes();
  const user = useSelector((s: RootState) => s.auth.user);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<AdminNote | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminNote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const filtered = notes.filter((n) =>
    [n.title, n.description].some((f) => f?.toLowerCase().includes(search.toLowerCase())),
  );

  const openCreate = () => {
    setEditTarget(null);
    setTitle("");
    setDescription("");
    setDialogOpen(true);
  };

  const openEdit = (note: AdminNote) => {
    setEditTarget(note);
    setTitle(note.title);
    setDescription(note.description);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    if (editTarget) {
      await updateNote(editTarget.id, title, description);
    } else {
      await createNote(title, description, user?.name ?? user?.email ?? "Admin");
    }
    setDialogOpen(false);
    setTitle("");
    setDescription("");
    setEditTarget(null);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Notes" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Notes</h1>
            <p className="text-sm text-slate-500 mt-1">{notes.length} notes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchNotes} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
            <Button size="sm" onClick={openCreate} className="gap-2 bg-[#19376D] hover:bg-[#0B2447]">
              <Plus className="h-4 w-4" /> New Note
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <StickyNote className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-medium">No notes yet</p>
            <p className="text-sm">Create your first note to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((note) => (
              <Card key={note.id} className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{note.title}</h3>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(note)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => setDeleteTarget(note)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{note.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{note.createdBy}</span>
                    <span>{safeFormatDate(note.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Note" : "Create Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Note details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !title.trim()} className="bg-[#19376D] hover:bg-[#0B2447]">
              {saving ? "Saving..." : editTarget ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Note"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) deleteNote(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
