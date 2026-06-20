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

const networkingClubResolvers = {
  Query: {
    networkingClubs: async (_: any, __: any, context: { uid: string }) => {
      const { uid } = context;

      if (!uid) {
        throw new Error("Unauthorized - Missing token");
      }

      let ref = db
        .collection(COLLECTIONS.NETWORKING_CLUBS)
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
    networkingAllClubs: async () => {
      const snapshot = await db
        .collection(COLLECTIONS.NETWORKING_CLUBS)
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
    networkingClubProfile: async (_: any, args: { slugUrl: string }) => {
      const snapshot = await db
        .collection(COLLECTIONS.NETWORKING_CLUBS)
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
    updateNetworkingClub: async (
      _: any,
      args: { id: string; input: Record<string, any> },
      context: { uid: string },
    ) => {
      const { uid } = context;
      const { id, input } = args;

      const docRef = db.collection(COLLECTIONS.NETWORKING_CLUBS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error("Club not found.");
      }

      const existing = doc.data() as any;

      if (existing.ownerUid !== uid) {
        throw new Error("Unauthorized: you do not own this club.");
      }

      // Build a clean update payload — only include defined fields
      const update: Record<string, any> = {};
      const scalar = [
        "clubName",
        "clubType",
        "otherClubType",
        "description",
        "city",
        "phone",
        "email",
        "contactMethod",
      ] as const;
      for (const key of scalar) {
        if (input[key] !== undefined) update[key] = input[key];
      }
      if (input.socialPlatforms !== undefined) {
        update.socialPlatforms = {
          ...(existing.socialPlatforms ?? {}),
          ...input.socialPlatforms,
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
export default networkingClubResolvers;
