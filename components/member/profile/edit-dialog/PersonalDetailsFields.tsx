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
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#19376D] flex items-center gap-1.5">
        <User className="h-4 w-4" /> Personal Details
      </h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Full Name *</label>
          <Input
            placeholder="e.g. Ahsan Baig"
            {...form.register("memberName", { required: "Name is required" })}
            className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Phone Number *</label>
          <Input
            type="tel"
            placeholder="e.g. +92 333 1112233"
            {...form.register("phone", { required: "Phone is required" })}
            className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">WhatsApp Number</label>
          <Input
            type="tel"
            placeholder="e.g. +92 333 1112233"
            {...form.register("whatsapp")}
            className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Province</label>
            <Input
              placeholder="Sindh"
              {...form.register("province")}
              className="border-slate-200 text-xs px-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">City *</label>
            <Input
              placeholder="Karachi"
              {...form.register("city", { required: true })}
              className="border-slate-200 text-xs px-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Area</label>
            <Input
              placeholder="DHA Phase 6"
              {...form.register("area")}
              className="border-slate-200 text-xs px-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500">Country *</label>
            <Input
              placeholder="UAE"
              {...form.register("country", { required: true })}
              className="border-slate-200 text-xs px-2"
            />
          </div>
        </div>
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
  );
}
