"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./hooks/useClubProfile";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Compass
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ClubProfileTabProps {
  club: any;
  user: any;
  isEditing: boolean;
  form: UseFormReturn<ProfileFormValues>;
  updating: boolean;
  updateError: string | null;
  logoUploading: boolean;
  bannerUploading: boolean;
  logoPreview: string | null;
  bannerPreview: string | null;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  bannerInputRef: React.RefObject<HTMLInputElement | null>;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSave: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleCancel: () => void;
}

export default function ClubProfileTab({
  club,
  user,
  isEditing,
  form,
  updating,
  updateError,
  logoUploading,
  bannerUploading,
  logoPreview,
  bannerPreview,
  logoInputRef,
  bannerInputRef,
  handleLogoUpload,
  handleBannerUpload,
  handleSave,
  handleCancel,
}: ClubProfileTabProps) {
  const clubName = club?.clubName ?? "My Automotive Club";
  const clubType = club?.clubType ?? "General Enthusiasts";
  const city = club?.city ?? "Not specified";

  const initials = clubName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word: string) => word[0]?.toUpperCase())
    .join("") || "AC";

  const getClubTypeLabel = (type: string) => {
    switch (type) {
      case "bike": return "Bike Club";
      case "car": return "Car Club";
      case "other": return club?.otherClubType || "Other Club";
      default: return type.replace("-", " ");
    }
  };

  const clubTypeWatch = form.watch("clubType");

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Identity Card */}
          <Card className="border border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                <Compass className="h-5 w-5 text-[#19376D]" />
                Club Identity
              </CardTitle>
              <CardDescription>Configure the core details of your club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Name <span className="text-red-500">*</span></label>
                <Input
                  placeholder="e.g. Cityline Sedan Society"
                  {...form.register("clubName", { required: "Club Name is required" })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                />
                {form.formState.errors.clubName && (
                  <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.clubName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Type <span className="text-red-500">*</span></label>
                <Select
                  value={form.watch("clubType")}
                  onValueChange={(val) => form.setValue("clubType", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                    <SelectValue placeholder="Select club type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">🏍 Bike Club</SelectItem>
                    <SelectItem value="car">🚗 Car Club</SelectItem>
                    <SelectItem value="other">🌟 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {clubTypeWatch === "other" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Specify Club Type <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="e.g. Offroad SUV Club"
                    {...form.register("otherClubType", { required: "Please specify the club type" })}
                    className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                  />
                  {form.formState.errors.otherClubType && (
                    <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.otherClubType.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Description</label>
                <Textarea
                  placeholder="Describe what makes your club unique..."
                  rows={4}
                  {...form.register("description")}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="border border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                <MessageSquare className="h-5 w-5 text-[#19376D]" />
                Contact & Location Details
              </CardTitle>
              <CardDescription>Help potential members find and reach your club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City / Location <span className="text-red-500">*</span></label>
                <Input
                  placeholder="e.g. Islamabad, PK"
                  {...form.register("city", { required: "City is required" })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                />
                {form.formState.errors.city && (
                  <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                <Input
                  type="tel"
                  placeholder="e.g. +92 300 1234567"
                  {...form.register("phone", { required: "Phone number is required" })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                />
                {form.formState.errors.phone && (
                  <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                <Input
                  type="email"
                  placeholder="e.g. contact@myclub.com"
                  {...form.register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Contact Method</label>
                <Select
                  value={form.watch("contactMethod")}
                  onValueChange={(val) => form.setValue("contactMethod", val as any, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Club Branding Card */}
        <Card className="border border-slate-200/80 shadow-xs bg-white mt-6">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
              <Compass className="h-5 w-5 text-[#19376D]" />
              Club Branding
            </CardTitle>
            <CardDescription>Upload a custom logo and banner for your club profile</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Logo</label>
              <div className="flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                {logoPreview || form.watch("logoUrl") ? (
                  <img
                    src={logoPreview || form.watch("logoUrl")}
                    alt="Logo Preview"
                    className="h-16 w-16 rounded-2xl object-cover border bg-white animate-in fade-in duration-200"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                    {initials}
                  </div>
                )}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={logoUploading}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoUploading ? "Uploading..." : "Upload Logo"}
                  </Button>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Banner</label>
              <div className="flex flex-col gap-3 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                {bannerPreview || form.watch("bannerUrl") ? (
                  <img
                    src={bannerPreview || form.watch("bannerUrl")}
                    alt="Banner Preview"
                    className="h-20 w-full rounded-lg object-cover border bg-white animate-in fade-in duration-200"
                  />
                ) : (
                  <div className="h-20 w-full rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 font-medium">
                    No Banner Uploaded
                  </div>
                )}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={bannerUploading}
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    {bannerUploading ? "Uploading..." : "Upload Banner"}
                  </Button>
                  <p className="text-[10px] text-slate-400 mt-1">Recommended size: 1200x300px</p>
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Socials Connection Card */}
        <Card className="border border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
              <Globe className="h-5 w-5 text-[#19376D]" />
              Social Media Links
            </CardTitle>
            <CardDescription>Provide links for members to explore your social pages</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Website URL</label>
              <Input
                placeholder="e.g. https://myclub.com"
                {...form.register("socialPlatforms.website")}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instagram URL</label>
              <Input
                placeholder="e.g. https://instagram.com/myclub"
                {...form.register("socialPlatforms.instagram")}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
              <Input
                placeholder="e.g. https://linkedin.com/company/myclub"
                {...form.register("socialPlatforms.linkedin")}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Other URL</label>
              <Input
                placeholder="e.g. Facebook Page, Twitter/X, etc."
                {...form.register("socialPlatforms.other")}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {updateError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
            {updateError}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={updating}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#19376D] hover:bg-[#0B2447] text-white" disabled={updating}>
            {updating ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    );
  }

  // View Mode
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
        {club?.bannerUrl && (
          <div className="w-full h-40 overflow-hidden relative border-b border-slate-100">
            <img
              src={club.bannerUrl}
              alt={`${clubName} Banner`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {club?.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={clubName}
                className="h-20 w-20 rounded-2xl object-cover border border-slate-200 bg-white shadow-md shrink-0"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold text-slate-900">{clubName}</h2>
                <Badge variant="secondary" className="capitalize text-xs bg-slate-100 border border-slate-200">
                  {getClubTypeLabel(clubType)}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                {city}
              </p>
              <p className="text-sm text-slate-600 max-w-xl italic mt-2">
                {club?.description ?? "No description provided yet. Click edit profile to add one."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details & Contact Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
              <Compass className="h-5 w-5 text-[#19376D]" />
              Club Information
            </CardTitle>
            <CardDescription>Details about your community parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Club Name</span>
              <span className="text-sm text-slate-900 font-semibold">{clubName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">Club Category</span>
              <span className="text-sm text-slate-900 font-semibold capitalize">{getClubTypeLabel(clubType)}</span>
            </div>
            {club?.otherClubType && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">Sub-type / Notes</span>
                <span className="text-sm text-slate-900 font-semibold">{club.otherClubType}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-500">City / Location</span>
              <span className="text-sm text-slate-900 font-semibold">{city}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
              <MessageSquare className="h-5 w-5 text-[#19376D]" />
              Contact & Socials
            </CardTitle>
            <CardDescription>How members get in touch with your club</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 py-2 border-b border-slate-100">
              <Phone className="h-4 w-4 text-[#19376D]" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Phone ({club?.contactMethod || "call"})</p>
                <p className="text-sm text-slate-900 font-medium">{club?.phone ?? "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2 border-b border-slate-100">
              <Mail className="h-4 w-4 text-[#19376D]" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="text-sm text-slate-900 font-medium">{club?.email ?? "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 py-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#19376D]" />
                <span className="text-sm text-slate-900 font-medium">Social Connections</span>
              </div>
              <div className="flex gap-2">
                {club?.socialPlatforms?.instagram && (
                  <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                    Instagram
                  </Badge>
                )}
                {club?.socialPlatforms?.website && (
                  <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                    Website
                  </Badge>
                )}
                {club?.socialPlatforms?.linkedin && (
                  <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                    LinkedIn
                  </Badge>
                )}
                {club?.socialPlatforms?.other && (
                  <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                    Other URL
                  </Badge>
                )}
                {!club?.socialPlatforms?.instagram && !club?.socialPlatforms?.website && !club?.socialPlatforms?.linkedin && !club?.socialPlatforms?.other && (
                  <span className="text-sm text-slate-500">None connected</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
