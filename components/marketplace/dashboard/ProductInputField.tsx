"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductFieldConfig } from "./productFormFields";
import type { UseFormReturn } from "react-hook-form";
import { useRef, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
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
  onImageSelect?: (file: File) => void;
  imagePreview?: string | null;
};

function ProductInputField({
  field,
  form,
  onImageSelect,
  imagePreview,
}: ProductInputFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  const renderField = () => {
    if (field.type === "file") {
      return (
        <div>
          <div className="mt-2 flex items-center gap-3">
            {imagePreview && (
              <div className="size-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="size-full object-cover"
                />
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
          <p className="mt-2 text-xs text-slate-500">
            Recommended: 800x800px, max 5MB
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
