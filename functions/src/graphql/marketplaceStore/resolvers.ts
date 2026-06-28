import { Timestamp } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { COLLECTIONS } from "../../constants";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const normalizeCreatedAt = (value: unknown) => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
};

const SERVICES_SUBCOLLECTION = "services";
const REVIEWS_SUBCOLLECTION = "reviews";

const getStoreRef = (storeId: string) =>
  db.collection(COLLECTIONS.MARKETPLACE_STORES).doc(storeId);

const buildServiceDoc = (doc: FirebaseFirestore.DocumentSnapshot, storeId: string) => {
  const data = doc.data() as Record<string, unknown>;
  const reviews = (data.reviews as unknown[] | undefined) ?? [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? (reviews as { rating: number }[]).reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviewCount
      : null;
  return {
    id: doc.id,
    storeId,
    ...data,
    reviews: [],
    reviewCount,
    averageRating,
    isAvailable: data.isAvailable ?? true,
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: normalizeCreatedAt(data.updatedAt),
  };
};

const fetchServiceReviews = async (storeId: string, serviceId: string) => {
  const snap = await getStoreRef(storeId)
    .collection(SERVICES_SUBCOLLECTION)
    .doc(serviceId)
    .collection(REVIEWS_SUBCOLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    return {
      id: d.id,
      serviceId,
      storeId,
      ...data,
      createdAt: normalizeCreatedAt(data.createdAt),
    };
  });
};

const getOwnerStoreId = async (uid: string): Promise<string | null> => {
  const snap = await db
    .collection(COLLECTIONS.MARKETPLACE_STORES)
    .where("ownerUid", "==", uid)
    .where("completed", "==", true)
    .limit(1)
    .get();
  return snap.empty ? null : snap.docs[0].id;
};

