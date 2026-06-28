"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsSidebar } from "@/components/shared/Settings-sidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
