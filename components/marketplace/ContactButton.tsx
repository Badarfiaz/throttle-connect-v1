"use client";
import React from "react";
import { Phone, Mail, MessageCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ContactButtonProps {
  phone?: string | null;
  email?: string | null;
  preferredMethod?: string | null;
}

export default function ContactButton({
  phone,
  email,
  preferredMethod = "whatsapp",
}: ContactButtonProps) {
  const getContactMethods = () => {
    const methods = [];

    if (preferredMethod === "whatsapp" && phone) {
      methods.push({
        type: "whatsapp",
        label: "WhatsApp",
        icon: MessageCircle,
        href: `https://wa.me/${phone.replace(/\D/g, "")}`,
        bgColor: "bg-emerald-600 hover:bg-emerald-700",
        textColor: "text-white",
      });
    } else if (preferredMethod === "phone" && phone) {
      methods.push({
        type: "phone",
        label: "Call",
        icon: Phone,
        href: `tel:${phone}`,
        bgColor: "bg-green-600 hover:bg-green-700",
        textColor: "text-white",
      });
    } else if (preferredMethod === "email" && email) {
      methods.push({
        type: "email",
        label: "Email",
        icon: Mail,
        href: `mailto:${email}`,
        bgColor: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-white",
      });
    }

    return methods;
  };

  const getOtherMethods = () => {
    const others = [];

    if (preferredMethod !== "phone" && phone) {
      others.push({
        type: "phone",
        label: "Call",
        icon: Phone,
        href: `tel:${phone}`,
      });
    }

    if (preferredMethod !== "email" && email) {
      others.push({
        type: "email",
        label: "Email",
        icon: Mail,
        href: `mailto:${email}`,
      });
    }

    if (
      preferredMethod !== "whatsapp" &&
      phone &&
      preferredMethod !== "phone"
    ) {
      others.push({
        type: "whatsapp",
        label: "WhatsApp",
        icon: MessageCircle,
        href: `https://wa.me/${phone.replace(/\D/g, "")}`,
      });
    }

    return others;
  };

  const primaryMethods = getContactMethods();
  const otherMethods = getOtherMethods();
  const primaryMethod = primaryMethods[0];

  if (!primaryMethod) {
    return null;
  }

  const PrimaryIcon = primaryMethod.icon;

  return (
    <div className="flex items-center gap-2">
      <a href={primaryMethod.href} target="_blank" rel="noopener noreferrer">
        <Button
          size="lg"
          className={`${primaryMethod.bgColor} ${primaryMethod.textColor} gap-2 flex-1 font-semibold rounded-lg transition-all hover:shadow-lg`}
        >
          <PrimaryIcon className="h-5 w-5" />
          {primaryMethod.label}
        </Button>
      </a>

      {otherMethods.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {otherMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.type}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2.5">
                    <Icon className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-sm">{method.label}</p>
                      {method.type === "phone" && (
                        <p className="text-xs text-muted-foreground">
                          {/* Show phone number if available */}
                        </p>
                      )}
                    </div>
                  </DropdownMenuItem>
                </a>
              );
            })}
            {otherMethods.length > 0 && <DropdownMenuSeparator />}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
