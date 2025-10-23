 import HeaderPrimary from '@/components/shared/HeaderPrimary';
import React from 'react';
   
const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
       <main>
        {children}

    </main>
     </>
  );
};

export default Layout;