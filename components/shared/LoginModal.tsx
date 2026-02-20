import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    )?.value;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value;

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

    try {
      await new Promise((res) => setTimeout(res, 1000));
      showSuccess(
        mode === "login"
          ? "Logged in successfully!"
          : "Account created successfully!"
      );
      setOpen(false);
      resetState();
    } catch {
      showError("Something went wrong");
    }
  };

  const handleGoogleSignup = async () => {
    await new Promise((res) => setTimeout(res, 500));
    setIsGoogleSignup(true);
    setSignupStep("form");
  };

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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#1F6E8C] hover:bg-[#195C74] text-white rounded-xl px-6 py-3 transition duration-200">
            Login
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md rounded-3xl p-8 shadow-xl">
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-semibold">
              {mode === "login"
                ? "Welcome back"
                : signupStep === "options"
                ? "Create your account"
                : "Complete your profile"}
            </DialogTitle>

            {mode === "signup" && (
              <DialogDescription className="text-gray-500">
                {signupStep === "options" ? "Sign up to get started" : "Just one last step"}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* LOGIN FORM */}
          {mode === "login" && (
            <>
              <form onSubmit={onSubmit} className="space-y-4 mt-6">
                <InputGroup label="Email" id="email" type="email" />
                <InputGroup label="Password" id="password" type="password" />

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-[#1F6E8C] text-white hover:bg-[#195C74] transition duration-200"
                >
                  Login
                </Button>
              </form>

              {/* Create Account link below form */}
              <p className="text-sm text-center text-gray-500 mt-4">
                Don’t have an account?{" "}
                <span
                  className="text-[#1F6E8C] font-medium cursor-pointer"
                  onClick={() => {
                    setMode("signup");
                    setSignupStep("options");
                  }}
                >
                  Create a new account
                </span>
              </p>
            </>
          )}

          {/* SIGNUP OPTIONS */}
          {mode === "signup" && signupStep === "options" && (
            <div className="space-y-5 mt-6">
              <Button
                className="w-full h-12 rounded-xl bg-[#1F6E8C] text-white flex items-center justify-center gap-3 hover:bg-[#195C74] transition duration-200"
                onClick={() => setSignupStep("form")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6 12 13 2 6" />
                </svg>
                Continue with Email
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-3 border-2 border-gray-300"
                onClick={handleGoogleSignup}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Join with Google
              </Button>

              <p className="text-sm text-center text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={() => setMode("login")}
                  className="text-[#1F6E8C] font-medium cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          )}

          {/* SIGNUP FORM */}
          {mode === "signup" && signupStep === "form" && (
            <form onSubmit={onSubmit} className="space-y-4 mt-6">
              <InputGroup label="Full Name" id="name" type="text" />
              <InputGroup label="Phone Number" id="phone" type="tel" prefix="+92" />

              {!isGoogleSignup && (
                <>
                  <InputGroup label="Email" id="email" type="email" />
                  <InputGroup label="Password" id="password" type="password" />
                  <InputGroup label="Confirm Password" id="confirmPassword" type="password" />
                </>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-[#1F6E8C] text-white hover:bg-[#195C74] transition duration-200"
              >
                Continue
              </Button>
            </form>
          )}
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

const InputGroup: FC<{
  label: string;
  id: string;
  type: string;
  prefix?: string;
}> = ({ label, id, type, prefix }) => (
  <div className="flex flex-col space-y-1">
    <Label>{label}</Label>
    <div className="flex border rounded-xl h-12 overflow-hidden">
      {prefix && (
        <span className="px-3 bg-gray-100 border-r flex items-center">{prefix}</span>
      )}
      <Input id={id} name={id} type={type} required className="border-0" />
    </div>
  </div>
);

export default LoginModal;