"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { fetchUserProfileData } from "@/app/redux/features/authSlice";
import {
  ProfileFormValues,
  buildDefaultFormValues,
  buildProfileDocPayload,
} from "./profileForm.types";
import ProfileSummaryCard from "./ProfileSummaryCard";
import ProfileIncomplete from "./ProfileIncomplete";
import ProfileEditDialog from "./edit-dialog/ProfileEditDialog";

function getInitials(displayName: string): string {
  return (
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "TC"
  );
}

export default function ProfileHero() {
  const user = useAppSelector((state) => state.auth.user);
  const profileData = user?.profileData;
  const dispatch = useAppDispatch();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultValues = useMemo<ProfileFormValues>(
    () => buildDefaultFormValues(profileData, user?.name ?? ""),
    [profileData, user],
  );

  const form = useForm<ProfileFormValues>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  if (!user) {
    return null;
  }

  const displayName = profileData?.memberName || user.name || "Member Name";

  const handleSave = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = buildProfileDocPayload(
        values,
        { email: user.email, userId: user.userId },
        profileData,
      );
      await setDoc(doc(db, "users", user.userId), payload, { merge: true });

      toast.success("Profile Saved", {
        description: "Your profile details have been saved successfully in users collection.",
      });

      dispatch(fetchUserProfileData(user.userId));
      setShowEditDialog(false);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      toast.error("Save Failed", { description: msg });
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="space-y-8">
      {profileData ? (
        <ProfileSummaryCard
          profileData={profileData}
          displayName={displayName}
          initials={getInitials(displayName)}
          onEdit={() => setShowEditDialog(true)}
        />
      ) : (
        <ProfileIncomplete onComplete={() => setShowEditDialog(true)} />
      )}

      <ProfileEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        isEditingExisting={Boolean(profileData)}
        form={form}
        userId={user.userId}
        saving={saving}
        onSubmit={handleSave}
      />
    </div>
  );
}
