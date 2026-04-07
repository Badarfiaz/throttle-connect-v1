export type MemberProfile = {
  uid?: string;
  memberName?: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  profileImage?: string;
  city?: string;
  province?: string;
  area?: string;
  location?: {
    city: string;
    area: string;
    province?: string;
  };
  vehicleType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  ModelYear?: string;
  vehicleImages?: string;
  vehicle?: {
    type: string;
    brand: string;
    model: string;
    year: string;
    images: string[] | string;
  };
  drivingLicenseImage?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    bloodGroup: string;
  };
  experienceYears?: string;
  interests?: string[];
  createdAt?: string;
};
