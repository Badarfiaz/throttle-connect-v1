"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { MemberProfile } from "../registration/types";

type ProfileHeroProps = {
  member: MemberProfile;
};

const statBlocks = (
  member: MemberProfile
): Array<{ label: string; value: string; helper?: string }> => [
  {
    label: "Experience",
    value: member.experienceYears || "Fresh Rider",
    helper: "Years riding",
  },
  {
    label: "Primary Ride",
    value: member.vehicle.model || member.vehicle.brand,
    helper: member.vehicle.brand,
  },
  {
    label: "Interests",
    value: `${member.interests.length}`,
    helper: "Active pursuits",
  },
];

export default function ProfileHero({ member }: ProfileHeroProps) {
  const initials = member.name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
      <div className="relative flex flex-col gap-10 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-10">

        {/* LEFT */}
        <div className="flex items-center gap-6">

          {/* Avatar */}
          <div className="relative">

            <div className="h-28 w-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xl font-semibold text-black shadow-md">

              {member.profileImage ? (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${member.profileImage})` }}
                />
              ) : (
                initials
              )}

            </div>

            {/* VERIFIED BADGE */}
            <div className="absolute -bottom-1 -right-1">
              <Badge className="flex items-center gap-1 bg-[#1E3A8A] text-white shadow-md px-2 py-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </Badge>
            </div>

          </div>

          {/* TEXT */}
          <div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">

              <Badge variant="secondary">{member.uid}</Badge>

              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#1E3A8A]" />
                {member.location.city}, {member.location.area}
              </span>

            </div>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {member.name}
            </h1>

            <p className="text-gray-500 mt-1">
              Passionate {member.vehicle.type} rider focused on community rides
              and safety-first adventures.
            </p>

            <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">

              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1E3A8A]" />
                {member.email}
              </span>

              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#1E3A8A]" />
                {member.phone}
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT STATS */}
        <div className="grid grid-cols-3 gap-6">

          {statBlocks(member).map((block) => (
            <div
              key={block.label}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                {block.label}
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 whitespace-nowrap">
                {block.value}
              </p>

              {block.helper && (
                <p className="mt-1 text-xs text-gray-500">
                  {block.helper}
                </p>
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}