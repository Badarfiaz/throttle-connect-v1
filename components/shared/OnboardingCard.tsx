"use client";

import React from "react";
import Link from "next/link";
import SharedButton from "@/components/shared/SharedButton";

interface OnboardingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits?: string[];
  buttonText: string;
  link: string;
  onButtonClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function OnboardingCard({
  icon,
  title,
  description,
  benefits,
  buttonText,
  link,
  onButtonClick,
}: OnboardingCardProps) {
  return (
    <div
      className="
        h-full max-w-[460px] mx-auto
        rounded-2xl border border-primary/20 bg-white
        shadow-sm
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1 hover:border-primary/40
      "
    >
      <div className="flex flex-col h-full p-6">
        {/* Icon */}
        <div
          className="
            w-12 h-12 flex items-center justify-center
            rounded-lg bg-primary text-white text-xl
            mb-4
            transition-transform duration-300
            group-hover:scale-105
          "
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Benefits */}
        {benefits && (
          <ul className="space-y-2 text-sm text-foreground flex-grow">
            {benefits.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* Button */}
        <div className="mt-6">
          <Link href={link} onClick={onButtonClick}>
            <SharedButton
              label={buttonText}
              size="lg"
              rounded="xl"
              className="w-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
