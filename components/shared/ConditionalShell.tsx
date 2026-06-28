"use client";
import { usePathname } from "next/navigation";
import HeaderPrimary from "./Headerprimary";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <HeaderPrimary />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
