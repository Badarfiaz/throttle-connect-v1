"use client";

import React from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileRequiredBanner() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const isProfileCompleted = user?.profileData?.completed;

  if (isProfileCompleted) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-2xl p-6 shadow-sm max-w-5xl mx-auto mt-8 px-6 animate-pulse">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">Complete Your Profile</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              You need to complete your member and rider profile in settings before you can register or join any automotive clubs.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => router.push("/profile")}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow-sm rounded-xl shrink-0 transition"
        >
          Complete Profile <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
