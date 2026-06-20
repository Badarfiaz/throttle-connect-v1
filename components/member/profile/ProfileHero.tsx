"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Edit2, 
  AlertCircle, 
  User, 
  Check, 
  Clock, 
  Compass, 
  MessageSquare,
  Activity,
  HeartHandshake
} from "lucide-react";
import { MemberProfile } from "@/types/member";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import SafetyContactPanel from "./SafetyContactPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { db } from "@/firebase";
import { collection, addDoc, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import { fetchUserProfileData } from "@/app/redux/features/authSlice";

type ProfileFormValues = {
  memberName: string;
  phone: string;
  whatsapp: string;
  province: string;
  city: string;
  area: string;
  country: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  ModelYear: string;
  vehicleImages: string;
  drivingLicenseImage: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  experienceYears: string;
  interests: string[];
  profileImage: string;
};

const statBlocks = (
  member: MemberProfile,
): Array<{ label: string; value: string; helper?: string }> => [
  {
    label: "Experience",
    value: member.experienceYears !== undefined
      ? (typeof member.experienceYears === "number" ? `${member.experienceYears} Years` : String(member.experienceYears))
      : "Fresh Rider",
    helper: "Years riding",
  },
  {
    label: "Primary Ride",
    value: member.vehicle?.model || member.vehicle?.brand || "Not specified",
    helper: member.vehicle?.brand || "No brand",
  },
  {
    label: "Interests",
    value: `${member.interests?.length || 0}`,
    helper: "Active pursuits",
  },
];

const interestsList = [
  { label: "Weekend Rides", value: "weekend" },
  { label: "Long Tours", value: "touring" },
  { label: "Track Days", value: "track" },
  { label: "Community Events", value: "events" },
  { label: "Volunteering", value: "volunteering" },
];

export default function ProfileHero() {
  const user = useAppSelector((state) => state.auth.user);
  const profileData = user?.profileData;
  const dispatch = useAppDispatch();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const displayName = profileData?.memberName || user?.name || "Member Name";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "TC";

  const defaultValues = useMemo<ProfileFormValues>(() => {
    // Map numeric experienceYears back to select values
    let expVal = "0-1";
    if (profileData?.experienceYears !== undefined) {
      if (typeof profileData.experienceYears === "number") {
        const num = profileData.experienceYears;
        if (num <= 1) expVal = "0-1";
        else if (num <= 3) expVal = "2-3";
        else if (num <= 6) expVal = "4-6";
        else expVal = "7+";
      } else {
        expVal = profileData.experienceYears;
      }
    }

    return {
      memberName: profileData?.memberName ?? user?.name ?? "",
      phone: profileData?.phone ?? "",
      whatsapp: profileData?.whatsapp ?? "",
      province: profileData?.location?.province ?? "",
      city: profileData?.location?.city ?? "",
      area: profileData?.location?.area ?? "",
      country: profileData?.location?.country ?? "",
      vehicleType: profileData?.vehicle?.type ?? "bike",
      vehicleBrand: profileData?.vehicle?.brand ?? "",
      vehicleModel: profileData?.vehicle?.model ?? "",
      ModelYear: profileData?.vehicle?.year !== undefined ? String(profileData.vehicle.year) : "",
      vehicleImages: Array.isArray(profileData?.vehicle?.images)
        ? (profileData.vehicle.images[0] ?? "")
        : (profileData?.vehicle?.images ?? ""),
      drivingLicenseImage: profileData?.drivingLicenseImage ?? "",
      emergencyContactName: profileData?.emergencyContact?.name ?? "",
      emergencyContactPhone: profileData?.emergencyContact?.phone ?? "",
      bloodGroup: profileData?.emergencyContact?.bloodGroup ?? "O+",
      experienceYears: expVal,
      interests: profileData?.interests ?? [],
      profileImage: profileData?.profileImage ?? "",
    };
  }, [profileData, user]);

  const form = useForm<ProfileFormValues>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  if (!user) {
    return null;
  }

  const selectedInterests = form.watch("interests") || [];
  const handleInterestToggle = (val: string) => {
    const current = [...selectedInterests];
    const index = current.indexOf(val);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(val);
    }
    form.setValue("interests", current, { shouldValidate: true });
  };

  const handleSave = form.handleSubmit(async (values) => {
    setSaving(true);
    
    // Map experienceYears string to a number
    const exp = values.experienceYears;
    const experienceYearsNum = exp === "0-1" ? 1 : exp === "2-3" ? 2 : exp === "4-6" ? 5 : exp === "7+" ? 7 : (parseInt(exp, 10) || 2);

    const userDocData = {
      name: values.memberName?.trim() ?? "",
      email: user.email,
      phone: values.phone?.trim() ?? "",
      whatsapp: values.whatsapp?.trim() ?? "",
      profileImage: values.profileImage?.trim() ?? "",
      
      profileData: {
        completed: true,
        createdAt: profileData?.createdAt ?? new Date().toISOString(),
        experienceYears: experienceYearsNum,
        interests: values.interests ?? [],
        drivingLicenseImage: values.drivingLicenseImage?.trim() ?? "",
      },

      emergencyContact: {
        name: values.emergencyContactName?.trim() ?? "",
        phone: values.emergencyContactPhone?.trim() ?? "",
        bloodGroup: values.bloodGroup ?? "O+",
      },

      location: {
        city: values.city?.trim() ?? "",
        province: values.province?.trim() ?? "",
        country: values.country?.trim() ?? "UAE",
        area: values.area?.trim() ?? "",
      },

      vehicle: {
        type: values.vehicleType ?? "bike",
        brand: values.vehicleBrand?.trim() ?? "",
        model: values.vehicleModel?.trim() ?? "",
        year: /^\d+$/.test(values.ModelYear) ? parseInt(values.ModelYear, 10) : (parseInt(values.ModelYear, 10) || 2023),
        images: values.vehicleImages ? [values.vehicleImages.trim()] : [],
      },

      userId: user.userId,
      clubId: profileData?.clubId ?? null,
      membershipStatus: profileData?.membershipStatus ?? "none",
    };

    try {
      const userDocRef = doc(db, "users", user.userId);
      await setDoc(userDocRef, userDocData, { merge: true });

      toast.success("Profile Saved", {
        description: "Your profile details have been saved successfully in users collection.",
      });
      
      // Refresh local store
      dispatch(fetchUserProfileData(user.userId));
      setShowEditDialog(false);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      toast.error("Save Failed", { description: msg });
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="space-y-8">
      {profileData ? (
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
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 flex flex-col gap-10 p-6 lg:flex-row lg:items-center lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="relative h-28 w-28 rounded-3xl border border-border/60 bg-muted/30 shadow-xl shrink-0">
                {profileData?.profileImage ? (
                  <div
                    className="h-full w-full rounded-3xl object-cover"
                    style={{
                      backgroundImage: `url(${profileData?.profileImage})`,
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
                    {profileData?.location?.city || "City"}
                    {profileData?.location?.area ? `, ${profileData.location.area}` : ""}
                    {profileData?.location?.country ? `, ${profileData.location.country}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {displayName}
                  </h1>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowEditDialog(true)}
                    className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
                  Passionate {profileData?.vehicle?.type || "bike"} rider focused on
                  community rides and safety-first adventures.
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {profileData?.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-500" />
                    {profileData?.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
              {statBlocks(profileData).map((block) => (
                <div
                  key={block.label}
                  className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-xs"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {block.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[#19376D]">
                    {block.value}
                  </p>
                  {block.helper && (
                    <p className="text-xs text-slate-400 mt-0.5">{block.helper}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {profileData && (
            <div className="w-full">
              <SafetyContactPanel profileData={profileData} />
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-3xl mx-auto my-10 shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertCircle className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Your profile is incomplete</h2>
          <p className="text-sm text-slate-500 max-w-md">
            Complete your rider information, primary vehicle brand/model, and emergency contacts to join automotive clubs and register for runs.
          </p>
          <Button 
            className="bg-[#19376D] hover:bg-[#0B2447] text-white font-semibold rounded-xl px-6 py-2 shadow-sm transition"
            onClick={() => setShowEditDialog(true)}
          >
            Complete Profile Now
          </Button>
        </section>
      )}

      {/* Profile Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 md:p-8 scrollbar-none">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-900">
              {profileData ? "Edit Rider Profile" : "Complete Rider Profile"}
            </DialogTitle>
            <DialogDescription>
              Provide details about yourself, your primary ride, and emergency contacts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Section 1: Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#19376D] flex items-center gap-1.5">
                  <User className="h-4 w-4" /> Personal Details
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Full Name *</label>
                    <Input
                      placeholder="e.g. Ahsan Baig"
                      {...form.register("memberName", { required: "Name is required" })}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Phone Number *</label>
                    <Input
                      type="tel"
                      placeholder="e.g. +92 333 1112233"
                      {...form.register("phone", { required: "Phone is required" })}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">WhatsApp Number</label>
                    <Input
                      type="tel"
                      placeholder="e.g. +92 333 1112233"
                      {...form.register("whatsapp")}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Province</label>
                      <Input
                        placeholder="Sindh"
                        {...form.register("province")}
                        className="border-slate-200 text-xs px-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">City *</label>
                      <Input
                        placeholder="Karachi"
                        {...form.register("city", { required: true })}
                        className="border-slate-200 text-xs px-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Area</label>
                      <Input
                        placeholder="DHA Phase 6"
                        {...form.register("area")}
                        className="border-slate-200 text-xs px-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Country *</label>
                      <Input
                        placeholder="UAE"
                        {...form.register("country", { required: true })}
                        className="border-slate-200 text-xs px-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Profile Image URL</label>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      {...form.register("profileImage")}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#19376D] flex items-center gap-1.5">
                  <Compass className="h-4 w-4" /> Primary Vehicle
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Vehicle Type</label>
                    <Select
                      value={form.watch("vehicleType")}
                      onValueChange={(val) => form.setValue("vehicleType", val)}
                    >
                      <SelectTrigger className="w-full border-slate-200">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">🏍 Motorcycle / Bike</SelectItem>
                        <SelectItem value="car">🚗 Car / SUV</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Vehicle Brand *</label>
                    <Input
                      placeholder="e.g. Yamaha or Honda"
                      {...form.register("vehicleBrand", { required: "Brand is required" })}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Vehicle Model *</label>
                    <Input
                      placeholder="e.g. YZF-R3 or Civic"
                      {...form.register("vehicleModel", { required: "Model is required" })}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Model Year</label>
                    <Input
                      placeholder="e.g. 2024"
                      {...form.register("ModelYear")}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Vehicle Images URL</label>
                    <Input
                      placeholder="Image URL for your ride"
                      {...form.register("vehicleImages")}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Safety, Verification & Emergency details */}
            <div className="border-t border-slate-100 pt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#19376D] flex items-center gap-1.5">
                  <Activity className="h-4 w-4" /> Safety & Documents
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Driving License Image URL</label>
                    <Input
                      placeholder="https://..."
                      {...form.register("drivingLicenseImage")}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Riding Experience</label>
                    <Select
                      value={form.watch("experienceYears")}
                      onValueChange={(val) => form.setValue("experienceYears", val)}
                    >
                      <SelectTrigger className="w-full border-slate-200">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0 - 1 years</SelectItem>
                        <SelectItem value="2-3">2 - 3 years</SelectItem>
                        <SelectItem value="4-6">4 - 6 years</SelectItem>
                        <SelectItem value="7+">7+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Riding Interests</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {interestsList.map((interest) => {
                        const isSelected = selectedInterests.includes(interest.value);
                        return (
                          <button
                            key={interest.value}
                            type="button"
                            onClick={() => handleInterestToggle(interest.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              isSelected
                                ? "bg-[#19376D] text-white border-[#19376D] shadow-xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {interest.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <HeartHandshake className="h-4 w-4" /> Emergency Contact
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Contact Name *</label>
                    <Input
                      placeholder="Emergency contact full name"
                      {...form.register("emergencyContactName", { required: "Required for safety" })}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Contact Phone *</label>
                    <Input
                      type="tel"
                      placeholder="Emergency phone number"
                      {...form.register("emergencyContactPhone", { required: "Required for safety" })}
                      className="border-slate-200 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Blood Group</label>
                    <Select
                      value={form.watch("bloodGroup")}
                      onValueChange={(val) => form.setValue("bloodGroup", val)}
                    >
                      <SelectTrigger className="w-full border-slate-200">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <Button type="button" variant="ghost" onClick={() => setShowEditDialog(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#19376D] hover:bg-[#0B2447] text-white" disabled={saving}>
                {saving ? "Saving Details..." : "Save Profile Details"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
