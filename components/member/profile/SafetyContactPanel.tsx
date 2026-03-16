import React from "react";
import { Button } from "@/components/ui/button";
import { Droplet, FileCheck2, PhoneCall } from "lucide-react";
import type { MemberProfile } from "../registration/types";

type SafetyContactPanelProps = {
  member: MemberProfile;
};

export default function SafetyContactPanel({ member }: SafetyContactPanelProps) {
  return (
    <section className="grid gap-6">

      {/* Verified Document */}
      <div className="rounded-2xl border bg-card p-6 shadow-md">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Verified Document
              </p>
              <p className="font-semibold">
                Driving License
              </p>
            </div>

          </div>

          <Button size="sm">
            View Document
          </Button>

        </div>

        <div className="mt-4 flex gap-3 text-xs text-muted-foreground">

          <span className="rounded-full bg-muted px-3 py-1">
            Last verified 4 days ago
          </span>

          <button className="text-primary hover:underline">
            Re-upload
          </button>

        </div>

      </div>



      {/* Emergency Contact */}
      <div className="rounded-2xl border bg-card p-6 shadow-md">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Droplet className="h-6 w-6" />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase text-red-600">
                Emergency Contact
              </p>

              <p className="text-lg font-bold">
                {member.emergencyContact.name}
              </p>

              <p className="text-xs text-muted-foreground">
                Blood Group{" "}
                <span className="font-semibold text-red-600">
                  {member.emergencyContact.bloodGroup || "N/A"}
                </span>
              </p>

            </div>

          </div>


          <div className="flex flex-col gap-2 sm:items-end">

            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <PhoneCall className="mr-2 h-4 w-4" />
              Call {member.emergencyContact.phone}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-600"
            >
              Share Live Location
            </Button>

          </div>

        </div>


        <div className="mt-5 grid sm:grid-cols-2 gap-3">

          <div className="rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
            Next Check-in{" "}
            <span className="font-medium text-foreground">
              Friday 9 PM
            </span>
          </div>

          <div className="rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
            Last alert{" "}
            <span className="font-medium text-foreground">
              12 days ago
            </span>
          </div>

        </div>

      </div>

    </section>
  );
}