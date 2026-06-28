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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 md:p-8 shadow-2xl scrollbar-none">
        <DialogHeader className="pb-4 border-b border-border/60">
          <DialogTitle className="text-xl font-bold text-foreground">
            {isEditingExisting ? "Edit Rider Profile" : "Complete Rider Profile"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
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

          <div className="border-t border-border/60 pt-6 grid gap-6 md:grid-cols-2">
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="rounded-xl text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 py-2"
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
