"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "@/app/redux/hooks";
import { auth, db } from "@/firebase";
import { setUser } from "@/app/redux/features/authSlice";
import { doc, getDoc } from "firebase/firestore";
import { normalizeFirestoreStore } from "@/lib/utils";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listener");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(
        "AuthProvider: Auth state changed",
        user ? "User logged in" : "User logged out",
      );

      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          const userData = userDoc.exists() ? userDoc.data() : {};
          console.log(
            "userData marketplace before set user => ",
            userData.marketplace,
            userData.networking,
          );
          const mergedProfile = userData
            ? {
                completed: userData.profileData?.completed,
                createdAt: userData.profileData?.createdAt,
                experienceYears: userData.profileData?.experienceYears,
                interests: userData.profileData?.interests,
                drivingLicenseImage: userData.profileData?.drivingLicenseImage || "",
                memberName: userData.name || "",
                name: userData.name || "",
                email: userData.email || "",
                phone: userData.phone || "",
                whatsapp: userData.whatsapp || "",
                profileImage: userData.profileImage || "",
                emergencyContact: userData.emergencyContact || null,
                location: userData.location || null,
                vehicle: userData.vehicle || null,
                userId: userData.userId || user.uid,
                clubId: userData.clubId || null,
                membershipStatus: userData.membershipStatus || "none",
              }
            : null;

          const role = userData.role ?? "user";

          // Set cookie so middleware can verify superAdmin role server-side
          if (role === "superAdmin") {
            document.cookie = "tc_role=superAdmin; path=/; max-age=86400; SameSite=Strict";
          } else {
            document.cookie = "tc_role=user; path=/; max-age=86400; SameSite=Strict";
          }

          dispatch(
            setUser({
              userId: user.uid,
              email: user.email ?? "",
              name: userData.name || user.displayName || user.email?.split("@")[0] || "",
              phone: userData.phone || "",
              role,
              subscriptionPlan: userData.subscriptionPlan ?? null,
              subscriptionEnd: userData.subscriptionEnd ?? null,
              subscriptionStart: userData.subscriptionStart ?? null,
              marketplace: normalizeFirestoreStore(userData.marketplace),
              networking: normalizeFirestoreStore(userData.networking),
              profileData: mergedProfile ? normalizeFirestoreStore(mergedProfile) : null,
            }),
          );
        } catch (error) {
          console.error("Error fetching in auth provider user data:", error);
        }
      } else {
        document.cookie = "tc_role=; path=/; max-age=0";
        dispatch(setUser(null));
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth listener");
      unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
