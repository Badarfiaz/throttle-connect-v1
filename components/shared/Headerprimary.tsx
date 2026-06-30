"use client";

import { FC, useCallback, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "@/app/redux/store";
import Togglenav from "./Togglenav";
import HeaderProfile from "./HeaderProfile";
import LoginModal from "./LoginModal";
import { auth } from "@/firebase";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import { Button } from "../ui/button";

type AuthMode = "login" | "signup";

const HeaderPrimary: FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const user = useSelector((s: RootState) => s.auth.user, shallowEqual);
  const isAuthed = !!user?.userId;

  const hasMarketplaceCompleted = user?.marketplace?.completed;
  const hasNetworkingCompleted = user?.networking?.completed;

  const avatarLetter = useMemo(
    () => (isAuthed ? user!.email.trim().charAt(0).toUpperCase() : "?"),
    [isAuthed, user],
  );

  const closeModal = useCallback(() => {
    setOpen(false);
    setMode("login");
  }, []);

  const openModal = useCallback(() => setOpen(true), []);

  const { handleSubmit, handleGoogle, submitGooglePhone, verifyOtpEmailSignup, verifyOtpGooglePhone, cancelOtp, submitting, pendingGoogleUser, otpStep } = useAuthHandlers({
    mode,
    closeModal,
  });

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/pricing", label: "Pricing" },
      { href: "/blogs", label: "News" },
      { href: "/contact", label: "Contact Us" },
      { href: "/list-your-business", label: "Registration" }, // FIXED lowercase route
    ],
    [],
  );

  const handleLogout = useCallback(() => {
    auth.signOut();
    toast.success("Logged out", {
      description: "You have been logged out successfully.",
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f8fcff]/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-semibold text-[#0B2447]"
        >
          <Image
            src="/images/logos/header-logo.png"
            alt="ThrottleConnect Logo"
            width={38}
            height={38}
            className="object-contain"
            priority
          />
          <span>
            Throttle<span className="text-[#19376D]">Connect</span>
          </span>
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
          {pathname === "/marketplace" && hasMarketplaceCompleted && (
            <Button
              type="button"
              onClick={() => router.push("/marketplace/dashboard")}
              className="rounded-md bg-[#19376D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B3A5B] transition-colors"
            >
              Dashboard
            </Button>
          )}
          {pathname === "/networking" && hasNetworkingCompleted && (
            <Button
              type="button"
              onClick={() => router.push("/networking/dashboard")}
              className="rounded-md bg-[#19376D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B3A5B] transition-colors"
            >
              Dashboard
            </Button>
          )}
        </nav>

        {/* Auth Section */}
        {isAuthed ? (
          <div className="hidden md:block">
            <HeaderProfile
              avatar={avatarLetter}
              email={user.email}
              logout={handleLogout}
              isSuperAdmin={user.role === "superAdmin"}
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
            pendingGoogleUser={pendingGoogleUser}
            submitGooglePhone={submitGooglePhone}
            otpStep={otpStep}
            verifyOtpEmailSignup={verifyOtpEmailSignup}
            verifyOtpGooglePhone={verifyOtpGooglePhone}
            cancelOtp={cancelOtp}
          />
        )}
      </div>
    </header>
  );
};

export default HeaderPrimary;
