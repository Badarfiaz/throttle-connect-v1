"use client";

import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { updateUserOnboarding } from "@/app/redux/features/authSlice";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { makeSlugUrl } from "@/ulity/genrateSlugUrl";

type OnboardPageType = "marketplace" | "networking";

type SubmitOptions = {
  completed: boolean;
};

type UseOnboardStepOptions = {
  pageType: OnboardPageType;
};

const formatDateWithOffset = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  const tzOffsetMinutes = -date.getTimezoneOffset();
  const sign = tzOffsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(tzOffsetMinutes);
  const hours = pad(Math.floor(abs / 60));
  const minutes = pad(abs % 60);

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${hours}:${minutes}`
  );
};

export const allowedTypes: OnboardPageType[] = ["marketplace", "networking"];

export const useOnboardStep = ({ pageType }: UseOnboardStepOptions) => {
  if (!allowedTypes.includes(pageType)) {
    throw new Error("Invalid onBoardType");
  }

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitStep = useCallback(
    async (data: Record<string, unknown>, options: SubmitOptions) => {
      setSubmitting(true);
      setError(null);

      try {
        if (!user?.userId) {
          throw new Error("Missing user session.");
        }

        const COLLECTION_NAME =
          pageType === "marketplace" ? "marketplaceStores" : "networkingStores";

        const titleOrName = (data.clubName || data.title || `${pageType}-${user.userId}`) as string;

        const payload: Record<string, unknown> = {
          ...data,
          completed: options.completed,
          pageType,
          onBoardType: pageType,
          ownerUid: user.userId,
          createdAt: formatDateWithOffset(new Date()),
          slugUrl: makeSlugUrl(titleOrName),
        };

        const docRef = doc(db, COLLECTION_NAME, user.userId);
        await setDoc(docRef, payload, { merge: true });

        // Update user onboarding state in Redux
        dispatch(
          updateUserOnboarding({
            pageType,
            data: payload,
            completed: options.completed,
          }),
        );

        return { success: true, message: "Onboarded successfully." };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [pageType, dispatch, user],
  );

  return { submitStep, submitting, error };
};
