import { MemberProfile } from "@/types/member";

export type StatBlock = { label: string; value: string; helper?: string };

export function getStatBlocks(member: MemberProfile): StatBlock[] {
  return [
    {
      label: "Experience",
      value:
        member.experienceYears !== undefined
          ? typeof member.experienceYears === "number"
            ? `${member.experienceYears} Years`
            : String(member.experienceYears)
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
}

export const INTEREST_OPTIONS = [
  { label: "Weekend Rides", value: "weekend" },
  { label: "Long Tours", value: "touring" },
  { label: "Track Days", value: "track" },
  { label: "Community Events", value: "events" },
  { label: "Volunteering", value: "volunteering" },
];

export const VEHICLE_TYPE_OPTIONS = [
  { label: "🏍 Motorcycle / Bike", value: "bike" },
  { label: "🚗 Car / SUV", value: "car" },
  { label: "Both", value: "both" },
];

export const EXPERIENCE_OPTIONS = [
  { label: "0 - 1 years", value: "0-1" },
  { label: "2 - 3 years", value: "2-3" },
  { label: "4 - 6 years", value: "4-6" },
  { label: "7+ years", value: "7+" },
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
