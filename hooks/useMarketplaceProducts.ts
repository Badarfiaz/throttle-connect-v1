import { useCallback, useState } from "react";
import { FETCHER_URL } from "@/lib/config";
import getFirebaseToken from "@/ulity/getFirebaseToken";
import { uploadImage } from "@/ulity/imageUpload";
import { toast } from "sonner";

type ImageUrlInput = {
  ref: string;
  url: string;
};

type CreateProductInput = {
  productName: string;
  imageurl?: ImageUrlInput;
  stock: number;
  price: number;
};

type MarketplaceProduct = {
  id: string;
  ownerUid: string;
  productName: string;
  imageurl?: ImageUrlInput;
  stock: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
};

const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateMarketplaceProductInput!) {
    createMarketplaceProduct(input: $input) {
      id
      ownerUid
      productName
      imageurl {
        ref
        url
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

const GET_PRODUCTS_QUERY = `
  query GetProducts {
    marketplaceProducts {
      id
      ownerUid
      productName
      imageurl {
        ref
        url
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($id: ID!, $input: UpdateMarketplaceProductInput!) {
    updateMarketplaceProduct(id: $id, input: $input) {
      id
      ownerUid
      productName
      imageurl {
        ref
        url
      }
      stock
      price
      createdAt
      updatedAt
    }
  }
`;

const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: ID!) {
    deleteMarketplaceProduct(id: $id)
  }
`;

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
      const { token } = await getFirebaseToken();

      if (!token) {
        throw new Error("Not authenticated. Please log in first.");
      }

      const res = await fetch(FETCHER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: GET_PRODUCTS_QUERY }),
      });

      const result = await res.json();

      if (!res.ok || result.errors) {
        const message = result?.errors
          ? JSON.stringify(result.errors, null, 2)
          : "Request failed.";
        throw new Error(message);
      }

      const fetchedProducts = result?.data?.marketplaceProducts ?? [];
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

  const createProduct = useCallback(
    async (input: CreateProductInput, imageFile?: File | null) => {
      setCreating(true);
      setError(null);

      try {
        const { token, uid } = await getFirebaseToken();

        if (!token || !uid) {
          throw new Error("Not authenticated. Please log in first.");
        }

        let imageUrlData: ImageUrlInput | undefined;

        // Upload image if provided
        if (imageFile) {
          const { url, path } = await uploadImage(imageFile, {
            ownerId: uid,
            folder: "products",
            maxSizeMb: 5,
          });

          imageUrlData = {
            ref: path,
            url,
          };
        }

        const productInput: CreateProductInput = {
          ...input,
          ...(imageUrlData && { imageurl: imageUrlData }),
        };

        const res = await fetch(FETCHER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: CREATE_PRODUCT_MUTATION,
            variables: { input: productInput },
          }),
        });

        const result = await res.json();

        if (!res.ok || result.errors) {
          const message = result?.errors
            ? JSON.stringify(result.errors, null, 2)
            : "Request failed.";
          throw new Error(message);
        }

        const newProduct = result?.data?.createMarketplaceProduct as
          | MarketplaceProduct
          | undefined;

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
      input: Partial<CreateProductInput>,
      imageFile?: File | null,
    ) => {
      setUpdating(true);
      setError(null);

      try {
        const { token, uid } = await getFirebaseToken();

        if (!token || !uid) {
          throw new Error("Not authenticated. Please log in first.");
        }

        let imageUrlData: ImageUrlInput | undefined;

        // Upload new image if provided
        if (imageFile) {
          const { url, path } = await uploadImage(imageFile, {
            ownerId: uid,
            folder: "products",
            maxSizeMb: 5,
          });

          imageUrlData = {
            ref: path,
            url,
          };
        }

        const productInput = {
          ...input,
          ...(imageUrlData && { imageurl: imageUrlData }),
        };

        const res = await fetch(FETCHER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: UPDATE_PRODUCT_MUTATION,
            variables: { id, input: productInput },
          }),
        });

        const result = await res.json();

        if (!res.ok || result.errors) {
          const message = result?.errors
            ? JSON.stringify(result.errors, null, 2)
            : "Request failed.";
          throw new Error(message);
        }

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
      const { token } = await getFirebaseToken();

      if (!token) {
        throw new Error("Not authenticated. Please log in first.");
      }

      const res = await fetch(FETCHER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: DELETE_PRODUCT_MUTATION,
          variables: { id },
        }),
      });

      const result = await res.json();

      if (!res.ok || result.errors) {
        const message = result?.errors
          ? JSON.stringify(result.errors, null, 2)
          : "Request failed.";
        throw new Error(message);
      }

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
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
