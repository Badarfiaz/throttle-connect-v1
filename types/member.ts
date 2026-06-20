import { locationFields } from "./CommonType";
export type MemberVehicle = {
  type: string;
  brand: string;
  model: string;
  year: string;
  images: string[] | string;
};
export type MemberEmergencyContact = {
  name: string;
  phone: string;
  bloodGroup: string;
};
export type MemberRegistrationFormValues = {
  completed?: boolean;
  memberName?: string;
  phone?: string;
  whatsapp?: string;
  profileImage?: string;
  province?: string;
  city?: string;
  area?: string;
  vehicleType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  ModelYear?: string;
  vehicleImages?: string;
  documents?: string;
  drivingLicenseImage?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  experienceYears?: string;
  interests?: string[];
};

export type MemberProfile = {
  userId?: string;
  uid?: string;
  ownerUid?: string;
  completed?: boolean;
  memberName?: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  profileImage?: string;
  location?: locationFields;
  vehicle?: MemberVehicle;
  drivingLicenseImage?: string;
  emergencyContact?: MemberEmergencyContact;
  experienceYears?: number | string;
  interests?: string[];
  createdAt?: string;
};
