export type CategoryType =
  | "sedans"
  | "hatchbacks"
  | "offroad"
  | "super-cars"
  | "bikes"
  | "electric-bikes"
  | "superbikes"
  | "cruisers";

export type Club = {
  id: string;
  name: string;
  categoryType: CategoryType;
  image: string;
  location: string;
  memberCount: number;
  description: string;
  createdBy: string;
};

export interface EventItem {
  id: string;
  title: string;
  image: string;
  hostedBy: string;
  slotsAvailable: number;
  totalSlots: number;
  date: string;
  description: string;
  category: string;
  rating: number;
  startTime: string;
  location: string;
  invitedClubs: string[];
}
