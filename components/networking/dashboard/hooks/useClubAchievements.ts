"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, query, onSnapshot, doc, runTransaction } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type AchievementFormValues = {
  title: string;
  description: string;
  awardType: "trophy" | "car" | "bike" | "milestone" | "other";
  date: string;
};

export function useClubAchievements(clubId: string | undefined, userId: string | undefined) {
  const [achievementsList, setAchievementsList] = useState<any[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<any | null>(null);
  const [savingAchievement, setSavingAchievement] = useState(false);

  const achievementForm = useForm<AchievementFormValues>({
    defaultValues: {
      title: "",
      description: "",
      awardType: "trophy",
      date: "",
    }
  });

  // Fetch achievements
  useEffect(() => {
    if (!clubId) return;
    setLoadingAchievements(true);
    const q = query(
      collection(db, "networkingStores", clubId, "achievements")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a: any, b: any) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""));
      setAchievementsList(list);
      setLoadingAchievements(false);
    }, (error) => {
      console.error("Error fetching achievements:", error);
      setLoadingAchievements(false);
    });
    return () => unsubscribe();
  }, [clubId]);

  // Reset form when editingAchievement changes
  useEffect(() => {
    if (editingAchievement) {
      achievementForm.reset({
        title: editingAchievement.title || "",
        description: editingAchievement.description || "",
        awardType: editingAchievement.awardType || "trophy",
        date: editingAchievement.date || "",
      });
    } else {
      achievementForm.reset({
        title: "",
        description: "",
        awardType: "trophy",
        date: "",
      });
    }
  }, [editingAchievement, achievementForm]);

  const handleSaveAchievement = achievementForm.handleSubmit(async (values) => {
    if (!clubId || !userId) return;
    setSavingAchievement(true);
    try {
      const isEdit = !!editingAchievement;
      const achievementRef = isEdit 
        ? doc(db, "networkingStores", clubId, "achievements", editingAchievement.id)
        : doc(collection(db, "networkingStores", clubId, "achievements"));
      const achId = achievementRef.id;

      const achievementData = {
        id: achId,
        title: values.title.trim(),
        description: values.description.trim(),
        awardType: values.awardType,
        date: values.date || new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),
        createdAt: isEdit ? (editingAchievement.createdAt || new Date().toISOString()) : new Date().toISOString(),
      };

      await runTransaction(db, async (transaction) => {
        if (isEdit) {
          transaction.update(achievementRef, achievementData);
        } else {
          transaction.set(achievementRef, achievementData);
        }
      });

      toast.success(isEdit ? "Achievement Updated" : "Achievement Added", {
        description: isEdit ? "Your achievement has been updated successfully." : "Your achievement has been added successfully."
      });
      
      setIsAchievementModalOpen(false);
      setEditingAchievement(null);
    } catch (e: any) {
      console.error("Error saving achievement", e);
      toast.error(e.message || "Failed to save achievement");
    } finally {
      setSavingAchievement(false);
    }
  });

  const handleDeleteAchievement = async (achId: string) => {
    if (!clubId) return;
    if (!confirm("Are you sure you want to delete this achievement? This action cannot be undone.")) return;
    
    try {
      const achievementRef = doc(db, "networkingStores", clubId, "achievements", achId);
      await runTransaction(db, async (transaction) => {
        transaction.delete(achievementRef);
      });

      toast.success("Achievement Deleted", {
        description: "Achievement has been deleted successfully."
      });
    } catch (e: any) {
      console.error("Error deleting achievement", e);
      toast.error(e.message || "Failed to delete achievement");
    }
  };

  return {
    achievementsList,
    loadingAchievements,
    isAchievementModalOpen,
    setIsAchievementModalOpen,
    editingAchievement,
    setEditingAchievement,
    savingAchievement,
    handleSaveAchievement,
    handleDeleteAchievement,
    achievementForm,
  };
}
