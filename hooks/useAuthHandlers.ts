import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase";
import { saveUserToFirestore } from "./saveUserToFirestore";

type AuthMode = "login" | "signup";

interface UseAuthHandlersProps {
  mode: AuthMode;
  closeModal: () => void;
}

export const useAuthHandlers = ({ mode, closeModal }: UseAuthHandlersProps) => {
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Email/password auth
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitting(true);

      const formData = new FormData(e.currentTarget);
      const formDataObj = Object.fromEntries(formData.entries());
      console.log("Form Data:", formDataObj); // Debug log
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      const name = String(formData.get("name") || "");

      try {
        let userCred;

        if (mode === "login") {
          // LOGIN
          userCred = await signInWithEmailAndPassword(auth, email, password);
        } else {
          // SIGNUP
          userCred = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );

          await saveUserToFirestore({
            uid: userCred.user.uid,
            displayName: name,
            email,
          });
        }

        toast.success(
          mode === "login" ? "Login successful" : "Signup successful",
          {
            description:
              mode === "login"
                ? "Welcome back to Throttle Connect!"
                : "Account created successfully!",
          },
        );

        closeModal();
      } catch (err: any) {
        console.error("Auth error:", err);

        // Handle specific Firebase error codes
        let errorMessage = err.message;

        if (err.code === "auth/user-not-found") {
          errorMessage =
            "No account found with this email. Please sign up first.";
        } else if (err.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (err.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        } else if (err.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled.";
        } else if (err.code === "auth/email-already-in-use") {
          errorMessage = "Email already in use. Please login instead.";
        } else if (err.code === "auth/weak-password") {
          errorMessage = "Password should be at least 6 characters.";
        } else if (err.code === "auth/invalid-credential") {
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        }

        toast.error("Authentication error", { description: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
    [mode, closeModal],
  );

  // 🔹 Google login
  const handleGoogle = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());

      await saveUserToFirestore({
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
      });

      toast.success("Google login successful", {
        description: "Welcome back to Throttle Connect!",
      });
      closeModal();
    } catch (err: any) {
      toast.error("Google login failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  }, [closeModal]);

  return {
    handleSubmit,
    handleGoogle,
    submitting,
  };
};
