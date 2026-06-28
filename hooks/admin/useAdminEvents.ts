"use client";
import { useState, useCallback } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";

export type AdminEvent = {
  id: string;
  title?: string;
  clubId?: string;
  clubName?: string;
  organizerUid?: string;
  city?: string;
  coverImage?: string;
  startDateTime?: unknown;
  endDateTime?: unknown;
  status?: string;
  eventType?: string;
  participantCount?: number;
  featured?: boolean;
  createdAt?: unknown;
  views?: number;
  clicks?: number;
};

export function useAdminEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Events live in the top-level "events" collection
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: AdminEvent[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AdminEvent, "id">),
      }));
      setEvents(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch events";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (eventId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "events", eventId), { featured: !current });
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, featured: !current } : e)),
      );
      toast.success(`Event ${!current ? "featured" : "unfeatured"}`);
    } catch {
      toast.error("Failed to update featured status");
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
    }
  }, []);

  return { events, loading, error, fetchEvents, toggleFeatured, deleteEvent };
}
