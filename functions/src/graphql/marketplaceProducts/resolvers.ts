import { Timestamp } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { COLLECTIONS } from "../../constants";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const normalizeTimestamp = (value: unknown) => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
};

const normalizeProductDocument = (id: string, data: Record<string, any>) => {
  const images = Array.isArray(data?.images) ? data.images.filter(Boolean) : [];
  // Set imageurl to the first image for backward compatibility
  const imageurl = images.length > 0 ? images[0] : null;

  return {
    id,
    ...data,
    images: images.length > 0 ? images : null,
    imageurl,
    createdAt: normalizeTimestamp(data?.createdAt),
    updatedAt: normalizeTimestamp(data?.updatedAt),
  };
};

const marketplaceProductsResolvers = {
  Query: {
    // Get all products for the store owner
    marketplaceProducts: async (_: any, __: any, context: { uid: string }) => {
      const { uid } = context;

      // if (!uid) {
      //   throw new Error("Unauthorized - Missing token");
      // }

      const snapshot = await db
        .collection(COLLECTIONS.MARKETPLACE_PRODUCTS)
        .where("ownerUid", "==", uid)
        .orderBy("createdAt", "desc")
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) =>
        normalizeProductDocument(doc.id, doc.data() as any),
      );
    },

    // Get all products for a specific store owner
    marketplaceProductsByOwnerUid: async (
      _: any,
      args: { ownerUid: string },
    ) => {
      const { ownerUid } = args;

      if (!ownerUid) {
        throw new Error("ownerUid is required.");
      }

      const snapshot = await db
        .collection(COLLECTIONS.MARKETPLACE_PRODUCTS)
        .where("ownerUid", "==", ownerUid)
        .orderBy("createdAt", "desc")
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) =>
        normalizeProductDocument(doc.id, doc.data() as any),
      );
    },

    // Get a single product by ID (public read)
    marketplaceProduct: async (_: any, args: { id: string }) => {
      const { id } = args;

      const docRef = db.collection(COLLECTIONS.MARKETPLACE_PRODUCTS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error("Product not found.");
      }

      const data = doc.data() as any;

      return normalizeProductDocument(doc.id, data as any);
    },
    getMarketplaceFeaturedProducts: async () => {
      const snapshot = await db
        .collection(COLLECTIONS.MARKETPLACE_PRODUCTS)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) =>
        normalizeProductDocument(doc.id, doc.data() as any),
      );
    },

    // Get all products by category
    getProductsByCategory: async (_: any, args: { category: string }) => {
      const { category } = args;

      if (!category || category.trim() === "") {
        throw new Error("Category is required.");
      }

      const snapshot = await db
        .collection(COLLECTIONS.MARKETPLACE_PRODUCTS)
        .where("category", "==", category)
        .orderBy("createdAt", "desc")
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) =>
        normalizeProductDocument(doc.id, doc.data() as any),
      );
    },
  },

  MarketplaceProduct: {
    owner: async (parent: any) => {
      try {
        const ownerUid = parent?.ownerUid;
        if (!ownerUid) return null;

        const snapshot = await db
          .collection(COLLECTIONS.MARKETPLACE_STORES)
          .where("ownerUid", "==", ownerUid)
          .where("completed", "==", true)
          .limit(1)
          .get();

        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          createdAt: normalizeTimestamp(data?.createdAt),
        };
      } catch (err) {
        return null;
      }
    },
  },

  Mutation: {
    // Create a new product
    createMarketplaceProduct: async (
      _: any,
      args: { input: Record<string, any> },
      context: { uid: string },
    ) => {
      const { uid } = context;

      if (!uid) {
        throw new Error("Unauthorized - Missing token");
      }
      const { input } = args;

      // Validate required fields
      if (!input.productName || input.productName.trim() === "") {
        throw new Error("Product name is required.");
      }
      if (input.stock === undefined || input.stock < 0) {
        throw new Error("Stock must be a non-negative number.");
      }
      if (input.price === undefined || input.price < 0) {
        throw new Error("Price must be a non-negative number.");
      }

      const date = Timestamp.now();
      const productData = {
        ownerUid: uid,
        productName: input.productName,
        images: input.images && input.images.length > 0 ? input.images : null,
        category: input.category || null,
        description: input.description || null,
        stock: input.stock,
        price: input.price,
        createdAt: date,
        updatedAt: date,
      };

      const docRef = await db
        .collection(COLLECTIONS.MARKETPLACE_PRODUCTS)
        .add(productData);
      const newDoc = await docRef.get();
      const data = newDoc.data() as any;

      return normalizeProductDocument(docRef.id, data as any);
    },

    // Update an existing product
    updateMarketplaceProduct: async (
      _: any,
      args: { id: string; input: Record<string, any> },
      context: { uid: string },
    ) => {
      const { uid } = context;

      if (!uid) {
        throw new Error("Unauthorized - Missing token");
      }
      const { id, input } = args;

      const docRef = db.collection(COLLECTIONS.MARKETPLACE_PRODUCTS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error("Product not found.");
      }

      const existing = doc.data() as any;

      // Verify ownership
      if (existing.ownerUid !== uid) {
        throw new Error("Unauthorized: you do not own this product.");
      }

      // Build update payload with only defined fields
      const update: Record<string, any> = {};

      if (input.productName !== undefined) {
        if (input.productName.trim() === "") {
          throw new Error("Product name cannot be empty.");
        }
        update.productName = input.productName;
      }

      if (input.stock !== undefined) {
        if (input.stock < 0) {
          throw new Error("Stock must be a non-negative number.");
        }
        update.stock = input.stock;
      }

      if (input.price !== undefined) {
        if (input.price < 0) {
          throw new Error("Price must be a non-negative number.");
        }
        update.price = input.price;
      }

      if (input.images !== undefined) {
        update.images =
          input.images && input.images.length > 0 ? input.images : null;
      }

      if (input.category !== undefined) {
        update.category = input.category;
      }

      if (input.description !== undefined) {
        update.description = input.description;
      }

      update.updatedAt = Timestamp.now();

      await docRef.update(update);

      const updated = (await docRef.get()).data() as any;
      return normalizeProductDocument(id, updated as any);
    },

    // Delete a product
    deleteMarketplaceProduct: async (
      _: any,
      args: { id: string },
      context: { uid: string },
    ) => {
      const { uid } = context;

      if (!uid) {
        throw new Error("Unauthorized - Missing token");
      }
      const { id } = args;

      const docRef = db.collection(COLLECTIONS.MARKETPLACE_PRODUCTS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error("Product not found.");
      }

      const data = doc.data() as any;

      // Verify ownership
      if (data.ownerUid !== uid) {
        throw new Error("Unauthorized: you do not own this product.");
      }

      await docRef.delete();
      return true;
    },
  },
};

export default marketplaceProductsResolvers;
