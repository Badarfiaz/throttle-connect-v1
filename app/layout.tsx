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
