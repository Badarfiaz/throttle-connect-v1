import { onRequest } from "firebase-functions/https";
import { withCors } from "../utils/withcors";
// Make sure the path is correct and the file exists; adjust if needed:
import { admin, verifyToken } from "../lib/firebase";
const db = admin.firestore();
const currentDate = new Date();

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
      if (onBoardType === "marketplace") {
        const dataToSave = {
          ...req.body,
          ownerUid: uid, // currect user's UID as owner
          createdAt: currentDate,
        };

        await db.collection("marketplaceStores").doc(uid).set(dataToSave); // Using UID as document ID for easy retrieval but incorrect

        res.status(201).json({
          success: true,
          message: "Marketplace store onboarded successfully.",
        });
        return;
      }

      res.status(400).json({ success: false, message: "Invalid onBoardType" });
    } catch (error) {
      console.error("Error in onboarding function:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }),
);
