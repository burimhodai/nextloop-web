"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import ListingsComponent from '@/components/Listings';
import { Categories } from '@/components/Categories';
import { FeaturedAuctions } from '@/components/FeaturedAuctions';
import { LiveAuctions } from '@/components/LiveAuctions';
import { Editorial } from '@/components/Editorial';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <main>
        <Hero />
       <ListingsComponent/>
        <Categories />
        <FeaturedAuctions />
        <LiveAuctions />
        <Editorial />
      </main>
      <Footer />
    </div>
  );
}