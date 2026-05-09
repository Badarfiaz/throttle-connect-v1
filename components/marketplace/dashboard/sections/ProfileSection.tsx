"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { MarketplaceStore } from "@/types/marketplace";
import StoreIdentityCard from "./profile/StoreIdentityCard";
import StoreLogoCard from "./profile/StoreLogoCard";
import ContactLocationCard from "./profile/ContactLocationCard";
import StoreMetadataCard from "./profile/StoreMetadataCard";
import { socialFields } from "../../registration/formFields";
import RegistrationInputField from "../../registration/RegistrationInputField";
import DashboardWrapper from "@/components/shared/DashboardWrapper";

type StaticProfile = {
  website: string;
  linkedin: string;
  instagram: string;
  other: string;
};

type ProfileSectionProps = {
  store: MarketplaceStore | null;
  userEmail?: string | null;
  userId?: string | null;
  locationLabel: string;
  storeInitials: string;
  staticProfile: StaticProfile;
  onUpdateStore?: (
    id: string,
    input: Record<string, unknown>,
  ) => Promise<MarketplaceStore | null>;
  updating?: boolean;
  updateError?: string | null;
};

type ProfileFormValues = {
  title: string;
  email: string;
  phone: string;
  address: string;
  businessType: string[];
  overview: string;
  location: {
    province: string;
    city: string;
    area: string;
  };
  contactMethod: string;
  socialPlatforms: Record<string, string>;
};

const normalizeBusinessType = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }
  return [];
};

const normalizeSocialPlatforms = (
  store: MarketplaceStore | null,
): Record<string, string> => {
  const raw = (store as { socialPlatforms?: Record<string, string> | null })
    ?.socialPlatforms;
  return raw && typeof raw === "object" ? raw : {};
};

export default function ProfileSection({
  store,
  userEmail,
  userId,
  storeInitials,
  staticProfile,
  onUpdateStore,
  updating,
  updateError,
}: ProfileSectionProps) {
  const defaultValues = useMemo<ProfileFormValues>(
    () => ({
      title: store?.title ?? "",
      email: store?.email ?? userEmail ?? "",
      phone: store?.phone ?? "",
      address: store?.address ?? "",
      businessType: normalizeBusinessType(store?.businessType),
      overview: store?.overview ?? "",
      location: {
        province: store?.location?.province ?? "",
        city: store?.location?.city ?? "",
        area: store?.location?.area ?? "",
      },
      contactMethod: store?.contactMethod ?? "",
      socialPlatforms: normalizeSocialPlatforms(store),
    }),
    [store, userEmail],
  );

  const form = useForm<ProfileFormValues>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSave = form.handleSubmit(async (values) => {
    if (!store?.id) {
      toast.error("Store not available", {
        description: "We couldn't find a store to update.",
      });
      return;
    }
    if (!onUpdateStore) {
      toast.error("Update unavailable", {
        description: "Please refresh and try again.",
      });
      return;
    }

    const input = {
      title: values.title?.trim() ?? "",
      email: values.email ?? "",
      phone: values.phone ?? "",
      address: values.address ?? "",
      businessType: Array.isArray(values.businessType)
        ? values.businessType.filter(Boolean)
        : [],
      overview: values.overview ?? "",
      location: values.location ?? {},
      contactMethod: values.contactMethod ?? "",
    };

    try {
      await onUpdateStore(store.id, input);
      toast.success("Profile updated", {
        description: "Your store details have been saved.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed.";
      toast.error("Update failed", { description: message });
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <StoreIdentityCard form={form} onSave={handleSave} saving={updating} />
        <StoreLogoCard store={store} onUpdateStore={onUpdateStore} />
      </div>

      <ContactLocationCard form={form} />
      <DashboardWrapper
        title="Social Platforms"
        description="Connect your store's social media accounts to engage with customers and expand your online presence."
      >
        <div className="mt-6 grid gap-4">
          {socialFields.map((field) => (
            <RegistrationInputField
              key={field.name}
              field={field}
              form={form}
            />
          ))}
        </div>
      </DashboardWrapper>
      <StoreMetadataCard store={store} userId={userId} />

      {updateError ? (
        <p className="text-sm text-red-600">{updateError}</p>
      ) : null}
    </div>
  );
}
