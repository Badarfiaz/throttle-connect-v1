import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getContactMethod,
  getAllContactMethods,
  type ContactMethodType,
} from "@/ulity/getContactMethod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
type ContactButtonProps = {
  phone?: string | null;
  email?: string | null;
  preferredMethod?: ContactMethodType;
  menuIcon?: boolean;
};

function ContactButton({
  phone,
  email,
  preferredMethod = "whatsapp",
  menuIcon = false,
}: ContactButtonProps) {
  const contactMethod = getContactMethod({
    phone,
    email,
    preferredMethod,
  });

  if (!contactMethod) {
    return null;
  }

  const ContactIcon = contactMethod.icon;

  // Determine the effective method being used as primary
  const getEffectiveMethod = (): ContactMethodType | null => {
    if (contactMethod.label === "WhatsApp") return "social";
    if (contactMethod.label === "Call") return "phone";
    if (contactMethod.label === "Email") return "email";
    return null;
  };

  // Get all available contact methods and filter out the primary one
  const allMethods = getAllContactMethods({ phone, email, preferredMethod });
  const effectiveMethod = getEffectiveMethod();
  const alternativeMethods = allMethods.filter(
    (method) => method.method !== effectiveMethod,
  );

  return (
    <>
      <Button
        asChild
        className={cn(
          "flex-1 h-9 text-xs font-medium gap-1.5",
          "bg-[#19376D] hover:bg-[#0E5A8E] text-white",
        )}
      >
        <a
          href={contactMethod.href}
          target={contactMethod.target}
          rel={
            contactMethod.target === "_blank"
              ? "noopener noreferrer"
              : undefined
          }
          onClick={(e) => e.stopPropagation()}
        >
          <ContactIcon size={16} />
          {contactMethod.label}
        </a>
      </Button>
      {menuIcon && alternativeMethods.length > 0 && (
        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {alternativeMethods.map((method) => {
                const MethodIcon = method.icon;
                return (
                  <DropdownMenuItem key={method.method} asChild>
                    <a
                      href={method.href}
                      target={method.target}
                      rel={
                        method.target === "_blank"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <MethodIcon size={16} />
                      <span>{method.label}</span>
                    </a>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}

export default ContactButton;
