import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { WhatsAppButton } from './WhatsAppButton';

export const StorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/60 text-gray-900">
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
