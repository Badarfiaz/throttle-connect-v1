"use client";

import { useState, useRef } from "react";
import { useAppDispatch } from "@/app/redux/hooks";
import { setNetworkingStore } from "@/app/redux/features/authSlice";
import { useNetworkingStore } from "@/hooks/useNetworkingStore";
import { uploadImage } from "@/ulity/imageUpload";
import { toast } from "sonner";

export function useClubGallery(club: any, user: any) {
  const dispatch = useAppDispatch();
  const { updateNetworkingStore } = useNetworkingStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const galleryList = club?.gallery || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!club?.id || !user?.userId) return;

    const remainingSlots = 10 - galleryList.length;
    if (remainingSlots <= 0) {
      toast.error("Gallery Limit Reached", {
        description: "You can upload a maximum of 10 gallery images.",
      });
      return;
    }

    const file = files[0];
    setUploading(true);
    try {
      // Upload image to Storage
      const { url } = await uploadImage(file, {
        ownerId: user.userId,
        folder: "gallery",
        basePath: "networkingStores",
      });

      // Add image to club's gallery array
      const newGallery = [...galleryList, url];
      const updated = await updateNetworkingStore(club.id, {
        gallery: newGallery,
      });

      if (updated) {
        dispatch(setNetworkingStore(updated));
        toast.success("Image Uploaded", {
          description: "Gallery moment added successfully.",
        });
      }
    } catch (err) {
      console.error("Error uploading gallery image:", err);
      toast.error("Upload Failed", {
        description: err instanceof Error ? err.message : "Could not upload image.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (imageUrl: string) => {
    if (!club?.id) return;
    if (!confirm("Are you sure you want to delete this moment from the gallery?")) return;

    try {
      const newGallery = galleryList.filter((url: string) => url !== imageUrl);
      const updated = await updateNetworkingStore(club.id, {
        gallery: newGallery,
      });

      if (updated) {
        dispatch(setNetworkingStore(updated));
        toast.success("Image Deleted", {
          description: "Gallery moment removed successfully.",
        });
      }
    } catch (err) {
      console.error("Error deleting gallery image:", err);
      toast.error("Delete Failed", {
        description: err instanceof Error ? err.message : "Could not delete image.",
      });
    }
  };

  return {
    galleryList,
    uploading,
    fileInputRef,
    handleUpload,
    handleDelete,
  };
}
