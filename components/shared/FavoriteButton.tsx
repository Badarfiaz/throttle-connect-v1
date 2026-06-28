"use client";

import React, { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAppSelector } from "@/app/redux/hooks";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  itemId: string;
  itemType: "product" | "service" | "club" | "store";
  itemData: {
    title: string;
    image?: string;
    details?: string;
    link: string;
  };
  className?: string;
  iconClassName?: string;
}

export default function FavoriteButton({
  itemId,
  itemType,
  itemData,
  className,
  iconClassName,
}: FavoriteButtonProps) {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || reduxUser?.userId;

  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Check if item is already favorited
  useEffect(() => {
    if (!userId || !itemId) {
      setLoading(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const favDocRef = doc(db, "favorites", `${userId}_${itemId}`);
        const favDoc = await getDoc(favDocRef);
        setIsFavorited(favDoc.exists());
      } catch (error) {
        console.error("Error checking favorite state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFavorite();
  }, [userId, itemId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("Sign In Required", {
        description: "Please log in to save items to your favorites.",
      });
      return;
    }

    setActionLoading(true);
    const favDocRef = doc(db, "favorites", `${userId}_${itemId}`);

    try {
      if (isFavorited) {
        // Remove from favorites
        await deleteDoc(favDocRef);
        setIsFavorited(false);
        toast.success("Removed from Favorites", {
          description: `"${itemData.title}" has been removed.`,
        });
      } else {
        // Add to favorites
        await setDoc(favDocRef, {
          id: `${userId}_${itemId}`,
          userId,
          itemId,
          itemType,
          title: itemData.title,
          image: itemData.image || "",
          details: itemData.details || "",
          link: itemData.link,
          createdAt: new Date().toISOString(),
        });
        setIsFavorited(true);
        toast.success("Added to Favorites", {
          description: `"${itemData.title}" has been saved.`,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Operation Failed", {
        description: "An error occurred while updating your favorites. Please try again.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn("h-9 w-9 rounded-full bg-background/80 backdrop-blur-xs border border-border/50", className)}
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/50" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={actionLoading}
      className={cn(
        "h-9 w-9 rounded-full bg-background/85 backdrop-blur-xs border border-border/50 shadow-xs transition-all hover:bg-background hover:scale-105 active:scale-95 duration-200 group",
        isFavorited ? "border-rose-200 bg-rose-50/50 hover:bg-rose-50" : "",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4.5 w-4.5 transition-colors duration-200",
          isFavorited
            ? "fill-rose-500 text-rose-500 animate-pulse"
            : "text-muted-foreground group-hover:text-rose-500",
          iconClassName
        )}
      />
    </Button>
  );
}
