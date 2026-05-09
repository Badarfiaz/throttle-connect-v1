"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/ulity/imageUpload";
import { Upload, X } from "lucide-react";

type ImageUploadFieldProps = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  ownerId: string;
  folder: string;
  placeholder?: string;
  maxSizeMb?: number;
  basePath?: string;
  className?: string;
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  ownerId,
  folder,
  placeholder = "No image uploaded",
  maxSizeMb = 5,
  basePath = "members",
  className = "",
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ownerId) {
      toast.error("User not available", {
        description: "Please ensure you're logged in.",
      });
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadImage(file, {
        ownerId,
        folder,
        maxSizeMb,
        basePath,
      });

      onChange(url);

      toast.success("Image uploaded", {
        description: `Your ${label.toLowerCase()} has been uploaded.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      toast.error("Upload failed", { description: message });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    toast.success("Image removed");
  };

  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
        {label}
      </label>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {value ? (
          <div className="flex items-center gap-4">
            <img
              src={value}
              alt={label}
              className="size-20 rounded-lg object-cover border border-slate-200 bg-white"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">
                Image uploaded
              </p>
              <p className="text-xs text-slate-500">Click to replace</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={handleClick}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Replace"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-lg bg-slate-200">
              <Upload className="size-8 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {placeholder}
              </p>
              <p className="text-xs text-slate-500">
                Recommended max {maxSizeMb}MB
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleClick}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
