import { marketplaceCategories } from "@/data/category";

export type ProductFieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "textarea" | "number" | "file" | "select";
  keyboardType?: "default" | "numeric";
  gridSpan?: "full" | "half";
  options?: { label: string; value: string }[];
  isMultiImage?: boolean;
};

export const productFields: ProductFieldConfig[] = [
  {
    name: "productName",
    label: "Product Name",
    placeholder: "e.g., Premium Brake Pad Kit",
    required: true,
    type: "input",
    gridSpan: "half",
  },
  {
    name: "category",
    label: "Category",
    placeholder: "Braking, Lighting, Engine",
    type: "select",
    gridSpan: "half",
    options: marketplaceCategories.map((cat) => ({
      label: cat.name,
      value: cat.slug,
    })),
  },
  {
    name: "price",
    label: "Price",
    placeholder: "PKR 0",
    required: true,
    type: "number",
    keyboardType: "numeric",
    gridSpan: "half",
  },
  {
    name: "stock",
    label: "Stock",
    placeholder: "Available units",
    required: true,
    type: "number",
    keyboardType: "numeric",
    gridSpan: "half",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Highlight features, fitment, and warranty details.",
    type: "textarea",
    gridSpan: "full",
  },
  {
    name: "imageurl",
    label: "Product Image",
    placeholder: "Upload at least one product image",
    required: true,
    type: "file",
    isMultiImage: true,
    gridSpan: "full",
  },
];
