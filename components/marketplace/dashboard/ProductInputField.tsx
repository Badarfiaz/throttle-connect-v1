"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductFieldConfig } from "./productFormFields";
import type { UseFormReturn } from "react-hook-form";
import { useRef, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ProductInputFieldProps = {
  field: ProductFieldConfig;
  form?: UseFormReturn<any>;
  onImageSelect?: (files: File | File[]) => void;
  onRemoveImage?: (index: number) => void;
  imagePreviews?: string[];
};

function ProductInputField({
  field,
  form,
  onImageSelect,
  onRemoveImage,
  imagePreviews,
}: ProductInputFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMultiImage = field.isMultiImage ?? false;
  const previews = imagePreviews ?? [];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!onImageSelect || files.length === 0) {
      return;
    }

    onImageSelect(isMultiImage ? files : files[0]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderField = () => {
    if (field.type === "file") {
      const hasPreviews = previews.length > 0;
      return (
        <div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            {hasPreviews && (
              <div className="grid grid-cols-2 gap-2 sm:max-w-[20rem]">
                {previews.map((preview, index) => (
                  <div
                    key={`${preview}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="size-full object-cover"
                    />
                    {onRemoveImage && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => onRemoveImage(index)}
                        className="absolute right-2 top-2 size-7 rounded-full bg-black/70 text-white opacity-0 shadow-md transition-opacity hover:bg-black/80 group-hover:opacity-100"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFileClick}
              className="gap-2"
            >
              <Upload className="size-4" />
              {hasPreviews
                ? isMultiImage
                  ? "Change Images"
                  : "Change Image"
                : isMultiImage
                  ? "Upload Images"
                  : "Upload Image"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple={isMultiImage}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {isMultiImage
              ? "You can upload multiple images. Recommended: 800x800px each, max 5MB each."
              : "Recommended: 800x800px, max 5MB"}
          </p>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          className="mt-2"
          placeholder={field.placeholder}
          {...(form && form.register(field.name))}
        />
      );
    }
    if (field.type === "select" && field.options && form) {
      const { watch, setValue } = form;
      const value = watch(field.name) as string | undefined;

      return (
        <Select
          value={value ?? ""}
          onValueChange={(v) =>
            setValue(field.name, v, { shouldValidate: true })
          }
        >
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === "number") {
      return (
        <Input
          type="number"
          className="mt-2"
          placeholder={field.placeholder}
          {...(form && form.register(field.name, { valueAsNumber: true }))}
        />
      );
    }

    return (
      <Input
        type="text"
        className="mt-2"
        placeholder={field.placeholder}
        {...(form && form.register(field.name))}
      />
    );
  };

  return (
    <div className={cn(field.gridSpan === "full" ? "md:col-span-2" : "")}>
      <label className="text-xs font-semibold uppercase text-slate-500">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      {renderField()}
    </div>
  );
}

export default ProductInputField;
