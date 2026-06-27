"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadCardProps {
  label: string;
  value: string;
  uploading: boolean;
  emptyLabel: string;
  buttonLabel: string;
  helperText: string;
  previewClassName: string;
  imageFit?: "cover" | "contain";
  layout?: "row" | "column";
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadCard({
  label,
  value,
  uploading,
  emptyLabel,
  buttonLabel,
  helperText,
  previewClassName,
  imageFit = "cover",
  layout = "row",
  inputRef,
  onUpload,
}: ImageUploadCardProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider text-[#19376D]">
        {label}
      </label>
      <div
        className={`flex p-3 border border-slate-200 bg-slate-50 rounded-xl ${
          layout === "row" ? "items-center gap-4" : "flex-col gap-3"
        }`}
      >
        <div
          className={`relative rounded-xl border bg-white shrink-0 overflow-hidden flex items-center justify-center ${previewClassName}`}
        >
          {value ? (
            <img
              src={value}
              alt={`${label} Preview`}
              className={`h-full w-full ${imageFit === "cover" ? "object-cover" : "object-contain"}`}
            />
          ) : (
            <span className="text-xs font-semibold text-slate-400 text-center px-2">
              {emptyLabel}
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <div
          className={
            layout === "row"
              ? "space-y-1.5 flex-1"
              : "flex items-center justify-between"
          }
        >
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-8 text-xs font-semibold rounded-lg bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            {uploading ? "Uploading..." : buttonLabel}
          </Button>
          <p className="text-[10px] text-slate-400">{helperText}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>
    </div>
  );
}
