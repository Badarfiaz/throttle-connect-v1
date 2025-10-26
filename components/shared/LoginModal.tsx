import { FC } from "react";
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
  return (
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
                <InputGroup label="Full Name" id="name" type="text" />
              )}
              <InputGroup label="Email" id="email" type="email" />
              <InputGroup label="Password" id="password" type="password" />

              <Button
                type="submit"
                className="w-full bg-[#0B2447] hover:bg-[#19376D] text-white"
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
  );
};

const InputGroup: FC<{ label: string; id: string; type: string }> = ({
  label,
  id,
  type,
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} name={id} type={type} required />
  </div>
);

export default LoginModal;
