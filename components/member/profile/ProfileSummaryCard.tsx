"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Edit2,
  Compass,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { MemberProfile } from "@/types/member";
import { getStatBlocks, INTEREST_OPTIONS } from "./profileForm.constants";
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
    profileData.location?.area,
    profileData.location?.city,
    profileData.location?.province,
    profileData.location?.country,
  ]
    .filter(Boolean)
    .join(", ") || "Location not specified";

  const vehicleImages = React.useMemo(() => {
    const imgs = profileData.vehicle?.images;
    if (!imgs) return [];
    if (Array.isArray(imgs)) return imgs;
    return [imgs];
  }, [profileData.vehicle?.images]);

  const getInterestLabel = (value: string) => {
    return INTEREST_OPTIONS.find((opt) => opt.value === value)?.label || value;
  };

  const formattedDate = React.useMemo(() => {
    if (!profileData.createdAt) return null;
    try {
      return new Date(profileData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch (e) {
      return null;
    }
  }, [profileData.createdAt]);

  return (
    <div className="space-y-8">
      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        {/* Banner */}
        <div className="relative h-48 w-full bg-gradient-to-r from-primary via-[#1a365d] to-[#2b6cb0] opacity-95">
          {/* Decorative shapes */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        {/* Profile Details Area */}
        <div className="px-6 pb-8 pt-0 md:px-8">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar (Overlapping Banner) */}
            <div className="relative -mt-16 h-32 w-32 shrink-0 rounded-2xl border-4 border-card bg-muted shadow-2xl overflow-hidden group">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt={displayName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent text-accent-foreground text-3xl font-bold">
                  {initials}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="self-start sm:self-end mt-4 sm:mt-0">
              <Button
                onClick={onEdit}
                size="sm"
                className="gap-2 rounded-xl shadow-md transition-all hover:shadow-lg"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* User Meta */}
          <div className="mt-6 space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                  {displayName}
                </h1>
                <Badge className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 py-0.5 px-2.5 hover:bg-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Rider
                </Badge>
                <Badge variant="outline" className="text-muted-foreground border-border font-mono text-[10px]">
                  ID: {profileData.uid || "TCM-NEW"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  {location}
                </span>
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    Member since {formattedDate}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Passionate {profileData.vehicle?.type || "motorcycle"} enthusiast. Committed to safe riding, community exploration, and sharing track-day adventures.
            </p>

            {/* Quick Contacts */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-border/50">
              {profileData.email && (
                <a
                  href={`mailto:${profileData.email}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  {profileData.email}
                </a>
              )}
              {profileData.phone && (
                <a
                  href={`tel:${profileData.phone}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  {profileData.phone}
                </a>
              )}
              {profileData.whatsapp && (
                <a
                  href={`https://wa.me/${profileData.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  WhatsApp Connected
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {getStatBlocks(profileData).map((block) => (
          <Card key={block.label} className="border-border bg-card/60 backdrop-blur-xs transition-all hover:bg-card hover:shadow-md">
            <CardContent className="p-5 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {block.label}
              </p>
              <p className="text-xl font-extrabold text-primary">{block.value}</p>
              {block.helper && (
                <p className="text-xs text-muted-foreground">{block.helper}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Left Column for Ride & Interests, Right Column for Emergency & Safety */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Primary Ride Section */}
          <Card className="overflow-hidden border-border bg-card shadow-md">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Compass className="h-5 w-5 text-primary" />
                Primary Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {profileData.vehicle ? (
                <div className="space-y-6">
                  {/* Vehicle Meta Grid */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Brand</p>
                      <p className="text-sm font-semibold mt-0.5">{profileData.vehicle.brand || "N/A"}</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Model</p>
                      <p className="text-sm font-semibold mt-0.5">{profileData.vehicle.model || "N/A"}</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Year</p>
                      <p className="text-sm font-semibold mt-0.5">{profileData.vehicle.year || "N/A"}</p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</p>
                      <p className="text-sm font-semibold capitalize mt-0.5">{profileData.vehicle.type || "N/A"}</p>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {vehicleImages.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vehicle Showcase</h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {vehicleImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-xs group cursor-pointer"
                          >
                            <img
                              src={imgUrl}
                              alt={`${profileData.vehicle?.model} ${idx + 1}`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-xs font-semibold bg-black/60 px-2.5 py-1 rounded-md">View</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-border rounded-2xl bg-muted/10 text-center">
                      <Compass className="h-10 w-10 text-muted-foreground/40 mb-2" />
                      <p className="text-sm font-semibold text-muted-foreground">No vehicle photos uploaded</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">Edit your profile to showcase your ride.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No vehicle details registered.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card className="border-border bg-card shadow-md">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Sparkles className="h-5 w-5 text-primary" />
                Riding Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {profileData.interests && profileData.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {profileData.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="rounded-xl px-3.5 py-1.5 text-xs font-semibold bg-primary/5 text-primary border border-primary/10 transition-colors hover:bg-primary/10"
                    >
                      {getInterestLabel(interest)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No riding interests selected yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          <SafetyContactPanel profileData={profileData} />
        </div>
      </div>
    </div>
  );
}
