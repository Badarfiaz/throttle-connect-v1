"use client";

import { FC, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { shallowEqual, useSelector } from "react-redux";
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
import HeaderProfile from "./HeaderProfile";
import LoginModal from "./LoginModal";

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

  // 🔹 Redux selectors
  const userEmail = useSelector(
    (s: RootState) => s.auth.user?.email ?? "",
    shallowEqual,
  );
  const userId = useSelector((s: RootState) => s.auth.user?.id ?? "");
  const isAuthed = !!userEmail;

  // 🔹 Derived helpers
  const avatarLetter = useMemo(
    () => (isAuthed ? userEmail.trim().charAt(0).toUpperCase() : "?"),
    [isAuthed, userEmail],
  );

  // 🔹 Helpers
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
    [],
  );

  const getErrorMessage = (e: unknown, fallback: string) =>
    e instanceof Error ? e.message : fallback;

  // 🔹 Email/password auth
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
    [dispatch, mode, thunkByMode, closeModal, toast],
  );

  // 🔹 Google login
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
  }, [dispatch, closeModal, toast]);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    toast.success("Logout successful", {
      description: "Welcome back to Throttle Connect!",
    });
  }, [dispatch, toast]);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/blogs", label: "Blogs" },
      { href: "/contact", label: "Contact Us" },
    ],
    [],
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f8fcff]/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-[#0B2447]"
        >
          Throttle<span className="text-[#19376D]">Connect</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#0B2447] font-medium hover:text-[#19376D] transition-colors"
            >
              {label}
            </Link>
          ))}
          <Togglenav pathname={pathname} />
        </nav>

        {/* Auth Section */}
        {isAuthed ? (
          <div className="hidden md:block">
            <HeaderProfile
              avatar={avatarLetter}
              email={userEmail}
              logout={handleLogout}
            />
          </div>
        ) : (
          <LoginModal
            open={open}
            setOpen={setOpen}
            mode={mode}
            setMode={setMode}
            handleSubmit={handleSubmit}
            handleGoogle={handleGoogle}
            submitting={submitting}
            openModal={openModal}
          />
        )}
      </div>
    </header>
  );
};

export default HeaderPrimary;
