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
import type { PendingGoogleUser } from "@/hooks/useAuthHandlers";

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
  pendingGoogleUser?: PendingGoogleUser | null;
  submitGooglePhone?: (phone: string) => Promise<void>;
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
  pendingGoogleUser,
  submitGooglePhone,
}) => {
  const [googlePhone, setGooglePhone] = useState("");

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

        <DialogContent className="max-w-md rounded-2xl">

          {pendingGoogleUser ? (
            /* Phone collection step after Google sign-in */
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-center mb-1">
                  One last step
                </DialogTitle>
                <DialogDescription className="text-center">
                  Hi {pendingGoogleUser.name || pendingGoogleUser.email}! Please add your phone
                  number to complete sign-up.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await submitGooglePhone?.(googlePhone);
                }}
                className="space-y-4 mt-4"
              >
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="google-phone">Phone Number</Label>
                  <Input
                    id="google-phone"
                    name="google-phone"
                    type="tel"
                    placeholder="e.g. 03001234567"
                    value={googlePhone}
                    onChange={(e) => setGooglePhone(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#0B2447] hover:bg-[#19376D] text-white"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Submit"}
                </Button>
              </form>
            </>
          ) : (
            /* Normal login / signup form */
            <>
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                      <InputGroup label="Full Name" id="name" type="text" required />
                    )}
                    <InputGroup label="Email" id="email" type="email" required />
                    <InputGroup label="Password" id="password" type="password" required />
                    {mode === "signup" && (
                      <InputGroup
                        label="Phone Number"
                        id="phone"
                        type="tel"
                        placeholder="e.g. 03001234567"
                        required
                      />
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-[#0B2447] hover:bg-[#19376D] text-white"
                      disabled={submitting}
                    >
                      {submitting
                        ? mode === "login"
                          ? "Logging in..."
                          : "Creating Account..."
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const InputGroup: FC<{
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}> = ({ label, id, type, placeholder, required }) => (
  <div className="flex flex-col space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} name={id} type={type} placeholder={placeholder} required={required} />
  </div>
);

export default LoginModal;
