"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/app/redux/hooks";
import { setNetworkingStore } from "@/app/redux/features/authSlice";
import { useNetworkingStore } from "@/hooks/useNetworkingStore";
import { uploadImage, readImagePreview } from "@/ulity/imageUpload";
import { toast } from "sonner";

export type ProfileFormValues = {
  clubName: string;
  clubType: string;
  otherClubType: string;
  description: string;
  city: string;
  phone: string;
  email: string;
  contactMethod: "whatsapp" | "call" | "email";
  socialPlatforms: {
    website: string;
    linkedin: string;
    instagram: string;
    other: string;
  };
  logoUrl?: string;
  bannerUrl?: string;
};

export function useClubProfile(
  club: any,
  user: any,
  isEditing: boolean,
  setIsEditing: (val: boolean) => void
) {
  const dispatch = useAppDispatch();
  const { updateNetworkingStore, updating, updateError } = useNetworkingStore();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const defaultValues = useMemo<ProfileFormValues>(() => {
    return {
      clubName: club?.clubName ?? "",
      clubType: club?.clubType ?? "bike",
      otherClubType: club?.otherClubType ?? "",
      description: club?.description ?? "",
      city: club?.city ?? "",
      phone: club?.phone ?? "",
      email: club?.email ?? user?.email ?? "",
      contactMethod: (club?.contactMethod as any) ?? "email",
      socialPlatforms: {
        website: club?.socialPlatforms?.website ?? "",
        linkedin: club?.socialPlatforms?.linkedin ?? "",
        instagram: club?.socialPlatforms?.instagram ?? "",
        other: club?.socialPlatforms?.other ?? "",
      },
      logoUrl: club?.logoUrl ?? "",
      bannerUrl: club?.bannerUrl ?? "",
    };
  }, [club, user]);

  const form = useForm<ProfileFormValues>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) return;
    setLogoUploading(true);
    try {
      const { url } = await uploadImage(file, {
        ownerId: user.userId,
        folder: "logo",
        basePath: "networkingStores",
      });
      const preview = await readImagePreview(file);
      setLogoPreview(preview);
      form.setValue("logoUrl", url);
      toast.success("Logo uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Logo upload failed");
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) return;
    setBannerUploading(true);
    try {
      const { url } = await uploadImage(file, {
        ownerId: user.userId,
        folder: "banner",
        basePath: "networkingStores",
      });
      const preview = await readImagePreview(file);
      setBannerPreview(preview);
      form.setValue("bannerUrl", url);
      toast.success("Banner uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Banner upload failed");
    } finally {
      setBannerUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    const clubId = club?.id || user.userId;
    if (!clubId) {
      toast.error("User ID Not Found", {
        description: "Please log in again.",
      });
      return;
    }

    const input = {
      id: clubId,
      clubName: values.clubName?.trim() ?? "",
      clubType: values.clubType ?? "bike",
      otherClubType: values.clubType === "other" ? values.otherClubType?.trim() : "",
      description: values.description?.trim() ?? "",
      city: values.city?.trim() ?? "",
      phone: values.phone?.trim() ?? "",
      email: values.email?.trim() ?? "",
      contactMethod: values.contactMethod ?? "email",
      socialPlatforms: {
        website: values.socialPlatforms?.website?.trim() ?? "",
        linkedin: values.socialPlatforms?.linkedin?.trim() ?? "",
        instagram: values.socialPlatforms?.instagram?.trim() ?? "",
        other: values.socialPlatforms?.other?.trim() ?? "",
      },
      logoUrl: values.logoUrl ?? "",
      bannerUrl: values.bannerUrl ?? "",
      completed: true,
      ownerUid: user.userId,
      onBoardType: "networking",
      pageType: "networking",
    };

    try {
      const updated = await updateNetworkingStore(clubId, input);
      if (updated) {
        dispatch(setNetworkingStore(updated));
        setLogoPreview(null);
        setBannerPreview(null);
        toast.success("Profile Updated", {
          description: "Your club profile details have been saved successfully.",
        });
        setIsEditing(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error("Update Failed", { description: msg });
    }
  });

  const handleCancel = () => {
    form.reset(defaultValues);
    setLogoPreview(null);
    setBannerPreview(null);
    setIsEditing(false);
  };

  return {
    form,
    updating,
    updateError,
    logoUploading,
    bannerUploading,
    logoPreview,
    bannerPreview,
    logoInputRef,
    bannerInputRef,
    handleLogoUpload,
    handleBannerUpload,
    handleSave,
    handleCancel,
  };
}
