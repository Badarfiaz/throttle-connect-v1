import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./redux/reduxProvider";
import { Toaster } from "sonner";
import { ConditionalShell } from "@/components/shared/ConditionalShell";

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
          <ConditionalShell>{children}</ConditionalShell>
          {/* Required by Firebase Phone Auth — must stay in DOM at all times */}
          <div id="recaptcha-container" style={{ position: "fixed", bottom: 0, zIndex: -9999 }} />
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
