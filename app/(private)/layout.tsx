import React from "react";
import Script from "next/script";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <Script
        src="https://unpkg.com/@algolia/sitesearch@latest/dist/search.min.js"
        strategy="afterInteractive"
      />
      {children}
    </main>
  );
};

export default Layout;
