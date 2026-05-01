import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderPrimary from "@/components/shared/Headerprimary";
import Footer from "@/components/shared/Footer";
import ReduxProvider from "./redux/reduxProvider";
import { Toaster } from "sonner";
import MobileBottomNav from "@/components/shared/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ReduxProvider>
          <HeaderPrimary />

          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <MobileBottomNav />
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{ duration: 3000 }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
