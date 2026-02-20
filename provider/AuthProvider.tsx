"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "@/app/redux/hooks";
import { auth, db } from "@/firebase";
import { setUser } from "@/app/redux/features/authSlice";
import { doc, getDoc } from "firebase/firestore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listener");

    // Set up a persistent listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(
        "AuthProvider: Auth state changed",
        user ? "User logged in" : "User logged out",
      );

      if (user) {
        // Fetch user data from Firestore to get marketplace/networking data
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          const userData = userDoc.exists() ? userDoc.data() : {};

          // User is signed in - set default values for marketplace and networking
          dispatch(
            setUser({
              id: user.uid,
              email: user.email ?? "",
              name:
                userData.name ||
                user.displayName ||
                user.email?.split("@")[0] ||
                undefined,
              marketplace: userData.marketplace || { completed: false },
              networking: userData.networking || { completed: false },
            }),
          );
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to basic user data with default values if Firestore fetch fails
          dispatch(
            setUser({
              id: user.uid,
              email: user.email ?? "",
              name: user.displayName || user.email?.split("@")[0] || undefined,
              marketplace: { completed: false },
              networking: { completed: false },
            }),
          );
        }
      } else {
        // User is signed out
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("AuthProvider: Cleaning up auth listener");
      unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
