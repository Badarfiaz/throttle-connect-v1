"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { productFields } from "../productFormFields";
import ProductInputField from "../ProductInputField";
import { useForm } from "react-hook-form";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import { MarketplaceProduct } from "@/types/marketplace";
import { readImagePreview } from "@/ulity/imageUpload";

type AddProductSectionProps = {
  onBack: () => void;
  editProduct?: MarketplaceProduct | null;
};

const AddProductSection = ({ onBack, editProduct }: AddProductSectionProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  // Set image preview if editing and product has image
  useEffect(() => {
    if (editProduct?.imageurl?.url) {
      setImagePreview(editProduct.imageurl.url);
    }
  }, [editProduct]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    void readImagePreview(file).then(setImagePreview).catch(console.error);
  };

  const handlePublish = async () => {
    const data = form.getValues();

    // Validate required fields
    if (!data.productName || data.productName.trim() === "") {
      return;
    }
    if (data.price < 0 || data.stock < 0) {
      return;
    }

    try {
      if (isEditMode && editProduct) {
        // Update existing product
        await updateProduct(
          editProduct.id,
          {
            productName: data.productName,
            price: data.price,
            stock: data.stock,
            description: data.description,
            category: data.category,
          },
          imageFile,
        );
      } else {
        // Create new product
        await createProduct(
          {
            productName: data.productName,
            price: data.price,
            stock: data.stock,
            description: data.description,
            category: data.category,
          },
          imageFile,
        );
      }

      // Reset form after successful creation/update
      form.reset();
      setImageFile(null);
      setImagePreview(null);

      // Navigate back to products list
      onBack();
    } catch (error) {
      // Error is already handled in the hook with toast
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} product:`,
        error,
      );
    }
  };

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
        {productFields.map((field) => (
          <ProductInputField
            key={field.name}
            field={field}
            form={form}
            onImageSelect={
              field.type === "file" ? handleImageSelect : undefined
            }
            imagePreview={field.type === "file" ? imagePreview : undefined}
          />
        ))}
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
