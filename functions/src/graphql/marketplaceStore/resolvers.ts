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

const marketplaceStoreResolvers = {
  Query: {
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
