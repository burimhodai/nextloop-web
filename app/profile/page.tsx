"use client";

import { useState } from 'react';
import { LayoutDashboard, Package, Gavel, Wallet, Settings, MessageSquare, TrendingUp } from 'lucide-react';
import { DashboardOverview } from '@/components/profile/DashboardOverview';
import { ListingsManagement } from '@/components/profile/ListingsManagement';
import { BidsAndPurchases } from '@/components/profile/BidsAndPurchases';
import { WalletAndTransactions } from '@/components/profile/WalletAndTransactions';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { MessagesAndAnalytics } from '@/components/profile/MessagesAndAnalytics';


type TabType = 'dashboard' | 'listings' | 'bids' | 'wallet' | 'settings' | 'messages';

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} /> },
  { id: 'listings' as TabType, label: 'My Listings', icon: <Package className="w-5 h-5" strokeWidth={1.5} /> },
  { id: 'bids' as TabType, label: 'Bids & Purchases', icon: <Gavel className="w-5 h-5" strokeWidth={1.5} /> },
  { id: 'wallet' as TabType, label: 'Wallet', icon: <Wallet className="w-5 h-5" strokeWidth={1.5} /> },
  { id: 'messages' as TabType, label: 'Messages & Analytics', icon: <MessageSquare className="w-5 h-5" strokeWidth={1.5} /> },
  { id: 'settings' as TabType, label: 'Account Settings', icon: <Settings className="w-5 h-5" strokeWidth={1.5} /> }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f4] to-[#f5f1ea] py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 
            className="text-[#3a3735] mb-2"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem' }}
          >
            My Profile
          </h1>
          <p className="text-[#5a524b]">Manage your listings, bids, and account settings</p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white shadow-md border border-[#e8dfd0] mb-8 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#c8a882] text-[#c8a882] bg-[#faf8f4]'
                    : 'border-transparent text-[#5a524b] hover:text-[#3a3735] hover:bg-[#faf8f4]'
                }`}
              >
                {tab.icon}
                <span className="tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'listings' && <ListingsManagement />}
          {activeTab === 'bids' && <BidsAndPurchases />}
          {activeTab === 'wallet' && <WalletAndTransactions />}
          {activeTab === 'settings' && <AccountSettings />}
          {activeTab === 'messages' && <MessagesAndAnalytics />}
        </div>
      </div>
    </div>
  );
}
