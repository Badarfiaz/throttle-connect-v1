"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { HeartHandshake } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ProfileFormValues } from "../profileForm.types";
import { BLOOD_GROUPS } from "../profileForm.constants";

interface EmergencyContactFieldsProps {
  form: UseFormReturn<ProfileFormValues>;
}

export default function EmergencyContactFields({ form }: EmergencyContactFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 border-b border-border/40 pb-2">
        <HeartHandshake className="h-4 w-4" /> Emergency Contact
      </h3>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Contact Name *</label>
          <Input
            placeholder="Emergency contact full name"
            {...form.register("emergencyContactName", { required: "Required for safety" })}
            className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary bg-transparent text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Contact Phone *</label>
          <Input
            type="tel"
            placeholder="Emergency phone number"
            {...form.register("emergencyContactPhone", { required: "Required for safety" })}
            className="border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary bg-transparent text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Blood Group</label>
          <Select
            value={form.watch("bloodGroup")}
            onValueChange={(val) => form.setValue("bloodGroup", val)}
          >
            <SelectTrigger className="w-full border-border rounded-xl bg-transparent text-foreground">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
