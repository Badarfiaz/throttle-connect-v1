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

  // Store the google phone string so verifyOtpGooglePhone can save it to Firestore
  const pendingGooglePhoneRef = useRef<string>("");
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const getOrCreateRecaptcha = useCallback(() => {
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    recaptchaVerifierRef.current = verifier;
    return verifier;
  }, []);

  const clearRecaptcha = useCallback(() => {
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
          await signInWithEmailAndPassword(auth, email, password);
          toast.success("Login successful", { description: "Welcome back to Throttle Connect!" });
          closeModal();
        } else {
          // Send OTP to phone before creating account
          const formattedPhone = toE164(phone);
          const verifier = getOrCreateRecaptcha();
          const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
          setConfirmationResult(result);
          setPendingEmailSignup({ email, password, name, phone });
          setOtpStep("email-signup");
          toast.info("OTP sent", { description: `Verification code sent to ${formattedPhone}` });
        }
      } catch (err: unknown) {
        clearRecaptcha();
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
      setSubmitting(true);
      try {
        // Confirm OTP — user is now signed in as phone-auth user
        const phoneCredResult = await confirmationResult.confirm(otp);
        const phoneUser = phoneCredResult.user;

        // Link email/password credential to the phone-verified user
        const emailCred = EmailAuthProvider.credential(
          pendingEmailSignup.email,
          pendingEmailSignup.password,
        );
        await linkWithCredential(phoneUser, emailCred);

        // Persist profile
        await saveUserToFirestore({
          uid: phoneUser.uid,
          displayName: pendingEmailSignup.name,
          email: pendingEmailSignup.email,
          phone: pendingEmailSignup.phone,
        });

        toast.success("Signup successful", { description: "Account created successfully!" });
        setOtpStep(null);
        setConfirmationResult(null);
        setPendingEmailSignup(null);
        clearRecaptcha();
        closeModal();
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
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
    setSubmitting(true);
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      const uid = res.user.uid;
      const email = res.user.email ?? "";
      const name = res.user.displayName ?? "";

      await saveUserToFirestore({ uid, displayName: name, email });

      const userDoc = await getDoc(doc(db, "users", uid));
      const existingPhone = (userDoc.data()?.phone as string | undefined) ?? "";

      if (!existingPhone) {
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

  // Send OTP after collecting phone for Google user
  const submitGooglePhone = useCallback(
    async (phone: string) => {
      if (!pendingGoogleUser) return;
      setSubmitting(true);
      try {
        const formattedPhone = toE164(phone);
        pendingGooglePhoneRef.current = phone; // save raw phone for Firestore

        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("No authenticated user found.");

        const verifier = getOrCreateRecaptcha();
        const result = await linkWithPhoneNumber(currentUser, formattedPhone, verifier);
        setConfirmationResult(result);
        setOtpStep("google-phone");
        toast.info("OTP sent", { description: `Verification code sent to ${formattedPhone}` });
      } catch (err: unknown) {
        clearRecaptcha();
        const firebaseErr = err as { code?: string; message?: string };
        let errorMessage = firebaseErr.message ?? "Unknown error";
        if (firebaseErr.code === "auth/invalid-phone-number") {
          errorMessage = "Invalid phone number. Please use format: 03001234567";
        } else if (firebaseErr.code === "auth/provider-already-linked") {
          // Phone already linked — just save to Firestore
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
      setSubmitting(true);
      try {
        await confirmationResult.confirm(otp);

        // Save the verified phone to Firestore
        await updateDoc(doc(db, "users", pendingGoogleUser.uid), {
          phone: pendingGooglePhoneRef.current,
        });

        toast.success("Welcome to Throttle Connect!", { description: "Your account has been set up." });
        setOtpStep(null);
        setConfirmationResult(null);
        setPendingGoogleUser(null);
        pendingGooglePhoneRef.current = "";
        clearRecaptcha();
        closeModal();
      } catch (err: unknown) {
        const firebaseErr = err as { code?: string; message?: string };
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
    setOtpStep(null);
    setConfirmationResult(null);
    setPendingEmailSignup(null);
    clearRecaptcha();
    // Keep pendingGoogleUser so user can re-enter phone
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
