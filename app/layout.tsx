 import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderPrimary from "@/components/shared/Headerprimary";
import ReduxProvider from "./redux/reduxProvider";
import { Toaster } from "sonner"

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>

        <HeaderPrimary/>
        
        {children}
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
