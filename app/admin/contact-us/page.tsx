"use client";
import { useEffect, useState } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { usePagination } from "@/hooks/admin/usePagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { RefreshCw, Search, Mail } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { Input } from "@/components/ui/input";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
};

export default function AdminContactUsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, "contact_us"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
      setMessages(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter((m) =>
    [m.name, m.email, m.subject].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const pagination = usePagination(filtered, 10);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Contact Us" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Us Messages</h1>
            <p className="text-sm text-slate-500 mt-1">{messages.length} total messages</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchMessages} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or subject..."
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
                <TableHead>Sender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                         <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : pagination.paged.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-white">{msg.name}</TableCell>
                      <TableCell className="text-sm text-slate-500">{msg.email}</TableCell>
                      <TableCell className="text-sm">{msg.subject}</TableCell>
                      <TableCell className="text-sm max-w-[300px] truncate">{msg.message}</TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {safeFormatDate(msg.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                    No messages found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <AdminPagination {...pagination} />
        </div>
      </main>
    </div>
  );
}
