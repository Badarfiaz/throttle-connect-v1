import { CalendarDays, ShieldCheck, Wrench, Users, LucideIcon } from "lucide-react";

export interface FeatureItem {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const whyThrottleConnectData = {
  title: "Why ThrottleConnect?",
  description:
    "ThrottleConnect is more than just a marketplace. It’s the first platform built for car & bike lovers to connect, discover events, shop accessories, and access verified services — all in one place.",
  buttonText: "Get Started",
  features: [
    {
      id: 1,
      icon: CalendarDays,
      title: "CLUBS & EVENTS",
      description:
        "Create or join automotive clubs and register for upcoming events & meetups.",
    },
    {
      id: 2,
      icon: ShieldCheck,
      title: "SECURE PAYMENTS",
      description:
        "Safe transactions through verified and trusted payment methods.",
    },
    {
      id: 3,
      icon: Wrench,
      title: "VERIFIED SERVICES",
      description:
        "Find mechanics, electricians, and service providers you can trust.",
    },
    {
      id: 4,
      icon: Users,
      title: "COMMUNITY CONNECT",
      description:
        "Engage in forums, share media, and connect with fellow car & bike enthusiasts.",
    },
  ] as FeatureItem[],
};

