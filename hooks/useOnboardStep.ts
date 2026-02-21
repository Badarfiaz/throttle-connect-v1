import { useCallback, useState } from "react";
import { ONBOARD_URL } from "@/lib/config";
import getFirebaseToken from "@/ulity/getFirebaseToken";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { updateUserOnboarding } from "@/app/redux/features/authSlice";

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

        if (options.completed) {
          const marketplaceData: Record<string, unknown> =
            pageType === "marketplace"
              ? {
                  ...data,
                  pageType,
                  onBoardType: pageType,
                }
              : { ...data };

          if (pageType === "marketplace") {
            if (!("ownerUid" in marketplaceData) && user?.id) {
              marketplaceData.ownerUid = user.id;
            }
            if (!("createdAt" in marketplaceData)) {
              marketplaceData.createdAt = formatDateWithOffset(new Date());
            }
          }

          // Update user onboarding state only after a successful final step
          dispatch(
            updateUserOnboarding({
              pageType,
              data: marketplaceData,
              completed: options.completed,
            }),
          );

          if (pageType === "marketplace" && user) {
            console.log({
              userId: user.id,
              name: user.name,
              email: user.email,
              marketplace: {
                ...marketplaceData,
                completed: options.completed,
              },
            });
          }
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
    [pageType, dispatch, user],
  );

  return { submitStep, submitting, error };
};
