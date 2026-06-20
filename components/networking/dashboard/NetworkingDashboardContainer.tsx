"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Calendar, 
  Plus,
  Compass,
  Edit2,
  Check,
  X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNetworkingStore } from "@/hooks/useNetworkingStore";
import { setNetworkingStore } from "@/app/redux/features/authSlice";

type DashboardTab = "profile" | "members" | "events";

type ProfileFormValues = {
  clubName: string;
  clubType: string;
  otherClubType: string;
  description: string;
  city: string;
  phone: string;
  email: string;
  contactMethod: "whatsapp" | "call" | "email";
  socialPlatforms: {
    website: string;
    linkedin: string;
    instagram: string;
    other: string;
  };
};

const networkingNavItems = [
  {
    id: "profile",
    label: "Club Profile",
    description: "Club details & settings",
  },
  {
    id: "members",
    label: "Members",
    description: "Manage club members",
    badge: "8",
  },
  {
    id: "events",
    label: "Club Events",
    description: "Organize runs & meets",
    badge: "3",
  },
];

export default function NetworkingDashboardContainer() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  const user = useAppSelector((state) => state.auth.user);
  const club = user?.networking;
  const dispatch = useAppDispatch();
  
  const { updateNetworkingStore, updating, updateError } = useNetworkingStore();

  const defaultValues = useMemo<ProfileFormValues>(() => {
    return {
      clubName: club?.clubName ?? "",
      clubType: club?.clubType ?? "bike",
      otherClubType: club?.otherClubType ?? "",
      description: club?.description ?? "",
      city: club?.city ?? "",
      phone: club?.phone ?? "",
      email: club?.email ?? user?.email ?? "",
      contactMethod: (club?.contactMethod as any) ?? "email",
      socialPlatforms: {
        website: club?.socialPlatforms?.website ?? "",
        linkedin: club?.socialPlatforms?.linkedin ?? "",
        instagram: club?.socialPlatforms?.instagram ?? "",
        other: club?.socialPlatforms?.other ?? "",
      },
    };
  }, [club, user]);

  const form = useForm<ProfileFormValues>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-muted-foreground animate-pulse text-lg font-medium">
          Loading user session...
        </p>
      </div>
    );
  }

  const clubName = club?.clubName ?? "My Automotive Club";
  const clubType = club?.clubType ?? "General Enthusiasts";
  const city = club?.city ?? "Not specified";
  
  const initials = clubName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "AC";

  const getClubTypeLabel = (type: string) => {
    switch (type) {
      case "bike": return "Bike Club";
      case "car": return "Car Club";
      case "other": return club?.otherClubType || "Other Club";
      default: return type.replace("-", " ");
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    const clubId = club?.id || user.userId;
    if (!clubId) {
      toast.error("User ID Not Found", {
        description: "Please log in again.",
      });
      return;
    }

    const input = {
      id: clubId,
      clubName: values.clubName?.trim() ?? "",
      clubType: values.clubType ?? "bike",
      otherClubType: values.clubType === "other" ? values.otherClubType?.trim() : "",
      description: values.description?.trim() ?? "",
      city: values.city?.trim() ?? "",
      phone: values.phone?.trim() ?? "",
      email: values.email?.trim() ?? "",
      contactMethod: values.contactMethod ?? "email",
      socialPlatforms: {
        website: values.socialPlatforms?.website?.trim() ?? "",
        linkedin: values.socialPlatforms?.linkedin?.trim() ?? "",
        instagram: values.socialPlatforms?.instagram?.trim() ?? "",
        other: values.socialPlatforms?.other?.trim() ?? "",
      },
      completed: true,
      ownerUid: user.userId,
      onBoardType: "networking",
      pageType: "networking",
    };

    try {
      const updated = await updateNetworkingStore(clubId, input);
      if (updated) {
        dispatch(setNetworkingStore(updated));
        toast.success("Profile Updated", {
          description: "Your club profile details have been saved successfully.",
        });
        setIsEditing(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error("Update Failed", { description: msg });
    }
  });

  const handleCancel = () => {
    form.reset(defaultValues);
    setIsEditing(false);
  };

  // Dummy member data
  const dummyMembers = [
    { name: "Ali Khan", role: "Club President", joined: "Jan 2026", avatar: "AK", active: true },
    { name: "Zainab Shah", role: "Co-Founder", joined: "Jan 2026", avatar: "ZS", active: true },
    { name: "Hamza Malik", role: "Event Coordinator", joined: "Feb 2026", avatar: "HM", active: true },
    { name: "Bilal Ahmed", role: "Ride Lead", joined: "Feb 2026", avatar: "BA", active: true },
    { name: "Sana Yusuf", role: "Marketing Lead", joined: "Mar 2026", avatar: "SY", active: true },
    { name: "Raza Ali", role: "Member (Honda Civic)", joined: "Apr 2026", avatar: "RA", active: false },
    { name: "Fatima Noor", role: "Member (Vespa)", joined: "May 2026", avatar: "FN", active: false },
    { name: "Osman Tariq", role: "Member (Ninja 650)", joined: "Jun 2026", avatar: "OT", active: false },
  ];

  // Dummy events data
  const dummyEvents = [
    {
      title: "Sunday Morning Breakfast Run",
      date: "Sunday, June 28, 2026",
      time: "06:30 AM",
      location: "McDonald's M2 Motorway, Lahore",
      type: "Ride/Drive",
      status: "Upcoming",
    },
    {
      title: "Monsoon Track Meetup",
      date: "Saturday, July 11, 2026",
      time: "04:00 PM",
      location: "Gaddafi Stadium Parking, Lahore",
      type: "Meetup",
      status: "Upcoming",
    },
    {
      title: "Car & Bike Show 2026",
      date: "Sunday, May 17, 2026",
      time: "10:00 AM",
      location: "Expo Center, Lahore",
      type: "Exhibition",
      status: "Past",
    },
  ];

  const clubTypeWatch = form.watch("clubType");

  return (
    <DashboardContainer
      title={clubName}
      subtitle={`Manage your club profile, coordinate meets, and build your auto community.`}
      navItems={networkingNavItems}
      activeId={activeTab}
      onNavigate={(id) => {
        setActiveTab(id as DashboardTab);
        setIsEditing(false);
      }}
      actions={
        <div className="flex items-center gap-2">
          {activeTab === "profile" && (
            <>
              {isEditing ? (
                <>
                  <Button size="sm" variant="ghost" onClick={handleCancel} disabled={updating}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-[#19376D] hover:bg-[#0B2447] text-white" onClick={handleSave} disabled={updating}>
                    <Check className="h-4 w-4 mr-1" /> {updating ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button size="sm" className="bg-[#19376D] hover:bg-[#0B2447] text-white" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
                </Button>
              )}
            </>
          )}
          <Badge variant="secondary" className="bg-[#19376D]/10 text-[#19376D] font-medium border border-[#19376D]/20">
            Club Active
          </Badge>
          <Button size="sm" variant="outline" onClick={() => window.location.href = `/networking/Club-Profile/${club?.id ?? user?.userId}`}>
            View Club Page
          </Button>
        </div>
      }
    >
      {activeTab === "profile" && (
        isEditing ? (
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
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="border border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
                    {initials}
                  </div>
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
        )
      )}

      {activeTab === "members" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Club Roster</h3>
              <p className="text-sm text-slate-500">Manage and view all registered club members</p>
            </div>
            <Button size="sm" className="bg-[#19376D] hover:bg-[#0B2447] text-white">
              <Plus className="h-4 w-4 mr-1.5" />
              Invite Member
            </Button>
          </div>

          <Card className="border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {dummyMembers.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-100 text-[#19376D] font-bold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Joined {member.joined}</span>
                    <Badge variant={member.active ? "default" : "secondary"} className={member.active ? "bg-emerald-500 text-white font-medium" : "font-normal"}>
                      {member.active ? "Officer" : "Member"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Events Schedule</h3>
              <p className="text-sm text-slate-500">Create meetups, drives, and exhibitions</p>
            </div>
            <Button size="sm" className="bg-[#19376D] hover:bg-[#0B2447] text-white">
              <Plus className="h-4 w-4 mr-1.5" />
              Plan Event
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dummyEvents.map((event, i) => (
              <Card key={i} className="border border-slate-100 shadow-sm hover:shadow-md transition duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge className={event.status === "Upcoming" ? "bg-amber-500 text-white" : "bg-slate-500 text-white"}>
                      {event.status}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{event.type}</span>
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900 mt-2 line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1 text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2">
                  <p><strong>Time:</strong> {event.time}</p>
                  <p className="line-clamp-2"><strong>Location:</strong> {event.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </DashboardContainer>
  );
}
