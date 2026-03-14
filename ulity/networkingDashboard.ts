import type { DashboardNavItem } from "@/components/shared/DashboardContainer";

export type NetworkingDashboardTab = "profile" | "members";

export const networkingNavItems: DashboardNavItem[] = [
  {
    id: "profile",
    label: "Club Profile",
    description: "Club details & information",
  },
  {
    id: "members",
    label: "Members",
    description: "Manage club members",
  },
];
