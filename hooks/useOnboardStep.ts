import { useCallback, useState } from "react";
import { ONBOARD_URL } from "@/lib/config";
import getFirebaseToken from "@/ulity/getFirebaseToken";
import { useAppDispatch } from "@/app/redux/hooks";
import { updateUserOnboarding } from "@/app/redux/features/authSlice";
import { setMarketplace } from "@/app/redux/features/marketplaceSlice";

type OnboardPageType = "marketplace" | "networking";

type SubmitOptions = {
  completed: boolean;
};

type UseOnboardStepOptions = {
  pageType: OnboardPageType;
};

export const allowedTypes: OnboardPageType[] = ["marketplace", "networking"];
export const useOnboardStep = ({ pageType }: UseOnboardStepOptions) => {
  if (!allowedTypes.includes(pageType)) {
    throw new Error("Invalid onBoardType");
  }

  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitStep = useCallback(
    async (data: Record<string, unknown>, options: SubmitOptions) => {
      setSubmitting(true);
      setError(null);

      try {
        const { token } = await getFirebaseToken();

        if (!token) {
          throw new Error("Missing authentication token.");
        }

        const payload = {
          ...data,
          completed: options.completed,
          pageType,
          onBoardType: pageType,
        };
        console.log("payload", payload);

        // Dispatch to global state immediately (optimistic update)
        if (pageType === "marketplace") {
          dispatch(setMarketplace(payload));
        }

        // Update user onboarding state
        dispatch(
          updateUserOnboarding({
            pageType,
            data: data,
            completed: options.completed,
          }),
        );

        const res = await fetch(ONBOARD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(
            typeof result?.message === "string"
              ? result.message
              : "Onboarding request failed.",
          );
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [pageType, dispatch],
  );

  return { submitStep, submitting, error };
};
