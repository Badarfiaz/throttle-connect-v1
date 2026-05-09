import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";

export type ImageUploadOptions = {
  /**
   * The owner/user ID used in the storage path
   */
  ownerId: string;
  /**
   * The folder path within the owner's directory (e.g., "logo", "products", "banner")
   */
  folder: string;
  /**
   * Maximum file size in MB (default: 5)
   */
  maxSizeMb?: number;
  /**
   * Custom base path (default: "marketplaceStores")
   */
  basePath?: string;
};

export type ImageUploadResult = {
  url: string;
  path: string;
};

export type ImageUploadPathInput = {
  ownerId: string;
  folder: string;
  basePath?: string;
};

export const buildImageUploadPath = ({
  ownerId,
  folder,
  basePath = "marketplaceStores",
}: ImageUploadPathInput) => {
  const safeOwnerId = ownerId.trim();
  const safeFolder = folder.trim();

  if (!safeOwnerId) {
    throw new Error("Owner ID is required for image uploads.");
  }

  if (!safeFolder) {
    throw new Error("Upload folder is required for image uploads.");
  }

  return `${basePath}/${safeOwnerId}/${safeFolder}`;
};

export const validateImageFile = (file: File, maxSizeMb: number) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`Please upload an image under ${maxSizeMb}MB.`);
  }
};

export const readImagePreview = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error("Unable to read image preview."));
    };

    reader.readAsDataURL(file);
  });

/**
 * Validates and uploads an image file to Firebase Storage
 * @param file - The image file to upload
 * @param options - Upload configuration options
 * @returns Promise with the download URL and storage path
 * @throws Error if validation fails or upload fails
 */
export async function uploadImage(
  file: File,
  options: ImageUploadOptions,
): Promise<ImageUploadResult> {
  const {
    ownerId,
    folder,
    maxSizeMb = 5,
    basePath = "marketplaceStores",
  } = options;

  validateImageFile(file, maxSizeMb);

  // Create safe filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const uploadBasePath = buildImageUploadPath({
    ownerId,
    folder,
    basePath,
  });
  const filePath = `${uploadBasePath}/${timestamp}-${safeName}`;

  // Upload to Firebase Storage
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return {
    url,
    path: filePath,
  };
}