const marketplaceStoreResolvers = {
  MarketplaceService: {
    store: async (parent: { storeId: string }) => {
      try {
        const doc = await getStoreRef(parent.storeId).get();
        if (!doc.exists) return null;
        const data = doc.data() as Record<string, unknown>;
        return { id: doc.id, ...data, createdAt: normalizeCreatedAt(data.createdAt) };
      } catch {
        return null;
      }
    },
    reviews: async (parent: { id: string; storeId: string }) => {
      try {
        return await fetchServiceReviews(parent.storeId, parent.id);
      } catch {
        return [];
      }
    },
  },

  Query: {
    myStoreServices: async (_: any, __: any, context: { uid: string }) => {
      const { uid } = context;
      if (!uid) throw new Error("Unauthorized");
      const storeId = await getOwnerStoreId(uid);
      if (!storeId) return [];
      const snap = await getStoreRef(storeId)
        .collection(SERVICES_SUBCOLLECTION)
        .orderBy("createdAt", "desc")
        .get();
      return snap.docs.map((doc) => buildServiceDoc(doc, storeId));
    },

    storeServices: async (_: any, args: { storeId: string }) => {
      const { storeId } = args;
      // No composite index needed — filter isAvailable in JS
      const snap = await getStoreRef(storeId)
        .collection(SERVICES_SUBCOLLECTION)
        .orderBy("createdAt", "desc")
        .get();
      return snap.docs
        .map((doc) => buildServiceDoc(doc, storeId))
        .filter((s) => s.isAvailable);
    },

    featuredServices: async (_: any, args: { limit?: number }) => {
      const maxLimit = Math.min(args.limit ?? 20, 50);
      // collectionGroup with where+orderBy needs a composite Firestore index.
      // Avoid that requirement by fetching without filters and sorting in JS.
      const snap = await db
        .collectionGroup(SERVICES_SUBCOLLECTION)
        .limit(500) // Fetch up to 500 services to account for non-marketplace or unavailable ones
        .get();
      return snap.docs
        .filter((doc) => {
          // Ensure the service belongs to a marketplaceStore
          const isMarketplaceStore =
            doc.ref.parent.parent?.parent?.id === COLLECTIONS.MARKETPLACE_STORES;
          if (!isMarketplaceStore) return false;

          const data = doc.data();
          // Ensure all required non-nullable GraphQL fields are present
          return (
            data &&
            typeof data.ownerUid === "string" &&
            typeof data.title === "string" &&
            typeof data.serviceType === "string"
          );
        })
        .map((doc) => {
          const storeId = doc.ref.parent.parent?.id ?? "";
          return buildServiceDoc(doc, storeId);
        })
        .filter((s) => s.isAvailable)
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, maxLimit);
    },

    marketplaceService: async (_: any, args: { storeId: string; serviceId: string }) => {
      const { storeId, serviceId } = args;
      const doc = await getStoreRef(storeId)
        .collection(SERVICES_SUBCOLLECTION)
        .doc(serviceId)
        .get();
      if (!doc.exists) return null;
      return buildServiceDoc(doc, storeId);
    },

    marketplaceServiceById: async (_: any, args: { id: string }) => {
      const { id } = args;
      const snap = await db
        .collectionGroup(SERVICES_SUBCOLLECTION)
        .get();
      const doc = snap.docs.find((d) => d.id === id);
      if (!doc) return null;
      const storeId = doc.ref.parent.parent?.id ?? "";
      return buildServiceDoc(doc, storeId);
    },

    marketplaceStores: async (_: any, __: any, context: { uid: string }) => {
      const { uid } = context;

      if (!uid) {
        throw new Error("Unauthorized - Missing token");
      }

      let ref = db
        .collection(COLLECTIONS.MARKETPLACE_STORES)
        .where("ownerUid", "==", uid)
        .where("completed", "==", true);

      const snapshot = await ref.get();

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          createdAt: normalizeCreatedAt(data?.createdAt),
        };
      });
    },
    marketplaceAllStores: async () => {
      const snapshot = await db
        .collection(COLLECTIONS.MARKETPLACE_STORES)
        .where("completed", "==", true)
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          createdAt: normalizeCreatedAt(data?.createdAt),
        };
      });
    },
    marketplaceStoreProfile: async (_: any, args: { slugUrl: string }) => {
      const snapshot = await db
        .collection(COLLECTIONS.MARKETPLACE_STORES)
        .where("completed", "==", true)
        .where("slugUrl", "==", args.slugUrl)
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          createdAt: normalizeCreatedAt(data?.createdAt),
        };
      });
    },
  },

  Mutation: {
    createMarketplaceService: async (
      _: any,
      args: { input: Record<string, any> },
      context: { uid: string },
    ) => {
      const { uid } = context;
      if (!uid) throw new Error("Unauthorized");
      const storeId = await getOwnerStoreId(uid);
      if (!storeId) throw new Error("You must have a completed store to add services.");

      const { input } = args;
      if (!input.title?.trim()) throw new Error("Service title is required.");
      if (!input.serviceType?.trim()) throw new Error("Service type is required.");

      const now = Timestamp.now();
      const serviceData = {
        ownerUid: uid,
        storeId,
        title: input.title.trim(),
        serviceType: input.serviceType.trim(),
        description: input.description ?? null,
        price: input.price ?? null,
        priceUnit: input.priceUnit ?? "fixed",
        imageUrl: input.imageUrl ?? null,
        isAvailable: input.isAvailable ?? true,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await getStoreRef(storeId)
        .collection(SERVICES_SUBCOLLECTION)
        .add(serviceData);

      const doc = await docRef.get();
      return { ...buildServiceDoc(doc, storeId), reviews: [], reviewCount: 0, averageRating: null };
    },

    updateMarketplaceService: async (
      _: any,
      args: { storeId: string; serviceId: string; input: Record<string, any> },
      context: { uid: string },
    ) => {
      const { uid } = context;
      if (!uid) throw new Error("Unauthorized");
      const { storeId, serviceId, input } = args;

      const docRef = getStoreRef(storeId)
        .collection(SERVICES_SUBCOLLECTION)
        .doc(serviceId);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Service not found.");

      const existing = doc.data() as Record<string, any>;
      if (existing.ownerUid !== uid) throw new Error("Unauthorized: you do not own this service.");

      const update: Record<string, any> = {};
      const scalars = ["title", "serviceType", "description", "priceUnit", "imageUrl"] as const;
      for (const key of scalars) {
        if (input[key] !== undefined) update[key] = input[key];
      }
      if (input.price !== undefined) update.price = input.price;
      if (input.isAvailable !== undefined) update.isAvailable = input.isAvailable;
      update.updatedAt = Timestamp.now();

      await docRef.update(update);
      const updated = await docRef.get();
      return buildServiceDoc(updated, storeId);
    },

    deleteMarketplaceService: async (
      _: any,
      args: { storeId: string; serviceId: string },
      context: { uid: string },
    ) => {
      const { uid } = context;
      if (!uid) throw new Error("Unauthorized");
      const { storeId, serviceId } = args;

      const docRef = getStoreRef(storeId)
        .collection(SERVICES_SUBCOLLECTION)
        .doc(serviceId);
      const doc = await docRef.get();
      if (!doc.exists) throw new Error("Service not found.");

      const data = doc.data() as Record<string, any>;
      if (data.ownerUid !== uid) throw new Error("Unauthorized: you do not own this service.");

      await docRef.delete();
      return true;
    },

    addServiceReview: async (
      _: any,
      args: { input: Record<string, any> },
      context: { uid: string },
    ) => {
      const { uid } = context;
      if (!uid) throw new Error("You must be logged in to leave a review.");
      const { input } = args;
      const { storeId, serviceId, rating, comment, reviewerName } = input;

      if (!storeId || !serviceId) throw new Error("storeId and serviceId are required.");
      if (!rating || rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5.");

      const serviceRef = getStoreRef(storeId)
        .collection(SERVICES_SUBCOLLECTION)
        .doc(serviceId);
      const serviceDoc = await serviceRef.get();
      if (!serviceDoc.exists) throw new Error("Service not found.");

      // Prevent duplicate reviews from same user
      const existingReview = await serviceRef
        .collection(REVIEWS_SUBCOLLECTION)
        .where("reviewerUid", "==", uid)
        .limit(1)
        .get();
      if (!existingReview.empty) throw new Error("You have already reviewed this service.");

      const now = Timestamp.now();
      const reviewData = {
        storeId,
        serviceId,
        reviewerUid: uid,
        reviewerName: reviewerName ?? "Anonymous",
        rating: Math.round(rating),
        comment: comment ?? null,
        createdAt: now,
      };

      const reviewRef = await serviceRef
        .collection(REVIEWS_SUBCOLLECTION)
        .add(reviewData);

      return {
        id: reviewRef.id,
        ...reviewData,
        createdAt: normalizeCreatedAt(now),
      };
    },

    updateMarketplaceStore: async (
      _: any,
      args: { id: string; input: Record<string, any> },
      context: { uid: string },
    ) => {
      const { uid } = context;
      const { id, input } = args;

      const docRef = db.collection(COLLECTIONS.MARKETPLACE_STORES).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error("Store not found.");
      }

      const existing = doc.data() as any;

      if (existing.ownerUid !== uid) {
        throw new Error("Unauthorized: you do not own this store.");
      }

      // Build a clean update payload — only include defined fields
      const update: Record<string, any> = {};
      const scalar = [
        "title",
        "overview",
        "address",
        "contactMethod",
        "phone",
        "email",
        "bannerUrl",
        "logoUrl",
        "onBoardType",
        "pageType",
      ] as const;
      for (const key of scalar) {
        if (input[key] !== undefined) update[key] = input[key];
      }
      if (input.businessType !== undefined)
        update.businessType = input.businessType;
      if (input.location !== undefined) {
        // Merge nested location fields so we don't wipe untouched sub-fields
        update.location = {
          ...(existing.location ?? {}),
          ...input.location,
        };
      }

      await docRef.update(update);

      const updated = (await docRef.get()).data() as any;
      return {
        id,
        ...updated,
        createdAt: normalizeCreatedAt(updated?.createdAt),
      };
    },
  },
};
export default marketplaceStoreResolvers;
