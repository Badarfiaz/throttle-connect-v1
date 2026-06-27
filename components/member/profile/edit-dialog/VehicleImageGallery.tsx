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
      <label className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider text-[#19376D]">
        Vehicle Photos (Multiple)
      </label>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 group"
            >
              <img
                src={imgUrl}
                alt={`Vehicle Preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute top-0.5 right-0.5 h-4.5 w-4.5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-slate-50 flex flex-col items-center justify-center gap-1 text-slate-400 transition"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#19376D]" />
            ) : (
              <>
                <Plus className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-semibold text-slate-500">
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
