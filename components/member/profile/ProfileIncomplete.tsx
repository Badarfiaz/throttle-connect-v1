"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileIncompleteProps {
  onComplete: () => void;
}

export default function ProfileIncomplete({ onComplete }: ProfileIncompleteProps) {
  return (
    <Card className="max-w-xl mx-auto my-12 border-dashed border-2 border-border bg-card/50 backdrop-blur-xs shadow-md rounded-3xl overflow-hidden">
      <CardContent className="p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
          <AlertCircle className="h-8 w-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Your profile is incomplete
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Complete your rider information, primary vehicle details, and emergency contacts to join automotive clubs and register for runs.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-6 py-2.5 shadow-md hover:shadow-lg transition-all"
          onClick={onComplete}
        >
          Complete Profile Now
        </Button>
      </CardContent>
    </Card>
  );
}
