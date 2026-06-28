import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  MarketplaceService,
  MarketplaceServiceFormInput,
  ServiceReview,
} from "@/types/marketplace";
import {
  MY_STORE_SERVICES_QUERY,
  STORE_SERVICES_QUERY,
  FEATURED_SERVICES_QUERY,
  CREATE_MARKETPLACE_SERVICE_MUTATION,
  UPDATE_MARKETPLACE_SERVICE_MUTATION,
  DELETE_MARKETPLACE_SERVICE_MUTATION,
  ADD_SERVICE_REVIEW_MUTATION,
  GET_SERVICE_BY_ID_QUERY,
} from "@/app/graphql/marketplace";
import {
  executeMarketplaceProductRequest,
  executeMarketplaceProductRequestPublic,
  getMarketplaceAuthContext,
} from "@/ulity/marketplaceProducts";
import { uploadImage } from "@/ulity/imageUpload";

export const useMarketplaceServices = () => {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchMyServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await getMarketplaceAuthContext();
      const result = await executeMarketplaceProductRequest<{
        myStoreServices: MarketplaceService[];
      }>(MY_STORE_SERVICES_QUERY, token);
      const data = result?.data?.myStoreServices ?? [];
      console.log('data services ', data)
      setServices(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error("Failed to load services", { description: message });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStoreServices = useCallback(async (storeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeMarketplaceProductRequestPublic<{
        storeServices: MarketplaceService[];
      }>(STORE_SERVICES_QUERY, { storeId });
      const data = result?.data?.storeServices ?? [];
      setServices(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error("Failed to load store services", { description: message });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedServices = useCallback(async (limit = 12) => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeMarketplaceProductRequestPublic<{
        featuredServices: MarketplaceService[];
      }>(FEATURED_SERVICES_QUERY, { limit });
      const data = result?.data?.featuredServices ?? [];
      setServices(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServiceById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeMarketplaceProductRequestPublic<{
        marketplaceServiceById: MarketplaceService;
      }>(GET_SERVICE_BY_ID_QUERY, { id });
      const data = result?.data?.marketplaceServiceById;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = useCallback(
    async (input: MarketplaceServiceFormInput, imageFile?: File | null) => {
      setCreating(true);
      setError(null);
      try {
        const { token, uid } = await getMarketplaceAuthContext();

        let imageUrl: string | undefined;
        if (imageFile) {
          const { url } = await uploadImage(imageFile, {
            ownerId: uid,
            folder: "services",
          });
          imageUrl = url;
        }

        const result = await executeMarketplaceProductRequest<{
          createMarketplaceService: MarketplaceService;
        }>(CREATE_MARKETPLACE_SERVICE_MUTATION, token, {
          input: { ...input, ...(imageUrl ? { imageUrl } : {}) },
        });
        const newService = result?.data?.createMarketplaceService;
        if (newService) {
          setServices((prev) => [newService, ...prev]);
          toast.success("Service created", { description: "Your service has been listed." });
        }
        return newService ?? null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast.error("Failed to create service", { description: message });
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [],
  );

  const updateService = useCallback(
    async (
      storeId: string,
      serviceId: string,
      input: Partial<MarketplaceServiceFormInput>,
      imageFile?: File | null,
    ) => {
      setUpdating(true);
      setError(null);
      try {
        const { token, uid } = await getMarketplaceAuthContext();

        let imageUrl: string | undefined;
        if (imageFile) {
          const { url } = await uploadImage(imageFile, {
            ownerId: uid,
            folder: "services",
          });
          imageUrl = url;
        }

        const result = await executeMarketplaceProductRequest<{
          updateMarketplaceService: MarketplaceService;
        }>(UPDATE_MARKETPLACE_SERVICE_MUTATION, token, {
          storeId,
          serviceId,
          input: { ...input, ...(imageUrl ? { imageUrl } : {}) },
        });
        const updated = result?.data?.updateMarketplaceService;
        if (updated) {
          setServices((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
          );
          toast.success("Service updated", { description: "Changes saved." });
        }
        return updated ?? null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast.error("Failed to update service", { description: message });
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  const deleteService = useCallback(async (storeId: string, serviceId: string) => {
    setDeleting(true);
    setError(null);
    try {
      const { token } = await getMarketplaceAuthContext();
      await executeMarketplaceProductRequest<{
        deleteMarketplaceService: boolean;
      }>(DELETE_MARKETPLACE_SERVICE_MUTATION, token, { storeId, serviceId });
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast.success("Service removed.");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error("Failed to delete service", { description: message });
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  const addReview = useCallback(
    async (input: {
      storeId: string;
      serviceId: string;
      rating: number;
      comment?: string;
      reviewerName?: string;
    }) => {
      setSubmittingReview(true);
      setError(null);
      try {
        const { token } = await getMarketplaceAuthContext();
        const result = await executeMarketplaceProductRequest<{
          addServiceReview: ServiceReview;
        }>(ADD_SERVICE_REVIEW_MUTATION, token, { input });
        const review = result?.data?.addServiceReview;
        if (review) {
          setServices((prev) =>
            prev.map((s) => {
              if (s.id !== input.serviceId) return s;
              const reviews = [review, ...(s.reviews ?? [])];
              const reviewCount = reviews.length;
              const averageRating =
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
              return { ...s, reviews, reviewCount, averageRating };
            }),
          );
          toast.success("Review submitted!", { description: "Thank you for your feedback." });
        }
        return review ?? null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast.error("Failed to submit review", { description: message });
        throw err;
      } finally {
        setSubmittingReview(false);
      }
    },
    [],
  );

  return {
    services,
    loading,
    error,
    creating,
    updating,
    deleting,
    submittingReview,
    fetchMyServices,
    fetchStoreServices,
    fetchFeaturedServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    addReview,
  };
};
