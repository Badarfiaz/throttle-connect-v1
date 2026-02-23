import { Timestamp } from "firebase-admin/firestore";
import admin from "firebase-admin";

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
    marketplaceStores: async (_: any, { topRated }: { topRated?: boolean }) => {
      let ref = db
        .collection("marketplaceStores")
        .where("completed", "==", true);
      if (typeof topRated === "boolean") {
        ref = ref.where("topRated", "==", topRated);
      }
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
  },
};
export default marketplaceStoreResolvers;
