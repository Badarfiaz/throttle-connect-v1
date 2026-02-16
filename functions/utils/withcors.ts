import cors from "cors";
import { Request } from "firebase-functions/v2/https";
import type { Response } from "express";

// Allow specific origins or use `true` for all origins
const corsHandler = cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3002",
    "https://throttle-connect-v1.vercel.app/",
  ],
  credentials: true,
});

export const withCors = (handler: (req: Request, res: Response) => any) => {
  return (req: Request, res: Response) => {
    corsHandler(req, res, () => handler(req, res));
  };
};
