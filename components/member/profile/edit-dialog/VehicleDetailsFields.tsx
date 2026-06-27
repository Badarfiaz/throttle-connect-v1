"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProfileFormValues } from "../profileForm.types";
import { VEHICLE_TYPE_OPTIONS } from "../profileForm.constants";
import VehicleImageGallery from "./VehicleImageGallery";

interface VehicleDetailsFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
  vehicleFileRef: React.RefObject<HTMLInputElement | null>;
  uploadingVehicle: boolean;
  onUploadVehicleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVehicleImage: (index: number) => void;
}

export default function VehicleDetailsFields({
  form,
  vehicleFileRef,
  uploadingVehicle,
  onUploadVehicleImage,
  onRemoveVehicleImage,
}: VehicleDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#19376D] flex items-center gap-1.5">
        <Compass className="h-4 w-4" /> Primary Vehicle
      </h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Vehicle Type</label>
          <Select
            value={form.watch("vehicleType")}
            onValueChange={(val) => form.setValue("vehicleType", val)}
          >
            <SelectTrigger className="w-full border-slate-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Vehicle Brand *</label>
          <Input
            placeholder="e.g. Yamaha or Honda"
            {...form.register("vehicleBrand", { required: "Brand is required" })}
            className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Vehicle Model *</label>
          <Input
            placeholder="e.g. YZF-R3 or Civic"
            {...form.register("vehicleModel", { required: "Model is required" })}
            className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Model Year</label>
          <Input
            placeholder="e.g. 2024"
            {...form.register("ModelYear")}
            className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
          />
        </div>
        <VehicleImageGallery
          images={form.watch("vehicleImages") || []}
          uploading={uploadingVehicle}
          inputRef={vehicleFileRef}
          onUpload={onUploadVehicleImage}
          onRemove={onRemoveVehicleImage}
        />
      </div>
    </div>
  );
}
