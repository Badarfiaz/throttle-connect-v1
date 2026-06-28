import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { saveUserToFirestore } from "./saveUserToFirestore";

type AuthMode = "login" | "signup";

export type PendingGoogleUser = {
  uid: string;
  email: string;
  name: string;
};

interface UseAuthHandlersProps {
  mode: AuthMode;
  closeModal: () => void;
}

export const useAuthHandlers = ({ mode, closeModal }: UseAuthHandlersProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<PendingGoogleUser | null>(null);

  // Email/password auth
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);

      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      const name = String(formData.get("name") || "");
      const phone = String(formData.get("phone") || "");

      try {
        if (mode === "login") {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          await saveUserToFirestore({
            uid: userCred.user.uid,
            displayName: name,
            email,
            phone,
          });
        }

        toast.success(mode === "login" ? "Login successful" : "Signup successful", {
          description:
            mode === "login"
              ? "Welcome back to Throttle Connect!"
              : "Account created successfully!",
        });

        closeModal();
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
        let errorMessage = firebaseErr.message ?? "Unknown error";

        if (firebaseErr.code === "auth/user-not-found") {
          errorMessage = "No account found with this email. Please sign up first.";
        } else if (firebaseErr.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (firebaseErr.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        } else if (firebaseErr.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled.";
        } else if (firebaseErr.code === "auth/email-already-in-use") {
          errorMessage = "Email already in use. Please login instead.";
        } else if (firebaseErr.code === "auth/weak-password") {
          errorMessage = "Password should be at least 6 characters.";
        } else if (firebaseErr.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password. Please check your credentials.";
        }

        toast.error("Authentication error", { description: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
    [mode, closeModal],
  );

  // Google sign-in
  const handleGoogle = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      const uid = res.user.uid;
      const email = res.user.email ?? "";
      const name = res.user.displayName ?? "";

      // Save basic profile (won't overwrite createdAt or phone if already set)
      await saveUserToFirestore({ uid, displayName: name, email });

      // Check if user already has a phone number
      const userDoc = await getDoc(doc(db, "users", uid));
      const existingPhone = (userDoc.data()?.phone as string | undefined) ?? "";

      if (!existingPhone) {
        // New user (or existing without phone) → collect phone before closing
        setPendingGoogleUser({ uid, email, name });
      } else {
        toast.success("Google login successful", {
          description: "Welcome back to Throttle Connect!",
        });
        closeModal();
      }
    } catch (err: unknown) {
      const firebaseErr = err as { message?: string };
      toast.error("Google login failed", { description: firebaseErr.message });
    } finally {
      setSubmitting(false);
    }
  }, [closeModal]);

  // Save phone for Google users and complete sign-in
  const submitGooglePhone = useCallback(
    async (phone: string) => {
      if (!pendingGoogleUser) return;
      setSubmitting(true);
      try {
        await updateDoc(doc(db, "users", pendingGoogleUser.uid), { phone });
        setPendingGoogleUser(null);
        toast.success("Welcome to Throttle Connect!", {
          description: "Your account has been set up.",
        });
        closeModal();
      } catch (err: unknown) {
        const firebaseErr = err as { message?: string };
        toast.error("Failed to save phone number", { description: firebaseErr.message });
      } finally {
        setSubmitting(false);
      }
    },
    [pendingGoogleUser, closeModal],
  );

  return {
    handleSubmit,
    handleGoogle,
    submitGooglePhone,
    submitting,
    pendingGoogleUser,
  };
};
