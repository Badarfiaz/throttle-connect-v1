export type CategoryType =
  | "sedans"
  | "hatchbacks"
  | "offroad"
  | "super-cars"
  | "bikes"
  | "electric-bikes"
  | "superbikes"
  | "cruisers"
  | "vespa-scooter"
  | "sports-car"
  | "diy-tools"
  | "wrench"
  | "racing-flag"
  | "jeep"
  | "electric-car"
  | "vintage-car"
  | "electric-bike"
  | "cafe-racer"
  | "modified-bike";

export type Club = {
  id: string;
  name: string;
  categoryType: CategoryType;
  image: string;
  location: string;
  memberCount: number;
  logoUrl?: string;
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
export type OnBoardType = {
  storeTitle: string;
  email: string;
  contactNumber: string;
  address: string;
  selectCategory: string[]; // array of categories
  overview: string;
  location: {
    province: string;
    city: string;
    area: string;
  };
  completed: boolean;
  whatsappNumber: string;
  contactMethod: string;
  websiteLink: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};
export const SECTION_CONTAINER = "max-w-7xl mx-auto px-4 sm:px-6  lg:px-8";

export const SECTION_TITLE_CONTAINER = "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8";

export const CENTER_TEXT = "text-center text-sm";
export const SECTION_PADDING_Y = "py-5";
