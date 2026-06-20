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
          dispatch(
            setUser({
              userId: user.uid,
              email: user.email ?? "",
              name: user.displayName || user.email?.split("@")[0] || "",
              marketplace: normalizeFirestoreStore(userData.marketplace),
              networking: normalizeFirestoreStore(userData.networking),
              profileData: userData.profileData ? normalizeFirestoreStore(userData.profileData) : null,
            }),
          );
        } catch (error) {
          console.error("Error fetching in auth provider user data:", error);
        }
      } else {
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
