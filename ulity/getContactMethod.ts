import { Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import type { ContactMethod as StoreContactMethod } from "@/types/CommonType";

export type ContactMethodType = StoreContactMethod;

export type ContactMethod = {
  label: string;
  icon: LucideIcon;
  href: string;
  target: "_self" | "_blank";
};

type GetContactMethodParams = {
  phone?: string | null;
  email?: string | null;
  preferredMethod?: ContactMethodType;
};

export function getContactMethod({
  phone,
  email,
  preferredMethod = "whatsapp",
}: GetContactMethodParams): ContactMethod | null {
  if (preferredMethod === "phone" && phone) {
    return {
      label: "Call",
      icon: Phone,
      href: `tel:${phone}`,
      target: "_self",
    };
  }

  if (preferredMethod === "email" && email) {
    return {
      label: "Email",
      icon: Mail,
      href: `mailto:${email}`,
      target: "_self",
    };
  }

  if (preferredMethod === "social" && phone) {
    return {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/${phone.replace(/\D/g, "")}`,
      target: "_blank",
    };
  }

  if (phone) {
    return {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/${phone.replace(/\D/g, "")}`,
      target: "_blank",
    };
  }

  if (email) {
    return {
      label: "Email",
      icon: Mail,
      href: `mailto:${email}`,
      target: "_self",
    };
  }

  return null;
}
