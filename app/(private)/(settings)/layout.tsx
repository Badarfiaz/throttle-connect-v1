import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1>yahan pe settings ka component lagana apna </h1>
      {children}
    </>
  );
};

export default Layout;
