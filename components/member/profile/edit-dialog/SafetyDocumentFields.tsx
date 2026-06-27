"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Activity } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProfileFormValues } from "../profileForm.types";
import { EXPERIENCE_OPTIONS, INTEREST_OPTIONS } from "../profileForm.constants";
import ImageUploadCard from "./ImageUploadCard";

interface SafetyDocumentFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  licenseFileRef: React.RefObject<HTMLInputElement | null>;
  uploadingLicense: boolean;
  onUploadLicenseImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedInterests: string[];
  onToggleInterest: (value: string) => void;
}

export default function SafetyDocumentFields({
  form,
  licenseFileRef,
  uploadingLicense,
  onUploadLicenseImage,
  selectedInterests,
  onToggleInterest,
}: SafetyDocumentFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#19376D] flex items-center gap-1.5">
        <Activity className="h-4 w-4" /> Safety & Documents
      </h3>
      <div className="space-y-3">
        <ImageUploadCard
          label="Driving License Document"
          value={form.watch("drivingLicenseImage")}
          uploading={uploadingLicense}
          emptyLabel="No License Document Uploaded"
          buttonLabel="Upload License Image"
          helperText="Clear snapshot showing credentials (max. 5MB)"
          previewClassName="h-32 w-full"
          imageFit="contain"
          layout="column"
          inputRef={licenseFileRef}
          onUpload={onUploadLicenseImage}
        />
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Riding Experience</label>
          <Select
            value={form.watch("experienceYears")}
            onValueChange={(val) => form.setValue("experienceYears", val)}
          >
            <SelectTrigger className="w-full border-slate-200">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500">Riding Interests</label>
          <div className="flex flex-wrap gap-2 pt-1">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest.value);
              return (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => onToggleInterest(interest.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-[#19376D] text-white border-[#19376D] shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {interest.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
