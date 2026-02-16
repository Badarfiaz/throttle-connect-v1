// lib/firebase.ts
import { Response } from "express";
import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { Request } from "firebase-functions/v2/https";

if (!admin.apps.length) {
  admin.initializeApp();
}
// Named Firestore export for convenience
const db = admin.firestore();

const verifyToken = async (
  req: Request,
  res: Response<any, Record<string, any>>,
  options?: { optional?: boolean },
) => {
  const optional = options?.optional ?? false;
  //   if (req.method !== "POST") {
  //     res.status(405)
  // .json({ success: false, message: "Method Not Allowed" });
  //     return null;
  //   }

  try {
    const authHeader = req.headers.authorization;
    logger.info("xyztoken:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (!optional) {
        res
          .status(401)
          .json({ success: false, message: "Unauthorized - Missing token" });
      }
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    // logger.debug("user token ", idToken);

    // 🔐 Verify token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (err) {
    res.status(401).json({
      success: false,
      message:
        "Unauthorized or Error Processing Request. " +
        (err instanceof Error ? err.message : ""),
    });
    return null;
  }
};

const getUserRole = async (
  uid: string,
): Promise<"admin" | "user" | undefined> => {
  try {
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

    if (!userDoc.exists) {
      console.warn(`No user document found for UID: ${uid}`);
      return undefined;
    }

    const userData = userDoc.data();
    const role = userData?.role;

    if (role === "admin" || role === "user") {
      return role;
    }

    console.warn(`Invalid or missing role for UID: ${uid}`);
    return undefined;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return undefined;
  }
};

export { admin, db, getUserRole, verifyToken };
