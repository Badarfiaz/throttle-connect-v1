"use client";

import { FC, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { shallowEqual, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  loginUser,
  createUser,
  loginUserWithGoogle,
  logoutUser,
} from "@/app/redux/features/authSlice";
import type { RootState } from "@/app/redux/store";
import Togglenav from "./Togglenav";

type AuthMode = "login" | "signup";

interface FormValues {
  email: string;
  password: string;
}

const HeaderPrimary: FC = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitting, setSubmitting] = useState(false);

  const userEmail = useSelector(
    (s: RootState) => s.auth.user?.email ?? "",
    shallowEqual
  );
  const isAuthed = !!userEmail;

  const avatarLetter = useMemo(
    () => (isAuthed ? userEmail.trim().charAt(0).toUpperCase() : "?"),
    [isAuthed, userEmail]
  );

  const closeModal = useCallback(() => {
    setOpen(false);
    setMode("login");
  }, []);

  const openModal = useCallback(() => setOpen(true), []);

  const thunkByMode = useMemo(
    () => ({
      login: loginUser,
      signup: createUser,
    }),
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const values: FormValues = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      try {
        setSubmitting(true);
        const thunk = thunkByMode[mode];
        await dispatch(thunk(values)).unwrap();

        toast.success("Login successful", {
          description: "Welcome back to Throttle Connect!",
        });

        closeModal();
      } catch (err) {
        toast.error("Authentication error", {
          description: "Login failed.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, mode, thunkByMode, closeModal]
  );

  const handleGoogle = useCallback(async () => {
    try {
      setSubmitting(true);
      await dispatch(loginUserWithGoogle()).unwrap();

      toast.success("Login successful", {
        description: "Welcome back to Throttle Connect!",
      });
      closeModal();
    } catch (e) {
      toast.error("Authentication error", {
        description: "Login failed.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, closeModal]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    toast.success("Logout successful", {
      description: "Welcome back to Throttle Connect!",
    });
  }, [dispatch]);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/blogs", label: "Blogs" },
      { href: "/contact", label: "Contact Us" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          Throttle<span className="text-primary/80">Connect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "text-primary font-semibold"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
          <Togglenav pathname={pathname} />
        </nav>

        {isAuthed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium text-primary">
                  {userEmail}
                </span>
                <Avatar className="border border-primary/30">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {avatarLetter}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openModal}
                className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-md px-5"
              >
                Login
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-center mb-2">
                  {mode === "login" ? "Log in" : "Sign up"}
                </DialogTitle>
                <DialogDescription className="text-center text-secondary/80">
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
                      className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
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
                      className="w-full flex items-center justify-center gap-2 text-secondary/80 border-secondary/30"
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
        )}
      </div>
    </header>
  );
};

const InputGroup: FC<{ label: string; id: string; type: string }> = ({
  label,
  id,
  type,
}) => (
  <div>
    <Label htmlFor={id} className="text-secondary/80">
      {label}
    </Label>
    <Input id={id} name={id} type={type} required />
  </div>
);

export default HeaderPrimary;
