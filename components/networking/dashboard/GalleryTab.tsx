"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";

interface GalleryTabProps {
  galleryList: string[];
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDelete: (url: string) => Promise<void>;
}

export default function GalleryTab({
  galleryList,
  uploading,
  fileInputRef,
  handleUpload,
  handleDelete,
}: GalleryTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Club Gallery ({galleryList.length}/10)</h3>
          <p className="text-sm text-slate-500">Post moments and show off your club meets</p>
        </div>
        {galleryList.length < 10 && (
          <div>
            <Button
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#19376D] hover:bg-[#0B2447] text-white animate-in zoom-in-95 duration-250"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Upload Moment
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        )}
      </div>

      {galleryList.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center rounded-xl">
          <CardContent className="p-0">
            <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4 font-medium">No moments uploaded yet. Upload images of your club events and drives.</p>
            <Button
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {galleryList.map((url, idx) => (
            <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
              <img
                src={url}
                alt={`Club Moment ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(url)}
                  className="h-9 w-9 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {uploading && (
            <div className="relative aspect-square rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-[10px] text-slate-400 font-semibold animate-pulse">Uploading moment...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
