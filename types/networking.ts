export type NetworkingContactMethod = "whatsapp" | "call" | "email";

export type NetworkingSocialPlatforms = Partial<{
  website: string;
  linkedin: string;
  instagram: string;
  other: string;
}>;

export type NetworkingStore = {
  id?: string;
  clubName?: string;
  clubType?: string;
  otherClubType?: string | null;
  description?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  contactMethod?: NetworkingContactMethod;
  socialPlatforms?: NetworkingSocialPlatforms | null;
  createdAt?: string | null;
  ownerUid?: string | null;
  pageType?: string | null;
  onBoardType?: string | null;
  completed?: boolean;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  upcomingEventsCount?: number | null;
  latestEventId?: string | null;
  gallery?: string[] | null;
  featured?: boolean;
};

export type NetworkingEventType =
  | "ride"
  | "drive"
  | "meetup"
  | "breakfast_run"
  | "road_trip"
  | "track_day"
  | "charity_event"
  | "workshop"
  | "offroad"
  | "exhibition";

export type NetworkingEventStatus = "upcoming" | "active" | "completed" | "cancelled";

export type NetworkingEventLocation = {
  name: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type NetworkingEvent = {
  id: string;
  title: string;
  description: string;
  eventType: NetworkingEventType;
  status: NetworkingEventStatus;
  clubId: string;
  clubName: string;
  clubLogo?: string | null;
  organizerUid: string;
  city: string;
  coverImage?: string | null;
  location: NetworkingEventLocation;
  startDateTime: string;
  endDateTime: string;
  maxParticipants?: number | null;
  participantCount: number;
  visibility: "public" | "private";
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NetworkingEventParticipant = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  profileImage?: string | null;
  status: "registered";
  registeredAt: string;
};
