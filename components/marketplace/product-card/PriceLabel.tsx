"use client";

type PriceLabelProps = {
  price?: number;
  currency?: string;
  compareAtPrice?: number | null;
  contactLabel?: string;
  className?: string;
};

export default function PriceLabel({
  price,
  currency = "PKR",
  compareAtPrice,
  contactLabel = "Contact for price",
  className,
}: PriceLabelProps) {
  const isValidPrice =
    typeof price === "number" && Number.isFinite(price) && price > 0;
  const formattedPrice = isValidPrice
    ? new Intl.NumberFormat("en-PK").format(price)
    : null;
  const formattedCompareAtPrice =
    typeof compareAtPrice === "number" && Number.isFinite(compareAtPrice)
      ? new Intl.NumberFormat("en-PK").format(compareAtPrice)
      : null;

  return (
    <div className={className}>
      {!isValidPrice ? (
        <div>
          <p className="text-[13px] font-extrabold tracking-tight text-orange-500 sm:text-sm">
            {contactLabel}
          </p>
          {formattedCompareAtPrice && (
            <p className="mt-1 text-xs font-medium text-slate-400 line-through">
              {currency} {formattedCompareAtPrice}
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Price
          </p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-[18px] font-bold tracking-tight text-slate-900 sm:text-xl">
              {currency} {formattedPrice}
            </span>
            {formattedCompareAtPrice && (
              <span className="pb-0.5 text-xs font-medium text-slate-400 line-through">
                {currency} {formattedCompareAtPrice}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
