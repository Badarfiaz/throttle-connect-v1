import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
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
          console.log("[AUTH] Attempting email login for:", email);
          await signInWithEmailAndPassword(auth, email, password);
          console.log("[AUTH] Email login successful");
          toast.success("Login successful", { description: "Welcome back to Throttle Connect!" });
          closeModal();
        } else {
          console.log("[AUTH] Starting direct email signup");
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log("[AUTH] User created, uid:", user.uid);

          await saveUserToFirestore({
            uid: user.uid,
            displayName: name,
            email: email,
            phone: phone,
          });
          console.log("[AUTH] User saved to Firestore");

          toast.success("Signup successful", { description: "Account created successfully!" });
          closeModal();
        }
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
        console.error("[AUTH] Error during login/signup:", firebaseErr.code, firebaseErr.message, err);

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
        } else if (firebaseErr.code === "auth/invalid-phone-number") {
          errorMessage = "Invalid phone number. Please use format: 03001234567";
        } else if (firebaseErr.code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later.";
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
    console.log("[AUTH] Starting Google sign-in...");
    setSubmitting(true);
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      const uid = res.user.uid;
      const email = res.user.email ?? "";
      const name = res.user.displayName ?? "";
      console.log("[AUTH] Google sign-in success, uid:", uid, "email:", email);

      await saveUserToFirestore({ uid, displayName: name, email });

      const userDoc = await getDoc(doc(db, "users", uid));
      const existingPhone = (userDoc.data()?.phone as string | undefined) ?? "";
      console.log("[AUTH] Existing phone in Firestore:", existingPhone || "(none)");

      if (!existingPhone) {
        console.log("[AUTH] No phone found — showing phone collection step");
        setPendingGoogleUser({ uid, email, name });
      } else {
        toast.success("Google login successful", {
          description: "Welcome back to Throttle Connect!",
        });
        closeModal();
      }
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      console.error("[AUTH] Google sign-in error:", firebaseErr.code, firebaseErr.message, err);
      toast.error("Google login failed", { description: firebaseErr.message });
    } finally {
      setSubmitting(false);
    }
  }, [closeModal]);

  // Save phone directly for Google user without OTP
  const submitGooglePhone = useCallback(
    async (phone: string) => {
      if (!pendingGoogleUser) return;
      setSubmitting(true);
      try {
        console.log("[AUTH] Saving Google user phone directly — phone:", phone);
        await updateDoc(doc(db, "users", pendingGoogleUser.uid), { phone });
        console.log("[AUTH] Phone saved to Firestore");

        toast.success("Welcome to Throttle Connect!", { description: "Your account has been set up." });
        setPendingGoogleUser(null);
        closeModal();
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
        console.error("[AUTH] Google phone save error:", firebaseErr.code, firebaseErr.message, err);
        toast.error("Failed to save phone number", { description: firebaseErr.message ?? "Unknown error" });
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
