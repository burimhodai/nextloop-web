// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/Button"; // Using your styled Button
import { Card } from "@/components/ui/Card"; // Using your styled Card
import {
  Package,
  Tag,
  Gavel,
  Eye,
  Coins,
  Plus,
  LogOut,
  User,
  PackageOpen,
} from "lucide-react";
import { IListing } from "@/lib/types/listing.types";

// Helper Component for Stats to keep main code clean
const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
  <div className="bg-white border border-[#d4cec4] p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-[#c8a882]">
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-[#5a524b] mb-2">
        {label}
      </p>
      <p
        className="text-3xl font-medium text-[#3a3735]"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        {value}
      </p>
    </div>
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#faf8f4] border border-[#d4cec4]`}
    >
      <Icon className={`w-5 h-5 ${colorClass}`} strokeWidth={1.5} />
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, token, logout } = useAuthStore();

  const [listings, setListings] = useState<IListing[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "sold" | "draft"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    totalViews: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.push("/auth/login");
    //   return;
    // }
    fetchListings();
    fetchStats();
  }, [isAuthenticated, activeTab]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const statusFilter =
        activeTab === "all" ? "" : `&status=${activeTab.toUpperCase()}`;

      const response = await fetch(
        `${API_URL}/listing?seller=${user?._id}${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setListings(data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing?seller=${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const stats = {
          totalListings: data.length,
          activeListings: data.filter((l: IListing) => l.status === "ACTIVE")
            .length,
          soldListings: data.filter((l: IListing) => l.status === "SOLD")
            .length,
          totalViews: data.reduce(
            (sum: number, l: IListing) => sum + (l.views || 0),
            0
          ),
          totalRevenue: data
            .filter((l: IListing) => l.status === "SOLD")
            .reduce(
              (sum: number, l: IListing) =>
                sum + l?.buyNowPrice || l.currentPrice,
              0
            ),
        };
        setStats(stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleEdit = (id: string) =>
    router.push(`/dashboard/listing/edit/${id}`);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/listing/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setListings((prev) => prev.filter((l) => l._id !== id));
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleBoost = (id: string) => router.push(`/dashboard/boost/${id}`);

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8a882] mx-auto mb-4"></div>
          <p className="text-[#5a524b] font-serif">
            Loading your collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Header */}
      <header className="bg-white border-b border-[#d4cec4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1
                className="text-3xl text-[#3a3735]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Dashboard
              </h1>
              <p className="text-[#5a524b] mt-1 text-sm tracking-wide">
                Welcome back,{" "}
                <span className="font-semibold text-[#3a3735]">
                  {user.fullName}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/dashboard/listings/new")}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Listing</span>
              </Button>
              <Button
                onClick={() => router.push("/profile")}
                variant="ghost"
                className="hidden sm:flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
              <Button
                onClick={logout}
                variant="ghost"
                className="text-[#5a524b] hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard
            label="Total Items"
            value={stats.totalListings}
            icon={Package}
            colorClass="text-[#3a3735]"
          />
          <StatCard
            label="Active"
            value={stats.activeListings}
            icon={Tag}
            colorClass="text-[#c8a882]"
          />
          <StatCard
            label="Sold"
            value={stats.soldListings}
            icon={Gavel}
            colorClass="text-[#3a3735]"
          />
          <StatCard
            label="Total Views"
            value={stats.totalViews}
            icon={Eye}
            colorClass="text-[#5a524b]"
          />
          <StatCard
            label="Revenue"
            value={`CHF ${stats.totalRevenue.toLocaleString()}`}
            icon={Coins}
            colorClass="text-[#c8a882]"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-[#d4cec4] mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: "all", label: "All Collection" },
              { key: "active", label: "Active" },
              { key: "sold", label: "Sold" },
              { key: "draft", label: "Drafts" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-4 px-1 border-b-2 text-sm uppercase tracking-widest font-medium transition-all ${
                  activeTab === tab.key
                    ? "border-[#c8a882] text-[#3a3735]"
                    : "border-transparent text-[#5a524b]/60 hover:text-[#3a3735] hover:border-[#d4cec4]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-20 bg-white border border-[#d4cec4]/30">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c8a882] mx-auto mb-4"></div>
            <p className="text-[#5a524b] font-serif">Curating listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-[#d4cec4] p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-[#f5f1ea] rounded-full flex items-center justify-center mx-auto mb-6 text-[#c8a882]">
              <PackageOpen className="w-10 h-10" strokeWidth={1} />
            </div>
            <h3
              className="text-2xl text-[#3a3735] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              No listings found
            </h3>
            <p className="text-[#5a524b] mb-8 max-w-sm mx-auto">
              {activeTab === "all"
                ? "Your collection is currently empty. Start your journey by consigning an item."
                : `You have no ${activeTab} items at the moment.`}
            </p>
            <Button
              onClick={() => router.push("/dashboard/listing/new")}
              variant="primary"
            >
              Create Your First Listing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBoost={handleBoost}
                showActions={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
