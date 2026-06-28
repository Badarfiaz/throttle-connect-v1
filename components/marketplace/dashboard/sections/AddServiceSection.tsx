"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { readImagePreview } from "@/ulity/imageUpload";
import { MarketplaceService, SERVICE_TYPES, PRICE_UNITS } from "@/types/marketplace";
import { useMarketplaceServices } from "@/hooks/useMarketplaceServices";

type FormValues = {
  title: string;
  serviceType: string;
  description: string;
  price: number | "";
  priceUnit: string;
  isAvailable: boolean;
};

type AddServiceSectionProps = {
  onBack: () => void;
  editService?: MarketplaceService | null;
};

const AddServiceSection = ({ onBack, editService }: AddServiceSectionProps) => {
  const isEditMode = !!editService;
  const { createService, updateService, creating, updating } = useMarketplaceServices();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editService?.imageUrl ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: {
      title: editService?.title ?? "",
      serviceType: editService?.serviceType ?? "",
      description: editService?.description ?? "",
      price: editService?.price ?? "",
      priceUnit: editService?.priceUnit ?? "fixed",
      isAvailable: editService?.isAvailable ?? true,
    },
  });

  useEffect(() => {
    if (editService) {
      reset({
        title: editService.title,
        serviceType: editService.serviceType,
        description: editService.description ?? "",
        price: editService.price ?? "",
        priceUnit: editService.priceUnit ?? "fixed",
        isAvailable: editService.isAvailable,
      });
      setImagePreview(editService.imageUrl ?? null);
      setImageFile(null);
    }
  }, [editService, reset]);

  const isAvailable = watch("isAvailable");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    readImagePreview(file).then(setImagePreview).catch(console.error);
  };

  const onSubmit = async (data: FormValues) => {
    const input = {
      title: data.title.trim(),
      serviceType: data.serviceType,
      description: data.description?.trim() || undefined,
      price: data.price !== "" ? Number(data.price) : undefined,
      priceUnit: data.priceUnit || "fixed",
      isAvailable: data.isAvailable,
    };

    try {
      if (isEditMode && editService) {
        await updateService(editService.storeId, editService.id, input, imageFile);
      } else {
        await createService(input, imageFile);
      }
      reset();
      setImageFile(null);
      setImagePreview(null);
      onBack();
    } catch {
      // errors are toasted in the hook
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isEditMode ? "Edit Service" : "Add New Service"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEditMode
              ? "Update service details for your customers."
              : "List a vehicle service you provide."}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Services
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Service Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Full Engine Overhaul"
              {...register("title", { required: true })}
            />
          </div>

          {/* Service Type */}
          <div className="space-y-1.5">
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select
              value={watch("serviceType")}
              onValueChange={(val) => setValue("serviceType", val)}
            >
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (PKR)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              placeholder="Leave blank for quote-based"
              {...register("price")}
            />
          </div>

          {/* Price Unit */}
          <div className="space-y-1.5">
            <Label htmlFor="priceUnit">Pricing Model</Label>
            <Select
              value={watch("priceUnit")}
              onValueChange={(val) => setValue("priceUnit", val)}
            >
              <SelectTrigger id="priceUnit">
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_UNITS.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image upload */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Service Image
            </label>
            <div className="mt-2 flex items-center gap-3">
              {imagePreview && (
                <div className="size-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="size-full object-cover"
                  />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="size-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-xs text-slate-500">
              Recommended: 800x800px, max 5MB
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Describe what's included, turnaround time, warranty, etc."
              {...register("description")}
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3 md:col-span-2">
            <Checkbox
              id="isAvailable"
              checked={isAvailable}
              onCheckedChange={(checked: boolean) => setValue("isAvailable", checked)}
            />
            <Label htmlFor="isAvailable" className="cursor-pointer">
              {isAvailable ? "Currently available" : "Temporarily unavailable"}
            </Label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={creating || updating}>
            {creating || updating
              ? isEditMode ? "Saving..." : "Creating..."
              : isEditMode ? "Save Changes" : "Add Service"}
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceSection;
