 import React from 'react';
import styles from "./styles.module.scss";
import Headerprimary from '@/components/shared/Headerprimary';
 
const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
       <main>
<Headerprimary/>
      {children}
      
    </main>
     </>
  );
};

export default Layout;