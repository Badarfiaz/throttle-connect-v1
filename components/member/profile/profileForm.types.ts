import { MemberProfile } from "@/types/member";

export type ProfileFormValues = {
  memberName: string;
  phone: string;
  whatsapp: string;
  province: string;
  city: string;
  area: string;
  country: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  ModelYear: string;
  vehicleImages: string[];
  drivingLicenseImage: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  experienceYears: string;
  interests: string[];
  profileImage: string;
};

export type ExperienceOption = "0-1" | "2-3" | "4-6" | "7+";

const EXPERIENCE_YEARS_BY_OPTION: Record<ExperienceOption, number> = {
  "0-1": 1,
  "2-3": 2,
  "4-6": 5,
  "7+": 7,
};

function experienceYearsToOption(
  experienceYears: MemberProfile["experienceYears"],
): ExperienceOption | string {
  if (experienceYears === undefined) return "0-1";
  if (typeof experienceYears !== "number") return experienceYears;

  if (experienceYears <= 1) return "0-1";
  if (experienceYears <= 3) return "2-3";
  if (experienceYears <= 6) return "4-6";
  return "7+";
}

function experienceOptionToYears(option: string): number {
  if (option in EXPERIENCE_YEARS_BY_OPTION) {
    return EXPERIENCE_YEARS_BY_OPTION[option as ExperienceOption];
  }
  return parseInt(option, 10) || 2;
}

function toVehicleImagesArray(images: string[] | string | undefined): string[] {
  if (Array.isArray(images)) return images;
  return images ? [images] : [];
}

export function buildDefaultFormValues(
  profileData: MemberProfile | null | undefined,
  fallbackName: string,
): ProfileFormValues {
  return {
    memberName: profileData?.memberName ?? fallbackName ?? "",
    phone: profileData?.phone ?? "",
    whatsapp: profileData?.whatsapp ?? "",
    province: profileData?.location?.province ?? "",
    city: profileData?.location?.city ?? "",
    area: profileData?.location?.area ?? "",
    country: profileData?.location?.country ?? "",
    vehicleType: profileData?.vehicle?.type ?? "bike",
    vehicleBrand: profileData?.vehicle?.brand ?? "",
    vehicleModel: profileData?.vehicle?.model ?? "",
    ModelYear:
      profileData?.vehicle?.year !== undefined
        ? String(profileData.vehicle.year)
        : "",
    vehicleImages: toVehicleImagesArray(profileData?.vehicle?.images),
    drivingLicenseImage: profileData?.drivingLicenseImage ?? "",
    emergencyContactName: profileData?.emergencyContact?.name ?? "",
    emergencyContactPhone: profileData?.emergencyContact?.phone ?? "",
    bloodGroup: profileData?.emergencyContact?.bloodGroup ?? "O+",
    experienceYears: experienceYearsToOption(profileData?.experienceYears),
    interests: profileData?.interests ?? [],
    profileImage: profileData?.profileImage ?? "",
  };
}

export function buildProfileDocPayload(
  values: ProfileFormValues,
  context: { email?: string | null; userId: string },
  profileData: MemberProfile | null | undefined,
) {
  return {
    name: values.memberName?.trim() ?? "",
    email: context.email,
    phone: values.phone?.trim() ?? "",
    whatsapp: values.whatsapp?.trim() ?? "",
    profileImage: values.profileImage?.trim() ?? "",
    drivingLicenseImage: values.drivingLicenseImage?.trim() ?? "",

    profileData: {
      completed: true,
      createdAt: profileData?.createdAt ?? new Date().toISOString(),
      experienceYears: experienceOptionToYears(values.experienceYears),
      interests: values.interests ?? [],
      drivingLicenseImage: values.drivingLicenseImage?.trim() ?? "",
    },

    emergencyContact: {
      name: values.emergencyContactName?.trim() ?? "",
      phone: values.emergencyContactPhone?.trim() ?? "",
      bloodGroup: values.bloodGroup ?? "O+",
    },

    location: {
      city: values.city?.trim() ?? "",
      province: values.province?.trim() ?? "",
      country: values.country?.trim() ?? "UAE",
      area: values.area?.trim() ?? "",
    },

    vehicle: {
      type: values.vehicleType ?? "bike",
      brand: values.vehicleBrand?.trim() ?? "",
      model: values.vehicleModel?.trim() ?? "",
      year: parseInt(values.ModelYear, 10) || 2023,
      images: values.vehicleImages || [],
    },

    userId: context.userId,
    clubId: profileData?.clubId ?? null,
    membershipStatus: profileData?.membershipStatus ?? "none",
  };
}
