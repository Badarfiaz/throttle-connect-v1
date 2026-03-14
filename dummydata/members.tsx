export type NetworkingMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clubName: string;
  city: string;
  position?: string;
  joinDate: string;
  avatar?: string;
  status: "pending" | "approved" | "rejected";
};

export const dummyMembers: NetworkingMember[] = [
  {
    id: "m1",
    name: "John Anderson",
    email: "john.anderson@email.com",
    phone: "+1-555-0101",
    clubName: "Urban Riders Moto",
    city: "Portland, OR",
    position: "Member",
    joinDate: "2024-01-15",
    avatar: "/images/category/sedan.webp",
    status: "pending",
  },
  {
    id: "m2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0102",
    clubName: "Trail Off Roaders",
    city: "Flagstaff, AZ",
    position: "Co-Lead",
    joinDate: "2024-02-20",
    avatar: "/images/category/hatchback.webp",
    status: "pending",
  },
  {
    id: "m3",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1-555-0103",
    clubName: "V12-Espresso",
    city: "Miami, FL",
    position: "Member",
    joinDate: "2024-03-10",
    avatar: "/images/category/offroad.webp",
    status: "approved",
  },
  {
    id: "m4",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "+1-555-0104",
    clubName: "German Executive Crew",
    city: "Chicago, IL",
    position: "Member",
    joinDate: "2024-01-22",
    avatar: "/images/category/supercar.webp",
    status: "approved",
  },
  {
    id: "m5",
    name: "David Martinez",
    email: "david.m@email.com",
    phone: "+1-555-0105",
    clubName: "Compact Hatch Collective",
    city: "Austin, TX",
    position: "Member",
    joinDate: "2024-02-05",
    avatar: "/images/category/sedan.webp",
    status: "pending",
  },
  {
    id: "m6",
    name: "Lisa Thompson",
    email: "lisa.t@email.com",
    phone: "+1-555-0106",
    clubName: "Cityline Sedan Society",
    city: "San Francisco, CA",
    position: "Vice Lead",
    joinDate: "2024-03-01",
    avatar: "/images/category/offroad.webp",
    status: "approved",
  },
];
