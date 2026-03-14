"use client";

import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NetworkingDashboardTab } from "@/ulity/networkingDashboard";
import NetworkingProfileSection from "@/components/networking/dashboard/sections/ProfileSection";
import MembersSection from "@/components/networking/dashboard/sections/MembersSection";
import { useState } from "react";
import { dummyMembers, type NetworkingMember } from "@/dummydata/members";

export type ClubProfile = {
  name: string;
  userEmail: string;
  phone: string;
  clubName: string;
  city: string;
  clubType?: string;
  description?: string;
};

const networkStoreData: ClubProfile = {
  userEmail: "john@example.com",

  clubName: "Urban Riders Moto",
  name: "John Doe",
  phone: "+1-555-0100",
  city: "Portland, OR",
  clubType: "bike",
  description: "A community of motorcycle enthusiasts and riders.",
};
export type memberDataType = {
  id: number;
  memberName: string;
  email: string;
  phone: string;
};
const memberData: memberDataType[] = [
  {
    id: 1,
    memberName: "John Anderson",
    email: "badar@gmail.com",
    phone: "+1-555-0101",
  },
];

const NetworkingDashboardContainer = ({}) => {
  const [activeTab, setActiveTab] = useState<NetworkingDashboardTab>("profile");
  const [loading] = useState(false);
  const [updating] = useState(false);

  const navItems = [
    { id: "profile", label: "Club Profile", icon: "User" },
    { id: "members", label: "Members", icon: "Users" },
  ];

  const handleAcceptMember = async () => {
    // Simulate API call
  };

  const handleRejectMember = async () => {
    // Simulate API call
  };

  return (
    <DashboardContainer
      title={`${networkStoreData.clubName} Dashboard`}
      subtitle="Manage your club profile, members, and networking activities."
      navItems={navItems}
      activeId={activeTab}
      onNavigate={(id) => setActiveTab(id as NetworkingDashboardTab)}
      actions={
        <div className="flex items-center gap-2">
          {loading ? (
            <Badge variant="secondary">Loading club data</Badge>
          ) : (
            <Badge variant="secondary">Club ready</Badge>
          )}
          <Button size="sm" variant="outline">
            Club Settings
          </Button>
        </div>
      }
    >
      {activeTab === "profile" && (
        <NetworkingProfileSection
          clubData={networkStoreData}
          userId="user-123"
          updating={updating}
        />
      )}

      {activeTab === "members" && (
        <MembersSection
          members={memberData}
          loading={loading}
          onAcceptMember={handleAcceptMember}
          onRejectMember={handleRejectMember}
        />
      )}
    </DashboardContainer>
  );
};

export default NetworkingDashboardContainer;
