import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import AlertModal from "../shared/AlertModal";

type AuthMode = "login" | "signup";

const LoginModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [signupStep, setSignupStep] = useState<"options" | "form">("options");
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "success"
  );

  /* ================= SUBMIT ================= */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target as HTMLFormElement;

    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    )?.value;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value;

    /* ===== VALIDATIONS ===== */
    if (mode === "signup" && signupStep === "form") {
      if (!name || name.length < 3) {
        showError("Please enter your full name");
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        showError("Enter valid Pakistani phone number");
        return;
      }

      if (!isGoogleSignup && password !== confirmPassword) {
        showError("Passwords do not match");
        return;
      }
    }

    /* ===== MOCK LOGIN / SIGNUP ===== */
    try {
      await new Promise((res) => setTimeout(res, 1000)); // fake API

      showSuccess(
        mode === "login"
          ? "Logged in successfully!"
          : "Account created & profile completed!"
      );

      setOpen(false);
      resetState();
    } catch {
      showError("Something went wrong");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await new Promise((res) => setTimeout(res, 800));
      setIsGoogleSignup(true);
      setSignupStep("form");
    } catch {
      showError("Google login failed");
    }
  };

  /* ================= HELPERS ================= */
  const showError = (msg: string) => {
    setSubmitting(false);
    setAlertMessage(msg);
    setAlertType("error");
    setAlertOpen(true);
  };

  const showSuccess = (msg: string) => {
    setSubmitting(false);
    setAlertMessage(msg);
    setAlertType("success");
    setAlertOpen(true);
  };

  const resetState = () => {
    setMode("login");
    setSignupStep("options");
    setIsGoogleSignup(false);
  };

  /* ================= UI ================= */
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#0B2447] text-white rounded-xl px-6 py-3">
            Login
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md rounded-3xl p-8">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-bold">
              {mode === "login"
                ? "Log in"
                : signupStep === "options"
                ? "Sign up to continue"
                : "Complete Your Profile"}
            </DialogTitle>
            <DialogDescription>
              {mode === "login"
                ? "Login to your account"
                : signupStep === "options"
                ? "Choose a signup method"
                : "Almost there!"}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as AuthMode);
              setSignupStep("options");
              setIsGoogleSignup(false);
            }}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value={mode}>
              {mode === "signup" && signupStep === "options" ? (
                <div className="space-y-5 mt-6">

                  <Button
                    className="w-full"
                    onClick={() => setSignupStep("form")}
                  >
                    Continue with Email
                  </Button>

                  {/* OR divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-sm text-gray-500 text-center">OR</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignup}
                  >
                    Join with Google
                  </Button>

                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4 mt-6">
                  {mode === "signup" && signupStep === "form" && (
                    <>
                      <InputGroup label="Full Name" id="name" type="text" />
                      <InputGroup
                        label="Phone Number"
                        id="phone"
                        type="tel"
                        prefix="+92"
                      />
                    </>
                  )}

                  {!isGoogleSignup && (
                    <>
                      <InputGroup label="Email" id="email" type="email" />
                      <InputGroup
                        label="Password"
                        id="password"
                        type="password"
                      />
                    </>
                  )}

                  {mode === "signup" &&
                    signupStep === "form" &&
                    !isGoogleSignup && (
                      <InputGroup
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                      />
                    )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {mode === "login" ? "Login" : "Continue"}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertModal
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alertMessage}
        type={alertType}
      />
    </>
  );
};

/* ================= INPUT ================= */
const InputGroup: FC<{
  label: string;
  id: string;
  type: string;
  prefix?: string;
}> = ({ label, id, type, prefix }) => (
  <div className="flex flex-col space-y-1">
    <Label>{label}</Label>
    <div className="flex border rounded-lg h-12 overflow-hidden">
      {prefix && (
        <span className="px-3 bg-gray-100 border-r flex items-center">
          {prefix}
        </span>
      )}
      <Input id={id} name={id} type={type} required className="border-0" />
    </div>
  </div>
);

export default LoginModal;
