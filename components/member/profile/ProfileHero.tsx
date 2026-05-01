"use client";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { MemberProfile } from "@/types/member";
import { useAppSelector } from "@/app/redux/hooks";
import SafetyContactPanel from "./SafetyContactPanel";

type ProfileHeroProps = {
  member: MemberProfile;
};

const statBlocks = (
  member: MemberProfile,
): Array<{ label: string; value: string; helper?: string }> => [
  {
    label: "Experience",
    value: member.experienceYears || "Fresh Rider",
    helper: "Years riding",
  },
  {
    label: "Primary Ride",
    value: member.vehicle?.model || member.vehicle?.brand || "Not specified",
    helper: member.vehicle?.brand,
  },
  {
    label: "Interests",
    value: `${member.interests?.length || 0}`,
    helper: "Active pursuits",
  },
];

export default function ProfileHero() {
  const user = useAppSelector((state) => state.auth.user);
  const profileData = user?.profileData;
  const displayName = profileData?.memberName || "Member Name unknown";
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-10 p-6 lg:flex-row lg:items-center lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative h-28 w-28 rounded-3xl border border-border/60 bg-muted/30 shadow-xl">
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
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
                {initials}
              </div>
            )}
            <Badge className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-primary text-primary-foreground shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </Badge>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                {profileData?.uid}
              </Badge>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {profileData?.location?.city || ""},{" "}
                {profileData?.location?.area || ""}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {displayName}
            </h1>
            <p className="text-base text-muted-foreground">
              Passionate {profileData?.vehicle?.type || "bike"} rider focused on
              community rides and safety-first adventures.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {profileData?.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                {profileData?.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          {(profileData ? statBlocks(profileData) : []).map((block) => (
            <div
              key={block.label}
              className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-center shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {block.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {block.value}
              </p>
              {block.helper && (
                <p className="text-xs text-muted-foreground">{block.helper}</p>
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
  );
}
