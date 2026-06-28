"use client";
import { useState, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";

export type AdminNote = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};

export function useAdminNotes() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: AdminNote[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title ?? "",
          description: data.description ?? "",
          createdBy: data.createdBy ?? "Admin",
          createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? "",
          updatedAt: data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt ?? "",
        };
      });
      setNotes(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch notes";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (title: string, description: string, createdBy: string) => {
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title,
        description,
        createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const newNote: AdminNote = {
        id: docRef.id,
        title,
        description,
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      toast.success("Note created");
      return newNote;
    } catch {
      toast.error("Failed to create note");
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, title: string, description: string) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "notes", noteId), {
        title,
        description,
        updatedAt: serverTimestamp(),
      });
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, title, description, updatedAt: new Date().toISOString() } : n,
        ),
      );
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    try {
      await deleteDoc(doc(db, "notes", noteId));
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  }, []);

  return { notes, loading, saving, error, fetchNotes, createNote, updateNote, deleteNote };
}
