"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProfileFormValues } from "../profileForm.types";
import { useProfileImageUploads } from "@/hooks/useProfileImageUploads";
import PersonalDetailsFields from "./PersonalDetailsFields";
import VehicleDetailsFields from "./VehicleDetailsFields";
import SafetyDocumentFields from "./SafetyDocumentFields";
import EmergencyContactFields from "./EmergencyContactFields";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditingExisting: boolean;
  form: UseFormReturn<ProfileFormValues>;
  userId: string;
  saving: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProfileEditDialog({
  open,
  onOpenChange,
  isEditingExisting,
  form,
  userId,
  saving,
  onSubmit,
}: ProfileEditDialogProps) {
  const imageUploads = useProfileImageUploads(form, userId);
  const selectedInterests = form.watch("interests") || [];

  const handleInterestToggle = (value: string) => {
    const current = [...selectedInterests];
    const index = current.indexOf(value);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(value);
    }
    form.setValue("interests", current, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 md:p-8 scrollbar-none">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditingExisting ? "Edit Rider Profile" : "Complete Rider Profile"}
          </DialogTitle>
          <DialogDescription>
            Provide details about yourself, your primary ride, and emergency contacts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <PersonalDetailsFields
              form={form}
              profileFileRef={imageUploads.profileFileRef}
              uploadingProfile={imageUploads.uploadingProfile}
              onUploadProfileImage={imageUploads.handleProfileImageUpload}
            />
            <VehicleDetailsFields
              form={form}
              vehicleFileRef={imageUploads.vehicleFileRef}
              uploadingVehicle={imageUploads.uploadingVehicle}
              onUploadVehicleImage={imageUploads.handleVehicleImageUpload}
              onRemoveVehicleImage={imageUploads.removeVehicleImage}
            />
          </div>

          <div className="border-t border-slate-100 pt-6 grid gap-6 md:grid-cols-2">
            <SafetyDocumentFields
              form={form}
              licenseFileRef={imageUploads.licenseFileRef}
              uploadingLicense={imageUploads.uploadingLicense}
              onUploadLicenseImage={imageUploads.handleLicenseImageUpload}
              selectedInterests={selectedInterests}
              onToggleInterest={handleInterestToggle}
            />
            <EmergencyContactFields form={form} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#19376D] hover:bg-[#0B2447] text-white"
              disabled={saving}
            >
              {saving ? "Saving Details..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
