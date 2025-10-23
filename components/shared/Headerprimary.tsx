"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Togglenav from "./ToggleNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const HeaderPrimary: FC = () => {
    const [open, setOpen] = useState(false);

  const pathname = usePathname();

  // 🎨 Common Classnames
  const mainContainer =
    "max-w-7xl mx-auto flex items-center justify-between px-6 py-3";
  const linkBase =
    "hover:text-[#19376D] transition-colors text-[#0B2447] font-medium";

  return (
    <header className="w-full bg-[#f8fcff] shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <div className={mainContainer}>
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-2">
          {/* <Image
            src="/logo.svg" // replace with your logo
            alt="ThrottleConnect Logo"
            width={32}
            height={32}
          /> */}
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
 
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button
          className="bg-[#0B2447] hover:bg-[#19376D] text-white rounded-md px-5"
        >
          Login
        </Button>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="max-w-md rounded-2xl bg-background text-text">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center mb-2">
            Welcome to Throttle Connect
          </DialogTitle>
          <DialogDescription className="text-center">
            Login or create an account to continue.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs for Login / Signup */}
        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* --- LOGIN FORM --- */}
          <TabsContent value="login">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // ✅ Handle login here (auth API or Firebase)
                setOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="********" required />
              </div>

              <Button type="submit" className="w-full bg-[#0B2447] hover:bg-[#19376D] text-white">
                Login
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Forgot your password?{" "}
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Reset it
                </Link>
              </p>
            </form>
          </TabsContent>

          {/* --- SIGNUP FORM --- */}
          <TabsContent value="signup">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // ✅ Handle signup here (auth API or Firebase)
                setOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" required />
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" placeholder="********" required />
              </div>

              <Button type="submit" className="w-full bg-[#0B2447] hover:bg-[#19376D] text-white">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
      </div>
    </header>
  );
};

export default HeaderPrimary;
