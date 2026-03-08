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

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

  // Validate file size
  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`Please upload an image under ${maxSizeMb}MB.`);
  }

  // Create safe filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const filePath = `${basePath}/${ownerId}/${folder}/${timestamp}-${safeName}`;

  // Upload to Firebase Storage
  const fileRef = ref(storage, filePath);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return {
    url,
    path: filePath,
  };
}
