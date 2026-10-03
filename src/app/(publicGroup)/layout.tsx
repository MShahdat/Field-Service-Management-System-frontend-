import Footerpage from '@/shared/footer';
import { Navbar } from '@/shared/navbar';

import { ReactNode } from 'react';

const Layout = (
  { children }:
    { children: ReactNode }
) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        {children}
      </main>
      <Footerpage />
    </div>
  );
};

export default Layout;