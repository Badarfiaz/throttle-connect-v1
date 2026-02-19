import { onRequest } from "firebase-functions/v2/https";
import { withCors } from "../utils/withcors";

import { admin, verifyToken } from "../lib/firebase";
const db = admin.firestore();
const currentDate = new Date();
type OnboardPageType = "marketplace" | "networking";

const allowedTypes: OnboardPageType[] = ["marketplace", "networking"];

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
      };
      const COLLECTION_NAME =
        onBoardType === "marketplace" ? "marketplaceStores" : "builderProfiles";

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
