"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, FileCheck2, PhoneCall, ShieldCheck, MapPin, ExternalLink } from "lucide-react";
import { MemberProfile } from "@/types/member";

type SafetyContactPanelProps = {
  profileData: MemberProfile;
};

export default function SafetyContactPanel({
  profileData,
}: SafetyContactPanelProps) {
  const hasLicense = Boolean(profileData?.drivingLicenseImage);
  const emergencyPhone = profileData?.emergencyContact?.phone;
  const emergencyName = profileData?.emergencyContact?.name;
  const bloodGroup = profileData?.emergencyContact?.bloodGroup;

  return (
    <div className="space-y-6">
      {/* Verified Documents Widget */}
      <Card className="border-border bg-card shadow-md">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <FileCheck2 className="h-5 w-5 text-primary" />
            Verified Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">Driving License</p>
              <p className="text-xs text-muted-foreground">
                Official document for vehicle operation.
              </p>
            </div>
          </div>

          <div className="pt-2">
            {hasLicense ? (
              <a
                href={profileData.drivingLicenseImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button variant="outline" className="w-full gap-1.5 rounded-xl border-border hover:bg-muted">
                  View Document
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            ) : (
              <Button variant="outline" className="w-full rounded-xl border-border" disabled>
                No Document Uploaded
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-3">
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium">
              {hasLicense ? "Status: Verified" : "Status: Incomplete"}
            </span>
            {hasLicense && (
              <span className="font-medium">Verified recently</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency & Safety Widget */}
      <Card className="border-rose-500/20 bg-gradient-to-b from-card to-rose-500/[0.02] shadow-md relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl" />

        <CardHeader className="border-b border-rose-500/10 bg-rose-500/[0.02] pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-rose-600 dark:text-rose-400">
            <Droplet className="h-5 w-5 text-rose-500 animate-pulse" />
            Emergency Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {/* Blood Group and Contact Info */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between rounded-xl bg-rose-500/[0.03] border border-rose-500/10 p-3">
              <span className="text-xs font-semibold text-muted-foreground">Blood Group</span>
              <Badge className="bg-rose-500 text-white font-bold hover:bg-rose-600 rounded-lg px-2.5 py-0.5">
                {bloodGroup || "Not Set"}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Primary Contact
              </p>
              <p className="text-base font-bold text-foreground">
                {emergencyName || "Not specified"}
              </p>
              <p className="text-xs text-muted-foreground">
                {emergencyPhone ? "Emergency Contact Person" : "No contact registered"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {emergencyPhone ? (
              <a href={`tel:${emergencyPhone}`} className="block w-full">
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white gap-2 rounded-xl shadow-sm transition-all">
                  <PhoneCall className="h-4 w-4" />
                  Call {emergencyPhone}
                </Button>
              </a>
            ) : (
              <Button className="w-full bg-rose-600/50 text-white rounded-xl" disabled>
                <PhoneCall className="h-4 w-4 mr-2" />
                No Phone Number
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 gap-2 rounded-xl"
            >
              <MapPin className="h-4 w-4" />
              Share Live Location
            </Button>
          </div>

          {/* Verification / Activity Logs */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground border-t border-rose-500/10 pt-3">
            <div className="rounded-lg bg-muted/50 p-2 text-center">
              Next Check-in: <span className="font-semibold text-foreground block mt-0.5">Friday 9 PM</span>
            </div>
            <div className="rounded-lg bg-muted/50 p-2 text-center">
              Safety Status: <span className="font-semibold text-emerald-500 block mt-0.5">Secure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
