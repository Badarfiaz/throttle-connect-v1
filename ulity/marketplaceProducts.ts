import { FETCHER_URL } from "@/lib/config";
import {
  GET_FEATURED_PRODUCTS_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCTS_BY_OWNER_UID_QUERY,
} from "@/app/graphql/marketplace";
import getFirebaseToken from "@/ulity/getFirebaseToken";
import { uploadImage } from "@/ulity/imageUpload";
import type {
  MarketplaceProduct,
  MarketplaceProductImageInput,
} from "@/types/marketplace";
import { GET_PRODUCTS_BY_CATEGORY_QUERY } from "@/app/graphql/marketplace";

type GraphQLResult = {
  data?: Record<string, unknown>;
  errors?: unknown;
};

const marketplaceRequestCache = new Map<string, unknown>();
const marketplaceRequestPromises = new Map<string, Promise<unknown>>();

const fetchWithMemoryCache = async <T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
) => {
  if (marketplaceRequestCache.has(cacheKey)) {
    return marketplaceRequestCache.get(cacheKey) as T;
  }

  const inFlight = marketplaceRequestPromises.get(cacheKey);
  if (inFlight) {
    return inFlight as Promise<T>;
  }

  const requestPromise = fetcher()
    .then((result) => {
      marketplaceRequestCache.set(cacheKey, result as unknown);
      marketplaceRequestPromises.delete(cacheKey);
      return result;
    })
    .catch((error) => {
      marketplaceRequestPromises.delete(cacheKey);
      throw error;
    });

  marketplaceRequestPromises.set(cacheKey, requestPromise as Promise<unknown>);
  return requestPromise;
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

export const buildMarketplaceProductImageMultiInput = async (
  imageFiles: File[],
  ownerId: string,
): Promise<MarketplaceProductImageInput[]> => {
  if (!imageFiles.length) return [];

  const results = await Promise.all(
    imageFiles.map((file) =>
      uploadImage(file, { ownerId, folder: "products", maxSizeMb: 5 }),
    ),
  );

  return results.map(({ url, path }) => ({ ref: path, url }));
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

export const executeMarketplaceProductRequestPublic = async <TData>(
  query: string,
  variables?: Record<string, unknown>,
) => {
  const res = await fetch(FETCHER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

export const getMarketplaceFeaturedProducts = async () =>
  fetchWithMemoryCache("featured-products", async () => {
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
  });

export const getMarketplaceProducts = async () => {
  const { token, uid } = await getMarketplaceAuthContext();

  return fetchWithMemoryCache(`marketplace-products:${uid}`, async () => {
    const result = await executeMarketplaceProductRequest<{
      marketplaceProducts: MarketplaceProduct[];
    }>(GET_PRODUCTS_QUERY, token);

    return result?.data?.marketplaceProducts ?? [];
  });
};

export const getMarketplaceProductsByOwnerUid = async (ownerUid: string) => {
  if (!ownerUid) return [];

  return fetchWithMemoryCache(
    `marketplace-products-by-owner:${ownerUid}`,
    async () => {
      const res = await fetch(FETCHER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_PRODUCTS_BY_OWNER_UID_QUERY,
          variables: { ownerUid },
        }),
      });

      const result = (await res.json()) as GraphQLResult & {
        data?: { marketplaceProductsByOwnerUid?: MarketplaceProduct[] };
      };

      if (!res.ok || result.errors) {
        throw new Error(getMarketplaceGraphQLErrorMessage(result));
      }

      return result?.data?.marketplaceProductsByOwnerUid ?? [];
    },
  );
};

export const getProductsByCategory = async (category: string) => {
  return fetchWithMemoryCache(`products-by-category:${category}`, async () => {
    const res = await fetch(FETCHER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_PRODUCTS_BY_CATEGORY_QUERY,
        variables: { category },
      }),
    });

    const result = (await res.json()) as GraphQLResult & {
      data?: { getProductsByCategory?: MarketplaceProduct[] };
    };

    if (!res.ok || result.errors) {
      throw new Error(getMarketplaceGraphQLErrorMessage(result));
    }

    return result?.data?.getProductsByCategory ?? [];
  });
};
