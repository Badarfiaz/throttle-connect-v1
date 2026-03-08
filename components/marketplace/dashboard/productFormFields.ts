export type ProductFieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "textarea" | "number" | "file";
  keyboardType?: "default" | "numeric";
  gridSpan?: "full" | "half";
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
    type: "input",
    gridSpan: "half",
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
    placeholder: "Upload product image",
    type: "file",
    gridSpan: "full",
  },
];
