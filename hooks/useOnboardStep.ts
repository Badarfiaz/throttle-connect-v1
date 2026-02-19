import { useCallback, useState } from "react";
import { ONBOARD_URL } from "@/lib/config";
import getFirebaseToken from "@/ulity/getFirebaseToken";

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
    [pageType],
  );

  return { submitStep, submitting, error };
};
