import { onRequest } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { withCors } from "../utils/withcors";
import marketplaceStoreResolvers from "./graphql/marketplaceStore/resolvers";
import { admin, verifyToken } from "../lib/firebase";
import marketplaceStoreTypeDefs from "./graphql/marketplaceStore/typeDefs";
import { GraphQLSchema } from "graphql";
import marketplaceProductsTypeDefs from "./graphql/marketplaceProducts/typeDef";
import marketplaceProductsResolvers from "./graphql/marketplaceProducts/resolvers";
import networkingClubTypeDefs from "./graphql/networkingClub/typeDefs";
import networkingClubResolvers from "./graphql/networkingClub/resolvers";
import { COLLECTIONS } from "./constants";
const db = admin.firestore();
import { makeSlugUrl } from "../utils/makeSlugUrl";

const currentDate = new Date();
type OnboardPageType = "marketplace" | "networking";

const allowedTypes: OnboardPageType[] = ["marketplace", "networking"];

async function startApolloServer() {
  const { mergeTypeDefs, mergeResolvers } =
    await import("@graphql-tools/merge");
  const { makeExecutableSchema } = await import("@graphql-tools/schema");
  const typeDefs = mergeTypeDefs([
    marketplaceStoreTypeDefs,
    marketplaceProductsTypeDefs,
    networkingClubTypeDefs,
  ]);
  const resolvers = mergeResolvers([
    marketplaceStoreResolvers,
    marketplaceProductsResolvers,
    networkingClubResolvers,
  ]);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  return schema;
}

let mainServerPromise: Promise<GraphQLSchema> | null = null;

async function ensureMainServer(): Promise<GraphQLSchema> {
  if (!mainServerPromise) {
    mainServerPromise = startApolloServer();
  }
  return mainServerPromise;
}

export const fetcher = onRequest(
  withCors(async (req, res) => {
    try {
      // Allow public marketplace queries to run without a token.
      const uid = await verifyToken(req, res, { optional: true });

      const schema = await ensureMainServer();
      const { createHandler } = await import("graphql-http/lib/use/express");

      const handler = createHandler({
        schema,
        context: async () => ({ uid }),
      });

      await handler(req, res, () => {});
    } catch (error) {
      console.error("Error in fetcher function:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }),
);

export const onboard = onRequest(
  withCors(async (req, res) => {
    try {
      const uid = await verifyToken(req, res);
      if (!uid) return;

      // Only allow POST and PUT
      if (req.method !== "POST" && req.method !== "PUT") {
        res.status(405).json({ success: false, message: "Method Not Allowed" });
        return;
      }
      const { onBoardType } = req.body;

      if (!allowedTypes.includes(onBoardType)) {
        throw new Error(
          "Invalid onBoardType. Allowed: marketplace, networking",
        );
      }
      const dataToSave = {
        ...req.body,
        ownerUid: uid, // currect user's UID as owner
        createdAt: currentDate,
        slugUrl: makeSlugUrl(req.body.title || `${onBoardType}-${uid}`),
      };
      console.log("Data to save:", dataToSave);
      const COLLECTION_NAME =
        onBoardType === "marketplace"
          ? COLLECTIONS.MARKETPLACE_STORES
          : COLLECTIONS.NETWORKING_CLUBS;

      await db.collection(COLLECTION_NAME).doc(uid).set(dataToSave);

      res.status(201).json({
        success: true,
        message: "Marketplace store onboarded successfully.",
      });
      return;
    } catch (error) {
      console.error("Error in onboarding function:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }),
);

// Triggered by Firebase Stripe Extension when a payment session is completed.
// Updates the user's role to goldUser and sets subscription period.
export const onStripePaymentCompleted = onDocumentWritten(
  "customers/{uid}/payments/{paymentId}",
  async (event) => {
    const after = event.data?.after?.data();
    if (!after) return;

    // Only process succeeded payments
    if (after.status !== "succeeded") return;

    const uid = event.params.uid;
    const metadata = after.metadata ?? {};
    const plan = metadata.plan ?? "gold";

    if (plan !== "gold") return;

    const subscriptionStart = new Date();
    const subscriptionEnd = new Date(subscriptionStart);
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 120); // 4 months = 120 days

    try {
      const subscriptionStart = new Date();
      const subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 120); // 4 months = 120 days

      await db.collection(COLLECTIONS.USERS).doc(uid).update({
        isGoldUser: true,
        subscriptionPlan: "gold",
        subscriptionStatus: "active",
        subscriptionStart: subscriptionStart.toISOString(),
        subscriptionEnd: subscriptionEnd.toISOString(),
        recentPayment: true,
      });
      console.log(`Updated user ${uid} subscription to gold.`);
    } catch (err) {
      console.error(`Failed to update user ${uid} subscription:`, err);
    }
  },
);
