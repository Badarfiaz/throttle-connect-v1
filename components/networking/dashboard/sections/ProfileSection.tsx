"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ClubIdentityCard from "./profile/ClubIdentityCard";
import ClubDetailsCard from "./profile/ClubDetailsCard";
import { ClubProfile } from "../NetworkingDashboardContainer";

type ProfileSectionProps = {
  clubData?: ClubProfile | null;
  userEmail?: string | null;
  userId?: string | null;
  onUpdateClub?: (
    id: string,
    input: Record<string, unknown>,
  ) => Promise<ClubProfile | null>;
  updating?: boolean;
  updateError?: string | null;
};

export default function NetworkingProfileSection({
  clubData,
  userId,
  onUpdateClub,
  updating,
  updateError,
}: ProfileSectionProps) {
  const form = useForm<any>();

  useEffect(() => {
    form.reset(clubData);
  }, [clubData, form, clubData]);

  const handleSave = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fill in all required fields");
      return;
    }

    const data = form.getValues();

    if (onUpdateClub && userId) {
      try {
        await onUpdateClub(userId, data);
        toast.success("Club profile updated successfully");
      } catch (err) {
        toast.error(updateError || "Failed to update club profile");
      }
    } else {
      // Static mode - just show success
      toast.success("Club profile saved (demo mode)");
    }
  };

  return (
    <div className="space-y-6">
      {updateError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {updateError}
        </div>
      )}

      <ClubIdentityCard form={form} onSave={handleSave} saving={updating} />

      <ClubDetailsCard form={form} />
    </div>
  );
}
