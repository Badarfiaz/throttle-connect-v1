"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

type ContactButtonProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
};

export default function ContactButton({
  label = "Whatsapp",
  onClick,
  className,
}: ContactButtonProps) {
  return (
    <Button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "h-10 rounded-xl bg-[#0F6AA6] px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0c5b8f] hover:shadow-md sm:h-11 sm:px-4 sm:text-sm",
        className,
      )}
    >
      <MessageCircle className="mr-1.5 size-3.5 sm:mr-2 sm:size-4" />
      {label}
    </Button>
  );
}
