"use client";

import React from "react";
import { Loader2, UploadCloud } from "lucide-react";
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
      <label className="text-xs font-bold font-mono uppercase tracking-wider text-primary">
        {label}
      </label>
      <div
        className={`flex p-4 border border-border bg-muted/20 rounded-2xl ${
          layout === "row" ? "items-center gap-4" : "flex-col gap-3"
        }`}
      >
        <div
          className={`relative rounded-xl border border-border bg-card shrink-0 overflow-hidden flex items-center justify-center ${previewClassName}`}
        >
          {value ? (
            <img
              src={value}
              alt={`${label} Preview`}
              className={`h-full w-full ${imageFit === "cover" ? "object-cover" : "object-contain"}`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2">
              <UploadCloud className="h-5 w-5 text-muted-foreground/40 mb-1" />
              <span className="text-[10px] font-medium text-muted-foreground/70 leading-tight">
                {emptyLabel}
              </span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div
          className={
            layout === "row"
              ? "space-y-1.5 flex-1"
              : "flex items-center justify-between gap-2 w-full"
          }
        >
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-8 text-xs font-semibold rounded-xl bg-card border-border hover:bg-muted text-foreground"
          >
            {uploading ? "Uploading..." : buttonLabel}
          </Button>
          <p className="text-[10px] text-muted-foreground">{helperText}</p>
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
