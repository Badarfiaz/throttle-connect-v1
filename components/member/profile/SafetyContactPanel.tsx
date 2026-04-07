import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplet, FileCheck2, PhoneCall } from "lucide-react";
import type { MemberProfile } from "../registration/types";

type SafetyContactPanelProps = {
  member: MemberProfile;
};

export default function SafetyContactPanel({
  member,
}: SafetyContactPanelProps) {
  return (
    <section
      className="grid gap-6 rounded-3xl border border-border/70 bg-card p-5 text-card-foreground shadow-xl "
      style={{
        backgroundImage:
          "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 70%)",
      }}
    >
      <div className="rounded-2xl border border-border/60 bg-muted/40 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verified Document</p>
            <p className="font-semibold">Driving License</p>
          </div>
        </div>

        <Button>View Document</Button>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-background/70 px-3 py-1">
            Last verified 4 days ago
          </span>
          <button className="text-primary underline-offset-2 hover:underline">
            Re-upload
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background/80 to-muted/60 p-0 overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0 sm:gap-4 p-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <Droplet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
                Emergency Contact
              </p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {member.emergencyContact?.name || "Not specified"}
              </p>
              <span className="text-xs text-muted-foreground">
                Blood Group:{" "}
                <span className="font-semibold text-destructive">
                  {member.emergencyContact?.bloodGroup || "N/A"}
                </span>
              </span>
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex flex-col items-end gap-1">
            <Button
              size="sm"
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              Call {member.emergencyContact?.phone || "N/A"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto border-destructive/40 text-destructive hover:bg-destructive/10 mt-1"
            >
              Share Live Location
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 px-5 pb-5">
          <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-3 text-xs text-muted-foreground">
            Next Check-in:{" "}
            <span className="font-medium text-foreground">Friday 9 PM</span>
          </div>
          <div className="flex-1 rounded-xl border border-border/40 bg-background/60 p-3 text-xs text-muted-foreground">
            Last alert:{" "}
            <span className="font-medium text-foreground">12 days ago</span>
          </div>
        </div>
      </div>
    </section>
  );
}
