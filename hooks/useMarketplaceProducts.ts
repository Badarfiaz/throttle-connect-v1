import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  MarketplaceProduct,
  MarketplaceProductFormInput,
} from "@/types/marketplace";
import {
  CREATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
  GET_PRODUCT_BY_ID_QUERY,
  GET_PRODUCTS_QUERY,
  UPDATE_PRODUCT_MUTATION,
} from "@/app/graphql/marketplace";
import {
  buildMarketplaceProductImageInput,
  executeMarketplaceProductRequest,
  executeMarketplaceProductRequestPublic,
  getMarketplaceAuthContext,
  getMarketplaceProducts,
} from "@/ulity/marketplaceProducts";

export const useMarketplaceProducts = () => {
  const [products, setProducts] = useState<MarketplaceProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedProducts = await getMarketplaceProducts();
      setProducts(fetchedProducts);

      return fetchedProducts as MarketplaceProduct[];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error("Failed to fetch products", { description: message });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeMarketplaceProductRequestPublic<{
        marketplaceProduct: MarketplaceProduct | null;
      }>(GET_PRODUCT_BY_ID_QUERY, { id });

      return result?.data?.marketplaceProduct ?? null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error("Failed to fetch product", { description: message });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (input: MarketplaceProductFormInput, imageFile?: File | null) => {
      setCreating(true);
      setError(null);

      try {
        const { token, uid } = await getMarketplaceAuthContext();
        const imageUrlData = await buildMarketplaceProductImageInput(
          imageFile,
          uid,
        );

        const productInput: MarketplaceProductFormInput = {
          ...input,
          ...(imageUrlData && { imageurl: imageUrlData }),
        };
        const result = await executeMarketplaceProductRequest<{
          createMarketplaceProduct: MarketplaceProduct;
        }>(CREATE_PRODUCT_MUTATION, token, { input: productInput });

        const newProduct = result?.data?.createMarketplaceProduct as
          | MarketplaceProduct
          | undefined;
        console.log("newProduct", newProduct);
        if (newProduct) {
          setProducts((prev) => (prev ? [newProduct, ...prev] : [newProduct]));
          toast.success("Product created", {
            description: "Your product has been added successfully.",
          });
        }

        return newProduct ?? null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast.error("Failed to create product", { description: message });
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [],
  );

  const updateProduct = useCallback(
    async (
      id: string,
      input: Partial<MarketplaceProductFormInput>,
      imageFile?: File | null,
    ) => {
      setUpdating(true);
      setError(null);

      try {
        const { token, uid } = await getMarketplaceAuthContext();
        const imageUrlData = await buildMarketplaceProductImageInput(
          imageFile,
          uid,
        );

        const productInput = {
          ...input,
          ...(imageUrlData && { imageurl: imageUrlData }),
        };

        const result = await executeMarketplaceProductRequest<{
          updateMarketplaceProduct: MarketplaceProduct;
        }>(UPDATE_PRODUCT_MUTATION, token, { id, input: productInput });

        const updatedProduct = result?.data?.updateMarketplaceProduct as
          | MarketplaceProduct
          | undefined;

        if (updatedProduct) {
          setProducts((prev) => {
            if (!prev) return [updatedProduct];
            return prev.map((item) =>
              item.id === updatedProduct.id ? updatedProduct : item,
            );
          });
          toast.success("Product updated", {
            description: "Your product has been updated successfully.",
          });
        }

        return updatedProduct ?? null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast.error("Failed to update product", { description: message });
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  const deleteProduct = useCallback(async (id: string) => {
    setDeleting(true);
    setError(null);

    try {
      const { token } = await getMarketplaceAuthContext();
      await executeMarketplaceProductRequest<{
        deleteMarketplaceProduct: boolean;
      }>(DELETE_PRODUCT_MUTATION, token, { id });

      setProducts((prev) => {
        if (!prev) return prev;
        return prev.filter((item) => item.id !== id);
      });

      toast.success("Product deleted", {
        description: "The product has been removed.",
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      toast.error("Failed to delete product", { description: message });
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    creating,
    updating,
    deleting,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
