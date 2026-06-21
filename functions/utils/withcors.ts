import cors from "cors";
import { Request } from "firebase-functions/v2/https";
import type { Response } from "express";

// Allow specific origins or use `true` for all origins
const corsHandler = cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3002",
    "https://throttle-connect-v1.vercel.app",
    "https://www.throttleconnect.xyz"
    ,
  ],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export const withCors = (
  handler: (req: Request, res: Response) => Promise<any> | any,
) => {
  return (req: Request, res: Response) => {
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      corsHandler(req, res, () => {
        res.status(204).send("");
      });
      return;
    }

    corsHandler(req, res, async () => {
      try {
        await handler(req, res);
      } catch (error) {
        console.error("Error in handler:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    });
  };
};
