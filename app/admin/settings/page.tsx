"use client";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { Shield, Database, Bell, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Settings" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Platform configuration and preferences.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {/* Account Info */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-5 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#19376D]" />
                <CardTitle className="text-sm font-bold">Admin Account</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Name</span>
                <span className="text-sm font-medium">{user?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-medium">{user?.email ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Role</span>
                <Badge className="bg-[#19376D] text-white gap-1">
                  <Shield className="h-3 w-3" /> Super Admin
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Platform Info */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-5 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-[#19376D]" />
                <CardTitle className="text-sm font-bold">Platform</CardTitle>
              </div>
              <CardDescription className="text-xs">ThrottleConnect configuration</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Database</span>
                <Badge variant="secondary">Firebase Firestore</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Auth</span>
                <Badge variant="secondary">Firebase Auth</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Framework</span>
                <Badge variant="secondary">Next.js App Router</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags (static info) */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-5 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#19376D]" />
                <CardTitle className="text-sm font-bold">Active Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {["Marketplace", "Networking / Clubs", "Events", "Analytics", "Featured Items"].map((f) => (
                <div key={f} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{f}</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Active</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications (static) */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-5 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#19376D]" />
                <CardTitle className="text-sm font-bold">Notifications</CardTitle>
              </div>
              <CardDescription className="text-xs">Admin notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-slate-400">
                Notification settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
