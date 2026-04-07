import React from "react";
import ProfileHero from "@/components/member/profile/ProfileHero";
import SafetyContactPanel from "@/components/member/profile/SafetyContactPanel";
import type { MemberProfile } from "@/components/member/registration/types";

const mockMemberProfile: MemberProfile = {
  uid: "TCM-9245",
  memberName: "Ahsan Baig",
  name: "Ahsan Baig",
  email: "ahsan.baig@throttleconnect.com",
  phone: "+92 333 1112233",
  whatsapp: "+92 333 1112233",
  profileImage:
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
  location: {
    city: "Karachi",
    area: "DHA Phase 6",
  },
  vehicle: {
    type: "bike",
    brand: "Yamaha",
    model: "YZF-R3",
    year: "2024",
    images: [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?auto=format&fit=crop&w=600&q=80",
    ],
  },
  drivingLicenseImage: "https://cdn.throttleconnect.com/docs/licenses/tcm-9245-license.jpg",
  emergencyContact: {
    name: "Hassan Baig",
    phone: "+92 321 9876543",
    bloodGroup: "O+",
  },
  experienceYears: "7+",
  interests: ["weekend", "touring", "events"],
  createdAt: "2026-01-24T11:30:00+05:00",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-12 md:px-8">
        <ProfileHero member={mockMemberProfile} />

        <div>
          <div className="space-y-6">
            <SafetyContactPanel member={mockMemberProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}
