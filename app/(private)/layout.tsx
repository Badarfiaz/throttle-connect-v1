import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
      {children}
    </main>
  );
};

export default Layout;
