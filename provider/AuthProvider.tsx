"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "@/app/redux/hooks";
import { auth } from "@/firebase";
import { setUser } from "@/app/redux/features/authSlice";
 
 
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth listener");
    
    // Set up a persistent listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthProvider: Auth state changed", user ? "User logged in" : "User logged out");
      
      if (user) {
        // User is signed in
        dispatch(setUser({
          id: user.uid,
          email: user.email ?? "",
          name: user.displayName || user.email?.split('@')[0] || undefined,
        }));
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
