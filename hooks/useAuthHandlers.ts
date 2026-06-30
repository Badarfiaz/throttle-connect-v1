import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ConfirmationResult,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
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

type PendingEmailSignup = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type OtpStep = "email-signup" | "google-phone" | null;

interface UseAuthHandlersProps {
  mode: AuthMode;
  closeModal: () => void;
}

// Convert local phone (e.g. 03001234567) to E.164 (+923001234567)
function toE164(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("0")) return "+92" + cleaned.slice(1);
  return "+" + cleaned;
}

export const useAuthHandlers = ({ mode, closeModal }: UseAuthHandlersProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<PendingGoogleUser | null>(null);
  const [pendingEmailSignup, setPendingEmailSignup] = useState<PendingEmailSignup | null>(null);
  const [otpStep, setOtpStep] = useState<OtpStep>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const pendingGooglePhoneRef = useRef<string>("");
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const getOrCreateRecaptcha = useCallback(async () => {
    console.log("[OTP] Creating fresh RecaptchaVerifier...");
    recaptchaVerifierRef.current?.clear();
    recaptchaVerifierRef.current = null;

    const container = document.getElementById("recaptcha-container");
    console.log("[OTP] recaptcha-container found in DOM:", !!container);
    if (container) container.innerHTML = ""; // wipe leftover widget HTML

    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("[OTP] reCAPTCHA solved successfully"),
      "expired-callback": () => console.warn("[OTP] reCAPTCHA token expired"),
    });

    console.log("[OTP] Calling verifier.render()...");
    const widgetId = await verifier.render();
    console.log("[OTP] reCAPTCHA rendered, widgetId:", widgetId);

    recaptchaVerifierRef.current = verifier;
    return verifier;
  }, []);

  const clearRecaptcha = useCallback(() => {
    console.log("[OTP] Clearing RecaptchaVerifier");
    recaptchaVerifierRef.current?.clear();
    recaptchaVerifierRef.current = null;
  }, []);

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
          const formattedPhone = toE164(phone);
          console.log("[OTP] Starting email signup OTP flow");
          console.log("[OTP] Raw phone:", phone, "→ E.164:", formattedPhone);

          const verifier = await getOrCreateRecaptcha();
          console.log("[OTP] Calling signInWithPhoneNumber...");

          const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
          console.log("[OTP] signInWithPhoneNumber success, confirmationResult:", result);

          setConfirmationResult(result);
          setPendingEmailSignup({ email, password, name, phone });
          setOtpStep("email-signup");
          toast.info("OTP sent", { description: `Verification code sent to ${formattedPhone}` });
        }
      } catch (err: unknown) {
        clearRecaptcha();
        const firebaseErr = err as { code?: string; message?: string };
        console.error("[OTP] Error during signup/OTP send:", firebaseErr.code, firebaseErr.message, err);

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
    [mode, closeModal, getOrCreateRecaptcha, clearRecaptcha],
  );

  // Verify OTP for email signup → create account + link email credential
  const verifyOtpEmailSignup = useCallback(
    async (otp: string) => {
      if (!confirmationResult || !pendingEmailSignup) return;
      console.log("[OTP] Verifying OTP for email signup, code:", otp);
      setSubmitting(true);
      try {
        const phoneCredResult = await confirmationResult.confirm(otp);
        const phoneUser = phoneCredResult.user;
        console.log("[OTP] Phone OTP confirmed, uid:", phoneUser.uid);

        const emailCred = EmailAuthProvider.credential(
          pendingEmailSignup.email,
          pendingEmailSignup.password,
        );
        console.log("[OTP] Linking email credential to phone user...");
        await linkWithCredential(phoneUser, emailCred);
        console.log("[OTP] Email credential linked successfully");

        await saveUserToFirestore({
          uid: phoneUser.uid,
          displayName: pendingEmailSignup.name,
          email: pendingEmailSignup.email,
          phone: pendingEmailSignup.phone,
        });
        console.log("[OTP] User saved to Firestore");

        toast.success("Signup successful", { description: "Account created successfully!" });
        setOtpStep(null);
        setConfirmationResult(null);
        setPendingEmailSignup(null);
        clearRecaptcha();
        closeModal();
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
        console.error("[OTP] OTP verification error:", firebaseErr.code, firebaseErr.message, err);
        let errorMessage = firebaseErr.message ?? "Unknown error";
        if (firebaseErr.code === "auth/invalid-verification-code") {
          errorMessage = "Incorrect OTP. Please check and try again.";
        } else if (firebaseErr.code === "auth/code-expired") {
          errorMessage = "OTP expired. Please request a new one.";
        }
        toast.error("OTP verification failed", { description: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
    [confirmationResult, pendingEmailSignup, closeModal, clearRecaptcha],
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

  // Send OTP after collecting phone for Google user
  const submitGooglePhone = useCallback(
    async (phone: string) => {
      if (!pendingGoogleUser) return;
      setSubmitting(true);
      try {
        const formattedPhone = toE164(phone);
        pendingGooglePhoneRef.current = phone;
        console.log("[OTP] Google phone OTP flow — raw:", phone, "→ E.164:", formattedPhone);

        const currentUser = auth.currentUser;
        console.log("[OTP] auth.currentUser uid:", currentUser?.uid ?? "(null)");
        if (!currentUser) throw new Error("No authenticated user found.");

        const verifier = await getOrCreateRecaptcha();
        console.log("[OTP] Calling linkWithPhoneNumber...");
        const result = await linkWithPhoneNumber(currentUser, formattedPhone, verifier);
        console.log("[OTP] linkWithPhoneNumber success, confirmationResult:", result);

        setConfirmationResult(result);
        setOtpStep("google-phone");
        toast.info("OTP sent", { description: `Verification code sent to ${formattedPhone}` });
      } catch (err: unknown) {
        clearRecaptcha();
        const firebaseErr = err as { code?: string; message?: string };
        console.error("[OTP] Google phone OTP send error:", firebaseErr.code, firebaseErr.message, err);

        let errorMessage = firebaseErr.message ?? "Unknown error";
        if (firebaseErr.code === "auth/invalid-phone-number") {
          errorMessage = "Invalid phone number. Please use format: 03001234567";
        } else if (firebaseErr.code === "auth/provider-already-linked") {
          await updateDoc(doc(db, "users", pendingGoogleUser.uid), { phone });
          setPendingGoogleUser(null);
          toast.success("Welcome to Throttle Connect!", { description: "Your account has been set up." });
          closeModal();
          return;
        }
        toast.error("Failed to send OTP", { description: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
    [pendingGoogleUser, closeModal, getOrCreateRecaptcha, clearRecaptcha],
  );

  // Verify OTP for Google phone link flow
  const verifyOtpGooglePhone = useCallback(
    async (otp: string) => {
      if (!confirmationResult || !pendingGoogleUser) return;
      console.log("[OTP] Verifying OTP for Google phone link, code:", otp);
      setSubmitting(true);
      try {
        await confirmationResult.confirm(otp);
        console.log("[OTP] Google phone OTP confirmed successfully");

        await updateDoc(doc(db, "users", pendingGoogleUser.uid), {
          phone: pendingGooglePhoneRef.current,
        });
        console.log("[OTP] Phone saved to Firestore:", pendingGooglePhoneRef.current);

        toast.success("Welcome to Throttle Connect!", { description: "Your account has been set up." });
        setOtpStep(null);
        setConfirmationResult(null);
        setPendingGoogleUser(null);
        pendingGooglePhoneRef.current = "";
        clearRecaptcha();
        closeModal();
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
        console.error("[OTP] Google OTP verify error:", firebaseErr.code, firebaseErr.message, err);
        let errorMessage = firebaseErr.message ?? "Unknown error";
        if (firebaseErr.code === "auth/invalid-verification-code") {
          errorMessage = "Incorrect OTP. Please check and try again.";
        } else if (firebaseErr.code === "auth/code-expired") {
          errorMessage = "OTP expired. Please request a new one.";
        }
        toast.error("OTP verification failed", { description: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
    [confirmationResult, pendingGoogleUser, closeModal, clearRecaptcha],
  );

  const cancelOtp = useCallback(() => {
    console.log("[OTP] User cancelled OTP step");
    setOtpStep(null);
    setConfirmationResult(null);
    setPendingEmailSignup(null);
    clearRecaptcha();
  }, [clearRecaptcha]);

  return {
    handleSubmit,
    handleGoogle,
    submitGooglePhone,
    verifyOtpEmailSignup,
    verifyOtpGooglePhone,
    cancelOtp,
    submitting,
    pendingGoogleUser,
    otpStep,
  };
};
