import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getContactMethod,
  type ContactMethodType,
} from "@/ulity/getContactMethod";
type ContactButtonProps = {
  phone?: string | null;
  email?: string | null;
  preferredMethod?: ContactMethodType;
};

function ContactButton({
  phone,
  email,
  preferredMethod = "whatsapp",
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

  return (
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
          contactMethod.target === "_blank" ? "noopener noreferrer" : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        <ContactIcon size={16} />
        {contactMethod.label}
      </a>
    </Button>
  );
}

export default ContactButton;
