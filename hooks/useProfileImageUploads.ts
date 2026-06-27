import { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { uploadImage } from "@/ulity/imageUpload";
import { ProfileFormValues } from "@/components/member/profile/profileForm.types";

type UploadFolder = "profile" | "license" | "vehicles";

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

async function uploadAndNotify(
  file: File,
  ownerId: string,
  folder: UploadFolder,
  successTitle: string,
  successDescription: string,
) {
  const { url } = await uploadImage(file, {
    ownerId,
    folder,
    basePath: "members",
  });
  toast.success(successTitle, { description: successDescription });
  return url;
}

export function useProfileImageUploads(
  form: UseFormReturn<ProfileFormValues>,
  userId: string,
) {
  const profileFileRef = useRef<HTMLInputElement>(null);
  const licenseFileRef = useRef<HTMLInputElement>(null);
  const vehicleFileRef = useRef<HTMLInputElement>(null);

  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [uploadingVehicle, setUploadingVehicle] = useState(false);

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    try {
      const url = await uploadAndNotify(
        file,
        userId,
        "profile",
        "Profile Photo Uploaded",
        "Your profile photo has been updated.",
      );
      form.setValue("profileImage", url, { shouldValidate: true });
    } catch (err) {
      console.error(err);
      toast.error("Upload Failed", {
        description: getErrorMessage(err, "Failed to upload photo"),
      });
    } finally {
      setUploadingProfile(false);
      e.target.value = "";
    }
  };

  const handleLicenseImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLicense(true);
    try {
      const url = await uploadAndNotify(
        file,
        userId,
        "license",
        "Driving License Uploaded",
        "Your driving license has been updated.",
      );
      form.setValue("drivingLicenseImage", url, { shouldValidate: true });
    } catch (err) {
      console.error(err);
      toast.error("Upload Failed", {
        description: getErrorMessage(err, "Failed to upload license"),
      });
    } finally {
      setUploadingLicense(false);
      e.target.value = "";
    }
  };

  const handleVehicleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVehicle(true);
    try {
      const url = await uploadAndNotify(
        file,
        userId,
        "vehicles",
        "Vehicle Photo Uploaded",
        "Vehicle photo added to your garage gallery.",
      );
      const current = form.getValues("vehicleImages") || [];
      form.setValue("vehicleImages", [...current, url], {
        shouldValidate: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("Upload Failed", {
        description: getErrorMessage(err, "Failed to upload vehicle photo"),
      });
    } finally {
      setUploadingVehicle(false);
      e.target.value = "";
    }
  };

  const removeVehicleImage = (indexToRemove: number) => {
    const current = form.getValues("vehicleImages") || [];
    form.setValue(
      "vehicleImages",
      current.filter((_, idx) => idx !== indexToRemove),
      { shouldValidate: true },
    );
  };

  return {
    profileFileRef,
    licenseFileRef,
    vehicleFileRef,
    uploadingProfile,
    uploadingLicense,
    uploadingVehicle,
    handleProfileImageUpload,
    handleLicenseImageUpload,
    handleVehicleImageUpload,
    removeVehicleImage,
  };
}
