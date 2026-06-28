"use client";

import React from "react";
import { Loader2, Plus, X } from "lucide-react";

interface VehicleImageGalleryProps {
  images: string[];
  uploading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export default function VehicleImageGallery({
  images,
  uploading,
  inputRef,
  onUpload,
  onRemove,
}: VehicleImageGalleryProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold font-mono uppercase tracking-wider text-primary">
        Vehicle Photos (Multiple)
      </label>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2.5">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative h-16 w-16 rounded-xl border border-border bg-muted/40 overflow-hidden shrink-0 group"
            >
              <img
                src={imgUrl}
                alt={`Vehicle Preview ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute top-1 right-1 h-5 w-5 bg-background/80 hover:bg-destructive text-foreground hover:text-white rounded-full flex items-center justify-center shadow-xs transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-16 w-16 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/40 flex flex-col items-center justify-center gap-1 text-muted-foreground transition cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <>
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-semibold">
                  Add
                </span>
              </>
            )}
          </button>
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
