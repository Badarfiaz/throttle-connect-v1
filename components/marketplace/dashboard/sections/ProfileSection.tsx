"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { MarketplaceStore } from "@/types/marketplace";

type StaticProfile = {
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

type ProfileSectionProps = {
  store: MarketplaceStore | null;
  userEmail?: string | null;
  userId?: string | null;
  locationLabel: string;
  storeInitials: string;
  staticProfile: StaticProfile;
};

const ProfileSection = ({
  store,
  userEmail,
  userId,
  locationLabel,
  storeInitials,
  staticProfile,
}: ProfileSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Store Identity
              </h2>
              <p className="text-sm text-slate-500">
                Update your public-facing details.
              </p>
            </div>
            <Button size="sm" variant="outline">
              Save changes
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Store Title
              </label>
              <Input
                className="mt-2"
                defaultValue={store?.title ?? "Throttle Auto Hub"}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Business Type
              </label>
              <Input
                className="mt-2"
                defaultValue={store?.businessType ?? "Parts & Accessories"}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Overview
              </label>
              <Textarea
                className="mt-2"
                defaultValue={
                  store?.overview ??
                  "Specializing in performance parts, OEM replacements, and expert guidance for automotive enthusiasts."
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Contact Method
              </label>
              <Input
                className="mt-2"
                defaultValue={store?.contactMethod ?? "WhatsApp"}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Phone
              </label>
              <Input
                className="mt-2"
                defaultValue={store?.phone ?? "+92 312 555 2233"}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Store Logo</h2>
          <p className="text-sm text-slate-500">
            Add a brand mark to help buyers recognize your store.
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {storeInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {store?.title ?? "Throttle Auto Hub"}
              </p>
              <p className="text-xs text-slate-500">Recommended 512x512px</p>
            </div>
            <Button className="ml-auto" size="sm" variant="outline">
              Upload Logo
            </Button>
          </div>

          <div className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Website
                <Badge className="ml-2" variant="secondary">
                  Static
                </Badge>
              </label>
              <Input
                className="mt-2"
                defaultValue={staticProfile.website}
                disabled
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Social Links
                <Badge className="ml-2" variant="secondary">
                  Static
                </Badge>
              </label>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Input defaultValue={staticProfile.facebook} disabled />
                <Input defaultValue={staticProfile.instagram} disabled />
                <Input defaultValue={staticProfile.tiktok} disabled />
                <Input defaultValue={staticProfile.whatsapp} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Contact & Location</h2>
        <p className="text-sm text-slate-500">
          Manage how buyers reach you and where you operate.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Email
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.email ?? userEmail ?? "store@email.com"}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Address
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.address ?? "Main Boulevard, Gulberg"}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Area
            </label>
            <Input className="mt-2" defaultValue={store?.location?.area ?? "Gulberg"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              City
            </label>
            <Input className="mt-2" defaultValue={store?.location?.city ?? "Lahore"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Province
            </label>
            <Input className="mt-2" defaultValue={store?.location?.province ?? "Punjab"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Location Summary
            </label>
            <Input className="mt-2" defaultValue={locationLabel} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Store Metadata</h2>
        <p className="text-sm text-slate-500">
          System details captured during onboarding.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Owner UID
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.ownerUid ?? userId ?? "UID-0001"}
              disabled
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Created At
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.createdAt ?? "2024-01-15T12:30:00+05:00"}
              disabled
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Page Type
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.pageType ?? "marketplace"}
              disabled
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Onboard Type
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.onBoardType ?? "marketplace"}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
