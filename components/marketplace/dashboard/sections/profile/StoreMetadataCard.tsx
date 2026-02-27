"use client";

import { Input } from "@/components/ui/input";
import type { MarketplaceStore } from "@/types/marketplace";

type MetadataFieldProps = {
  label: string;
  value: string;
};

function MetadataField({ label, value }: MetadataFieldProps) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </label>
      <Input className="mt-2" defaultValue={value} disabled />
    </div>
  );
}

type Props = {
  store: MarketplaceStore | null;
  userId?: string | null;
};

export default function StoreMetadataCard({ store, userId }: Props) {
  const fields: MetadataFieldProps[] = [
    { label: "Owner UID", value: store?.ownerUid ?? userId ?? "UID-0001" },
    {
      label: "Created At",
      value: store?.createdAt ?? "2024-01-15T12:30:00+05:00",
    },
    { label: "Page Type", value: store?.pageType ?? "marketplace" },
    { label: "Onboard Type", value: store?.onBoardType ?? "marketplace" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Store Metadata</h2>
      <p className="text-sm text-slate-500">
        System details captured during onboarding.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <MetadataField key={f.label} label={f.label} value={f.value} />
        ))}
      </div>
    </div>
  );
}
