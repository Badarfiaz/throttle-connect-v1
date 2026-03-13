export type MemberProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  profileImage: string;
  location: {
    city: string;
    country: string;
  };
  vehicle: {
    type: string;
    brand: string;
    model: string;
    year: string;
    images: string[] | string;
  };
  documents: {
    drivingLicenseImage: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    bloodGroup: string;
  };
  experienceYears: string;
  interests: string[];
  createdAt: string;
};
