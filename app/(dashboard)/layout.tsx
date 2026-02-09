// app/(dashboard)/layout.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  User,
  LayoutDashboard,
  Package,
  Heart,
  Menu,
  X,
  ShieldCheck,
  DollarSign,
  LogOut,
  ChevronRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Smooth scroll lock for mobile sheet
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profil", href: "/profile", icon: User },
    { name: "Meine Anzeigen", href: "/dashboard/listings", icon: Package },
    { name: "Merkliste", href: "/dashboard/watchlist", icon: Heart },
    { name: "Käufe", href: "/dashboard/purchases", icon: DollarSign },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf8f4] flex flex-col">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#faf8f4]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/nextloop_logo.svg"
              alt="NextLoop"
              width={110}
              height={36}
              className="h-9 w-auto"
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#3a3735] hover:bg-black/5 rounded-full transition-all active:scale-95"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:flex flex-col w-72 bg-[#faf8f4] border-r border-black/5 sticky top-[73px] h-[calc(100vh-73px)] p-6">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-[#3a3735] text-[#faf8f4] shadow-lg shadow-black/10"
                      : "text-[#5a524b] hover:bg-black/[0.03] hover:text-[#3a3735]"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-[#c8a882]" : "opacity-70"}`}
                  />
                  <span className="text-sm font-medium tracking-tight">
                    {item.name}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto opacity-40" />
                  )}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#5a524b] hover:bg-red-50 hover:text-red-600 transition-colors w-full group mt-2"
            >
              <LogOut className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-medium tracking-tight">
                Abmelden
              </span>
            </button>
          </nav>

          {/* DESKTOP STATS CARD (Pinned to bottom) */}
          <div className="mt-auto p-5 bg-white rounded-2xl border border-black/5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#5a524b]">Kontostand</span>
              <span className="text-sm font-bold text-[#3a3735]">
                CHF {user.balance?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#5a524b]">Bewertung</span>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-[#c8a882] text-[#c8a882]" />
                <span className="text-sm font-bold text-[#3a3735]">
                  {user.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>
            {user.idVerification?.success && (
              <div className="pt-3 border-t border-black/5">
                <div className="flex items-center gap-2 text-[#16a34a]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[12px] font-semibold tracking-wide uppercase">
                    Verifiziertes Konto
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* --- MOBILE SHEET (Sliding from Right) --- */}
        <div
          className={`fixed inset-0 z-50 transition-all duration-500 lg:hidden ${
            sidebarOpen ? "visible" : "invisible"
          }`}
        >
          {/* Smooth Backdrop */}
          <div
            className={`absolute inset-0 bg-[#3a3735]/30 backdrop-blur-sm transition-opacity duration-500 ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Right-side Panel */}
          <aside
            className={`absolute inset-y-0 right-0 w-[85%] max-w-[340px] bg-[#faf8f4] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <p className="text-sm font-bold uppercase tracking-widest text-[#5a524b]">
                Menü
              </p>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 -mr-2 text-[#3a3735] hover:bg-black/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Profile Overview */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#c8a882] flex items-center justify-center text-[#3a3735] font-bold text-xl shadow-inner border-2 border-white">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-[#3a3735]">{user.fullName}</h4>
                  <p className="text-sm text-[#5a524b]">@{user.username}</p>
                </div>
              </div>

              {/* Mobile Nav */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#3a3735] text-[#faf8f4]"
                          : "text-[#5a524b] active:bg-black/5"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-[#c8a882]" : ""}`}
                      />
                      <span className="font-semibold">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Stats Summary */}
              <div className="p-5 bg-white rounded-2xl border border-black/5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-[#5a524b]">Kontostand</span>
                  <span className="font-bold text-[#3a3735]">
                    CHF {user.balance?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#5a524b]">Bewertung</span>
                  <span className="font-bold text-[#3a3735] flex items-center gap-1">
                    {user.rating?.toFixed(1)}{" "}
                    <Star className="w-3.5 h-3.5 fill-[#c8a882] text-[#c8a882]" />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-black/5">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-red-50 text-red-600 font-bold active:scale-95 transition-transform"
              >
                <LogOut className="w-5 h-5" />
                Abmelden
              </button>
            </div>
          </aside>
        </div>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
