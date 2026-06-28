"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileIncompleteProps {
  onComplete: () => void;
}

export default function ProfileIncomplete({ onComplete }: ProfileIncompleteProps) {
  return (
    <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-3xl mx-auto my-10 shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
        <AlertCircle className="h-8 w-8 animate-bounce" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">Your profile is incomplete</h2>
      <p className="text-sm text-slate-500 max-w-md">
        Complete your rider information, primary vehicle brand/model, and emergency
        contacts to join automotive clubs and register for runs.
      </p>
      <Button
        className="bg-[#19376D] hover:bg-[#0B2447] text-white font-semibold rounded-xl px-6 py-2 shadow-sm transition"
        onClick={onComplete}
      >
        Complete Profile Now
      </Button>
    </section>
  );
}
