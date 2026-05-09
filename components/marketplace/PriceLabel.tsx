 
 import { cn } from "@/lib/utils";

interface PriceLabelProps {
  price: number | string;
  currency?: string;
   className?: string;
}

export default function PriceLabel({
  price,
  currency = "Rs",
   className,
}: PriceLabelProps) {
  return (
    <p className={cn("text-sm font-medium text-red-600", className)}>
      {currency} {price}  
    </p>
  );
}
