"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface CardLinkWrapperProps {
  link: string;
  children: ReactNode;
}

function CardLinkWrapper({ link, children }: CardLinkWrapperProps) {
  const router = useRouter();
  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:opacity-90 transition"
    >
      {children}
    </div>
  );
}

export default CardLinkWrapper;
