import { Button } from "../ui/button";
import { ReactNode } from "react";

interface SharedButtonProps {
  label?: string;
  onClick?: () => void;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  className?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  align?: "left" | "center" | "right";
}

export default function SharedButton({
  label,
  onClick,
  size = "lg",
  variant = "default",
  className = "",
  rounded = "lg",
  iconLeft,
  iconRight,
  align = "center",
}: SharedButtonProps) {
  const justifyClass =
    align === "left"
      ? "justify-start"
      : align === "right"
      ? "justify-end"
      : "justify-center";

  // ✅ Tailwind-safe mapping for rounded sizes
  const roundedMap: Record<NonNullable<SharedButtonProps["rounded"]>, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  return (
    <div className={`flex ${justifyClass}`}>
      <Button
        onClick={onClick}
        size={size}
        variant={variant}
        className={`font-semibold shadow-md ${roundedMap[rounded]} flex items-center gap-2 ${className}`}
      >
        {iconLeft && <span className="flex items-center">{iconLeft}</span>}
        {label}
        {iconRight && <span className="flex items-center">{iconRight}</span>}
      </Button>
    </div>
  );
}
