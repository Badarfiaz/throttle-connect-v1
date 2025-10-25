import { Button } from "../ui/button";
import { ReactNode } from "react";

interface SharedButtonProps {
  label?: string;
  onClick?: () => void;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  className?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** alignment of content inside button */
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
}: SharedButtonProps) {
  // Map alignment to Tailwind justify classes

  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        size={size}
        variant={variant}
        className={`font-semibold shadow-md rounded-${rounded} flex items-center gap-2  ${className}`}
      >
        {iconLeft && <span className="flex items-center">{iconLeft}</span>}
        {label}
        {iconRight && <span className="flex items-center">{iconRight}</span>}
      </Button>
    </div>
  );
}
