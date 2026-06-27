"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, ShieldCheck, Edit2 } from "lucide-react";
import { MemberProfile } from "@/types/member";
import { getStatBlocks } from "./profileForm.constants";
import SafetyContactPanel from "./SafetyContactPanel";

interface ProfileSummaryCardProps {
  profileData: MemberProfile;
  displayName: string;
  initials: string;
  onEdit: () => void;
}

export default function ProfileSummaryCard({
  profileData,
  displayName,
  initials,
  onEdit,
}: ProfileSummaryCardProps) {
  const location = [
    profileData.location?.city || "City",
    profileData.location?.area,
    profileData.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="relative overflow-hidden rounded-4xl border border-border bg-card text-card-foreground shadow-2xl">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at top, hsl(var(--primary) / 0.18), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-40 blur-3xl lg:block"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-10 p-6 lg:flex-row lg:items-center lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative h-28 w-28 rounded-3xl border border-border/60 bg-muted/30 shadow-xl shrink-0">
            {profileData.profileImage ? (
              <div
                className="h-full w-full rounded-3xl object-cover"
                style={{
                  backgroundImage: `url(${profileData.profileImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-800 bg-slate-100 rounded-3xl">
                {initials}
              </div>
            )}
            <Badge className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-primary text-primary-foreground shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </Badge>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <Badge
                variant="secondary"
                className="bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700"
              >
                MEMBER
              </Badge>
              <span className="flex items-center gap-2 text-slate-400 font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                {location}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {displayName}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
              Passionate {profileData.vehicle?.type || "bike"} rider focused on
              community rides and safety-first adventures.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {profileData.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                {profileData.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          {getStatBlocks(profileData).map((block) => (
            <div
              key={block.label}
              className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-xs"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {block.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-[#19376D]">{block.value}</p>
              {block.helper && (
                <p className="text-xs text-slate-400 mt-0.5">{block.helper}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <SafetyContactPanel profileData={profileData} />
      </div>
    </section>
  );
}
