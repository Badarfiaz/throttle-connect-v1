import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import AlertModal from "../shared/AlertModal";

type AuthMode = "login" | "signup";

interface LoginModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  mode: AuthMode;
  setMode: (val: AuthMode) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleGoogle: () => Promise<void>;
  submitting: boolean;
  openModal: () => void;
}

const LoginModal: FC<LoginModalProps> = ({
  open,
  setOpen,
  mode,
  setMode,
  handleSubmit,
  handleGoogle,
  submitting,
  openModal,
}) => {
  // ALERT STATE
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("success");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement)?.value;

    // PASSWORD MATCH VALIDATION
    if (mode === "signup" && password !== confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setAlertType("error");
      setAlertOpen(true);
      return; // stop form submission
    }

    try {
      await handleSubmit(e); // original login/signup logic
      setAlertMessage(mode === "login" ? "Logged in successfully!" : "Account created successfully!");
      setAlertType("success");
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage("Something went wrong. Please try again.");
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-[#0B2447] hover:bg-[#19376D] text-white rounded-md px-5"
            onClick={openModal}
          >
            Login
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center mb-2">
              {mode === "login" ? "Log in" : "Sign up"}
            </DialogTitle>
            <DialogDescription className="text-center">
              Login or create an account to continue.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={mode}
            onValueChange={(val) => setMode(val as AuthMode)}
            className="w-full mt-4"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value={mode}>
              <form onSubmit={onSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup label="Full Name *" id="name" type="text" />
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="flex">
                        <div className="px-3 flex items-center border rounded-l-md bg-gray-100 text-sm">
                          +92
                        </div>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="rounded-l-none focus:ring-2 focus:ring-[#0B2447]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <InputGroup label="Email *" id="email" type="email" />
                <InputGroup label="Password *" id="password" type="password" />
                {mode === "signup" && <InputGroup label="Confirm Password *" id="confirmPassword" type="password" />}

                {mode === "signup" && (
                  <div className="flex items-start space-x-2 text-sm">
                    <input type="checkbox" required />
                    <p>
                      I agree to the{" "}
                      <span className="text-blue-600 underline cursor-pointer">Terms & Conditions</span> and{" "}
                      <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#0B2447] hover:bg-[#19376D] text-white h-11"
                  disabled={submitting}
                >
                  {submitting
                    ? mode === "login"
                      ? "Logging in..."
                      : "Creating..."
                    : mode === "login"
                    ? "Log in"
                    : "Create Account"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogle}
                  disabled={submitting}
                >
                  Continue with Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ALERT MODAL */}
      <AlertModal
        type={alertType}
        message={alertMessage}
        open={alertOpen}
        setOpen={setAlertOpen}
      />
    </>
  );
};

const InputGroup: FC<{ label: string; id: string; type: string }> = ({ label, id, type }) => (
  <div className="flex flex-col space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} name={id} type={type} required className="focus:ring-2 focus:ring-[#0B2447]" />
  </div>
);

export default LoginModal;
