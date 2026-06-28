"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileFormValues } from "../profileForm.types";
import ImageUploadCard from "./ImageUploadCard";

interface PersonalDetailsFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  profileFileRef: React.RefObject<HTMLInputElement | null>;
  uploadingProfile: boolean;
  onUploadProfileImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalDetailsFields({
  form,
  profileFileRef,
  uploadingProfile,
  onUploadProfileImage,
}: PersonalDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 border-b border-border/40 pb-2">
        <User className="h-4 w-4" /> Personal Details
      </h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
          <Input
            placeholder="e.g. Ahsan Baig"
            {...form.register("memberName", { required: "Name is required" })}
            className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary bg-transparent text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Phone Number *</label>
          <Input
            type="tel"
            placeholder="e.g. +92 333 1112233"
            {...form.register("phone", { required: "Phone is required" })}
            className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary bg-transparent text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">WhatsApp Number</label>
          <Input
            type="tel"
            placeholder="e.g. +92 333 1112233"
            {...form.register("whatsapp")}
            className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary bg-transparent text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground">Province</label>
            <Input
              placeholder="Sindh"
              {...form.register("province")}
              className="border-border rounded-xl text-xs px-3 bg-transparent text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground">City *</label>
            <Input
              placeholder="Karachi"
              {...form.register("city", { required: true })}
              className="border-border rounded-xl text-xs px-3 bg-transparent text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground">Area</label>
            <Input
              placeholder="DHA Phase 6"
              {...form.register("area")}
              className="border-border rounded-xl text-xs px-3 bg-transparent text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground">Country *</label>
            <Input
              placeholder="UAE"
              {...form.register("country", { required: true })}
              className="border-border rounded-xl text-xs px-3 bg-transparent text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <div className="pt-2">
          <ImageUploadCard
            label="Profile Photo"
            value={form.watch("profileImage")}
            uploading={uploadingProfile}
            emptyLabel="No Photo"
            buttonLabel="Upload Photo"
            helperText="Square PNG or JPG (max. 5MB)"
            previewClassName="h-16 w-16"
            layout="row"
            inputRef={profileFileRef}
            onUpload={onUploadProfileImage}
          />
        </div>
      </div>
    </div>
  );
}
