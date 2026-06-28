"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Mail,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Settings,
  Lock,
  ShieldAlert,
  Fingerprint,
} from "lucide-react";
import { auth, db } from "@/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAppSelector } from "@/app/redux/hooks";

export default function SettingsPage() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const currentUser = auth.currentUser;

  // Loading states
  const [emailSaving, setEmailSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Password visibility states
  const [showEmailVerifyPass, setShowEmailVerifyPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Forms
  const emailForm = useForm({
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleEmailUpdate = emailForm.handleSubmit(async (values) => {
    if (!currentUser || !currentUser.email) {
      toast.error("User not authenticated");
      return;
    }

    setEmailSaving(true);
    try {
      // 1. Re-authenticate
      const credential = EmailAuthProvider.credential(currentUser.email, values.password);
      await reauthenticateWithCredential(currentUser, credential);

      // 2. Update email in Firebase Auth
      await updateEmail(currentUser, values.newEmail);

      // 3. Update email in Firestore
      if (reduxUser?.userId) {
        const userRef = doc(db, "users", reduxUser.userId);
        await updateDoc(userRef, { email: values.newEmail });
      }

      toast.success("Email Updated", {
        description: "Your account email has been successfully updated.",
      });
      emailForm.reset();
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Failed to update email";
      toast.error("Update Failed", { description: msg });
    } finally {
      setEmailSaving(false);
    }
  });

  const handlePasswordUpdate = passwordForm.handleSubmit(async (values) => {
    if (!currentUser || !currentUser.email) {
      toast.error("User not authenticated");
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your new passwords match.",
      });
      return;
    }

    setPasswordSaving(true);
    try {
      // 1. Re-authenticate
      const credential = EmailAuthProvider.credential(currentUser.email, values.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // 2. Update password
      await updatePassword(currentUser, values.newPassword);

      toast.success("Password Updated", {
        description: "Your account password has been successfully updated.",
      });
      passwordForm.reset();
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Failed to update password";
      toast.error("Update Failed", { description: msg });
    } finally {
      setPasswordSaving(false);
    }
  });

  const displayEmail = currentUser?.email || reduxUser?.email || "No email linked";
  const displayName = reduxUser?.profileData?.memberName || reduxUser?.name || "Rider Member";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "TC";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 space-y-10">
        {/* Settings Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border/60">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Account Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your login credentials, security preferences, and account verification.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Account Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-border bg-card shadow-lg relative transition-all duration-200 hover:shadow-xl rounded-3xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[#19376D] to-[#576CBC]" />
              <CardContent className="p-6 pt-10 text-center space-y-6">
                {/* Profile Image / Initials */}
                <div className="flex justify-center">
                  <div className="relative h-24 w-24 rounded-2xl border-4 border-muted bg-muted shadow-md overflow-hidden">
                    {reduxUser?.profileData?.profileImage ? (
                      <img
                        src={reduxUser.profileData.profileImage}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent text-accent-foreground text-2xl font-bold">
                        {userInitials}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">{displayName}</h3>
                  <p className="text-xs text-muted-foreground truncate max-w-xs mx-auto">{displayEmail}</p>
                  <div className="pt-2 flex justify-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 py-0.5 px-2.5 hover:bg-emerald-500/20 rounded-md text-[10px] font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground border-border text-[10px] rounded-md px-2 py-0.5 font-mono">
                      ID: {reduxUser?.profileData?.uid || reduxUser?.userId || "TCM-NEW"}
                    </Badge>
                  </div>
                </div>

                {/* Security Checklist */}
                <div className="border-t border-border/50 pt-5 text-left space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Fingerprint className="h-4 w-4 text-primary" />
                    Security Checklist
                  </h4>
                  <ul className="text-xs space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-555 shrink-0" style={{ backgroundColor: "#10b981" }} />
                      Verified Email Address
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-555 shrink-0" style={{ backgroundColor: "#10b981" }} />
                      Secure Password Enabled
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                      Last password update: Recent
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Tip */}
            <Card className="border-border bg-muted/20 p-5 rounded-2xl">
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">Sensitive Actions</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Changing your email address or password requires re-authenticating with your current password to ensure your account remains secure.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Change Email Card */}
            <Card className="border-border bg-card shadow-lg relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[#19376D] to-[#576CBC]" />
              <CardHeader className="border-b border-border/50 bg-muted/10 pb-5 pt-7 px-6 md:px-8">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Mail className="h-5 w-5 text-primary" />
                  Change Email Address
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Update the email address you use to sign in and receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-5">
                <form onSubmit={handleEmailUpdate} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Current Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground/40" />
                      <Input
                        value={displayEmail}
                        disabled
                        className="border-border rounded-xl bg-muted/50 text-muted-foreground pl-11 pr-24 h-11"
                      />
                      <div className="absolute right-3 flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        <ShieldCheck className="h-3.5 w-3.5" /> Active
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">New Email Address *</label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground/40" />
                        <Input
                          type="email"
                          placeholder="e.g. new.email@domain.com"
                          {...emailForm.register("newEmail", { required: "New email is required" })}
                          className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary/25 focus-visible:border-primary bg-transparent text-foreground placeholder:text-muted-foreground/40 pl-11 h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Confirm Current Password *</label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground/40" />
                        <Input
                          type={showEmailVerifyPass ? "text" : "password"}
                          placeholder="Enter password to verify"
                          {...emailForm.register("password", { required: "Password is required" })}
                          className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary/25 focus-visible:border-primary bg-transparent text-foreground placeholder:text-muted-foreground/40 pl-11 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowEmailVerifyPass(!showEmailVerifyPass)}
                          className="absolute right-3 text-muted-foreground/60 hover:text-foreground p-1 rounded-md hover:bg-muted/40 transition-colors"
                        >
                          {showEmailVerifyPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <Button
                      type="submit"
                      disabled={emailSaving}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-6 py-2.5 shadow-md transition-all cursor-pointer"
                    >
                      {emailSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Email"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="border-border bg-card shadow-lg relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-[#19376D] to-[#576CBC]" />
              <CardHeader className="border-b border-border/50 bg-muted/10 pb-5 pt-7 px-6 md:px-8">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <KeyRound className="h-5 w-5 text-primary" />
                  Change Account Password
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Ensure your account is secure by using a strong, unique password.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-5">
                <form onSubmit={handlePasswordUpdate} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Current Password *</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground/40" />
                      <Input
                        type={showOldPass ? "text" : "password"}
                        placeholder="Enter current password"
                        {...passwordForm.register("currentPassword", { required: "Current password is required" })}
                        className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary/25 focus-visible:border-primary bg-transparent text-foreground placeholder:text-muted-foreground/40 pl-11 pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPass(!showOldPass)}
                        className="absolute right-3 text-muted-foreground/60 hover:text-foreground p-1 rounded-md hover:bg-muted/40 transition-colors"
                      >
                        {showOldPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">New Password *</label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground/40" />
                        <Input
                          type={showNewPass ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          {...passwordForm.register("newPassword", {
                            required: "New password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                          })}
                          className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary/25 focus-visible:border-primary bg-transparent text-foreground placeholder:text-muted-foreground/40 pl-11 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 text-muted-foreground/60 hover:text-foreground p-1 rounded-md hover:bg-muted/40 transition-colors"
                        >
                          {showNewPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Confirm New Password *</label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground/40" />
                        <Input
                          type={showConfirmPass ? "text" : "password"}
                          placeholder="Repeat new password"
                          {...passwordForm.register("confirmNewPassword", { required: "Confirm password is required" })}
                          className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary/25 focus-visible:border-primary bg-transparent text-foreground placeholder:text-muted-foreground/40 pl-11 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 text-muted-foreground/60 hover:text-foreground p-1 rounded-md hover:bg-muted/40 transition-colors"
                        >
                          {showConfirmPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <Button
                      type="submit"
                      disabled={passwordSaving}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-6 py-2.5 shadow-md transition-all cursor-pointer"
                    >
                      {passwordSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
