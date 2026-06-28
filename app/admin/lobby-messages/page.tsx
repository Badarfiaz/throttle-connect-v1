"use client";

import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { usePagination } from "@/hooks/admin/usePagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Trash2, ExternalLink } from "lucide-react";
import { db } from "@/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";

interface LobbyMessage {
  id: string;
  text: string;
  imageUrl?: string;
  senderUid: string;
  senderName: string;
  senderEmail: string;
  createdAt: any;
}

export default function AdminLobbyMessagesPage() {
  const [messages, setMessages] = useState<LobbyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<LobbyMessage | null>(null);

  // Subscribe to real-time messages in Firestore
  useEffect(() => {
    const q = query(collection(db, "networkingDiscussion"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: LobbyMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          text: data.text || "",
          imageUrl: data.imageUrl,
          senderUid: data.senderUid || "",
          senderName: data.senderName || "Enthusiast",
          senderEmail: data.senderEmail || "",
          createdAt: data.createdAt,
        });
      });
      setMessages(fetched);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching lobby messages:", err);
      toast.error("Failed to load lobby messages.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "networkingDiscussion", id));
      toast.success("Message deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting message:", err);
      toast.error("Failed to delete message.");
    }
  };

  const filtered = messages.filter((m) =>
    [m.senderName, m.senderEmail, m.text].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const pagination = usePagination(filtered, 10);

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Lobby Messages" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lobby Messages</h1>
            <p className="text-sm text-slate-500 mt-1">{messages.length} total messages in global lobby</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by sender, email or message content..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); pagination.goTo(1); }}
            className="pl-9"
          />
        </div>

        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>Sender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="max-w-[300px]">Message</TableHead>
                <TableHead>Attachment</TableHead>
                <TableHead>Posted At</TableHead>
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
                : pagination.paged.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarFallback className="bg-[#19376D] text-white text-xs font-bold">
                              {msg.senderName?.charAt(0)?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{msg.senderName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 truncate max-w-[150px]">{msg.senderEmail ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-750 dark:text-slate-300 max-w-[300px] truncate" title={msg.text}>
                        {msg.text || <span className="text-slate-400 italic">No text</span>}
                      </TableCell>
                      <TableCell>
                        {msg.imageUrl ? (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                              <img src={msg.imageUrl} alt="Attachment" className="w-full h-full object-cover" />
                            </div>
                            <a
                              href={msg.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {formatDateTime(msg.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(msg)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                    No messages found
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
        title="Delete Message"
        description="Are you sure you want to delete this message from the global lobby? This will permanently remove it for all users."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) handleDeleteMessage(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
