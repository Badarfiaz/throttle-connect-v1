import React from "react";
import { Separator } from "@/components/ui/separator";

interface ProductDescriptionProps {
  description?: string | null;
  title?: string;
  showSeparator?: boolean;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  title = "Description",
  showSeparator = true,
}) => {
  return (
    <>
      {showSeparator && <Separator className="my-6" />}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {description ?? "No description provided for this product."}
        </p>
      </div>
    </>
  );
};

export default ProductDescription;
