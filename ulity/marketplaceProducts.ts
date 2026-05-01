import { FETCHER_URL } from "@/lib/config";
import { GET_FEATURED_PRODUCTS_QUERY } from "@/app/graphql/marketplace";
import getFirebaseToken from "@/ulity/getFirebaseToken";
import { uploadImage } from "@/ulity/imageUpload";
import type { MarketplaceProduct } from "@/types/marketplace";

type GraphQLResult = {
  data?: Record<string, unknown>;
  errors?: unknown;
};

export type MarketplaceProductImageInput = {
  ref: string;
  url: string;
};

export type MarketplaceProductFormInput = {
  productName: string;
  imageurl?: MarketplaceProductImageInput;
  stock: number;
  price: number;
};

export const AUTH_REQUIRED_MESSAGE = "Not authenticated. Please log in first.";

export const getMarketplaceAuthContext = async () => {
  const { token, uid } = await getFirebaseToken();

  if (!token || !uid) {
    throw new Error(AUTH_REQUIRED_MESSAGE);
  }

  return { token, uid };
};

export const buildMarketplaceProductImageInput = async (
  imageFile: File | null | undefined,
  ownerId: string,
) => {
  if (!imageFile) return undefined;

  const { url, path } = await uploadImage(imageFile, {
    ownerId,
    folder: "products",
    maxSizeMb: 5,
  });

  return {
    ref: path,
    url,
  } satisfies MarketplaceProductImageInput;
};

export const executeMarketplaceProductRequest = async <TData>(
  query: string,
  token: string,
  variables?: Record<string, unknown>,
) => {
  const res = await fetch(FETCHER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = (await res.json()) as GraphQLResult;

  if (!res.ok || result.errors) {
    throw new Error(getMarketplaceGraphQLErrorMessage(result));
  }

  return result as { data: TData };
};

export const getMarketplaceGraphQLErrorMessage = (result: GraphQLResult) =>
  result?.errors ? JSON.stringify(result.errors, null, 2) : "Request failed.";

export const getMarketplaceFeaturedProducts = async () => {
  const res = await fetch(FETCHER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_FEATURED_PRODUCTS_QUERY }),
  });

  const result = (await res.json()) as GraphQLResult & {
    data?: { getMarketplaceFeaturedProducts?: MarketplaceProduct[] };
  };

  if (!res.ok || result.errors) {
    throw new Error(getMarketplaceGraphQLErrorMessage(result));
  }

  return result?.data?.getMarketplaceFeaturedProducts ?? [];
};
