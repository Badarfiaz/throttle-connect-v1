"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { productFields } from "../productFormFields";
import ProductInputField from "../ProductInputField";
import { useForm } from "react-hook-form";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "@/types/marketplace";
import { readImagePreview } from "@/ulity/imageUpload";
import { Upload, X, ImageIcon } from "lucide-react";

type AddProductSectionProps = {
  onBack: () => void;
  editProduct?: MarketplaceProduct | null;
};

const AddProductSection = ({ onBack, editProduct }: AddProductSectionProps) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createProduct, updateProduct, creating, updating } =
    useMarketplaceProducts();
  const isEditMode = !!editProduct;

  const form = useForm({
    defaultValues: {
      productName: editProduct?.productName ?? "",
      category: editProduct?.category ?? "",
      price: editProduct?.price ?? 0,
      stock: editProduct?.stock ?? 0,
      description: editProduct?.description ?? "",
    },
  });

  // Populate previews from existing product images when editing
  useEffect(() => {
    if (!editProduct) return;
    if (editProduct.imageUrlMulti && editProduct.imageUrlMulti.length > 0) {
      setImagePreviews(editProduct.imageUrlMulti.map((img) => img.url));
    } else if (editProduct.imageurl?.url) {
      setImagePreviews([editProduct.imageurl.url]);
    }
  }, [editProduct]);

  const handleFilesSelected = async (files: FileList) => {
    const newFiles = Array.from(files);
    const newPreviews = await Promise.all(newFiles.map(readImagePreview));
    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // In edit mode, the first previews may come from existing URLs (not new files).
    // Track which are "new" based on imageFiles length vs total previews.
    const existingCount = imagePreviews.length - imageFiles.length;
    const isExisting = index < existingCount;

    if (isExisting) {
      // Remove from previews only (existing image, no local file to remove)
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - existingCount;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handlePublish = async () => {
    const data = form.getValues();

    if (!data.productName || data.productName.trim() === "") return;
    if (data.price < 0 || data.stock < 0) return;

    try {
      if (isEditMode && editProduct) {
        await updateProduct(
          editProduct.id,
          {
            productName: data.productName,
            price: data.price,
            stock: data.stock,
            description: data.description,
            category: data.category,
          },
          null,
          imageFiles,
        );
      } else {
        await createProduct(
          {
            productName: data.productName,
            price: data.price,
            stock: data.stock,
            description: data.description,
            category: data.category,
          },
          null,
          imageFiles,
        );
      }

      form.reset();
      setImageFiles([]);
      setImagePreviews([]);
      onBack();
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} product:`,
        error,
      );
    }
  };

  const nonImageFields = productFields.filter((f) => f.type !== "file");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditMode
              ? "Update product details and inventory."
              : "List a fresh item for buyers to discover."}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Products
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {nonImageFields.map((field) => (
          <ProductInputField key={field.name} field={field} form={form} />
        ))}
      </div>

      {/* Multi-image upload */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase text-slate-500">
          Product Images
        </label>
        <p className="mt-1 text-xs text-slate-400">
          Upload up to 8 images. First image is the cover. Max 5MB each.
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {imagePreviews.map((preview, idx) => (
            <div
              key={idx}
              className="relative size-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
            >
              <img
                src={preview}
                alt={`Product image ${idx + 1}`}
                className="size-full object-cover"
              />
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-slate-900/70 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {imagePreviews.length < 8 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-24 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-slate-400 hover:bg-slate-100"
            >
              <Upload size={18} />
              <span className="text-[10px] font-semibold">Add Photo</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              void handleFilesSelected(e.target.files);
              e.target.value = "";
            }
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {!isEditMode && <Button onClick={handlePublish}>Save Product</Button>}
        <Button
          variant={isEditMode ? "default" : "outline"}
          onClick={handlePublish}
          disabled={creating || updating}
        >
          {creating || updating
            ? isEditMode
              ? "Updating..."
              : "Publishing..."
            : isEditMode
              ? "Update Product"
              : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default AddProductSection;
