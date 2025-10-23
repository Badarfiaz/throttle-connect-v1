"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Togglenav from "./ToggleNav";
 
const HeaderPrimary: FC = () => {
  const pathname = usePathname();

  // 🎨 Common Classnames
  const mainContainer =
    "max-w-7xl mx-auto flex items-center justify-between px-6 py-3";
  const linkBase =
    "hover:text-[#19376D] transition-colors text-[#0B2447] font-medium";

  return (
    <header className="w-full bg-[#f8fcff] shadow-sm">
      <div className={mainContainer}>
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg" // replace with your logo
            alt="ThrottleConnect Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold text-[#0B2447]">
            Throttle<span className="text-[#19376D]">Connect</span>
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className={linkBase}>
            Home
          </Link>
          <Link href="/blogs" className={linkBase}>
            Blogs
          </Link>
          <Link href="/contact" className={linkBase}>
            Contact Us
          </Link>

          {/* Toggle Navigation (Marketplace / Builders) */}
          <Togglenav pathname={pathname} />
        </div>

        {/* Right: Login Button */}
        <Button
          asChild
          className="bg-[#0B2447] hover:bg-[#19376D] text-white rounded-md px-5"
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
};

export default HeaderPrimary;
