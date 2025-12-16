// app/(dashboard)/layout.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  User,
  LayoutDashboard,
  Package,
  Heart,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      name: "My Listings",
      href: "/dashboard/listings",
      icon: Package,
    },
    {
      name: "Watchlist",
      href: "/dashboard/watchlist",
      icon: Heart,
    },
    // {
    //   name: "Settings",
    //   href: "/dashboard/settings",
    //   icon: Settings,
    // },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a3735] mx-auto mb-4"></div>
          <p className="text-[#5a524b]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#faf8f4] border-b border-black/10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#3a3735] hover:text-[#c8a882] transition-colors"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3a3735] flex items-center justify-center rounded-sm">
                <span
                  className="text-[#c8a882] text-xl font-bold"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  N
                </span>
              </div>
              <span
                style={{ fontFamily: "Playfair Display, serif" }}
                className="text-[#3a3735] tracking-tight text-lg font-bold"
              >
                NextLoop
              </span>
            </a>
          </div>

          {/* Right Side - User Info */}
          <div className="flex items-center gap-4">
            <button className="relative text-[#3a3735] hover:text-[#c8a882] transition-colors">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-[#3a3735]">
                  {user.fullName}
                </p>
                <p className="text-xs text-[#5a524b]">@{user.username}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#c8a882] flex items-center justify-center border-2 border-[#3a3735]/10">
                <span className="text-sm font-semibold text-[#3a3735]">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-[#faf8f4] border-r border-black/10 min-h-[calc(100vh-73px)] sticky top-[73px] h-fit">
          <nav className="p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                    isActive
                      ? "bg-[#3a3735] text-[#c8a882] font-semibold shadow-sm"
                      : "text-[#5a524b] hover:bg-[#f5f1ea] hover:text-[#3a3735]"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="tracking-wide">{item.name}</span>
                </a>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-[#5a524b] hover:bg-red-50 hover:text-red-600 transition-all w-full mt-4"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              <span className="tracking-wide">Logout</span>
            </button>
          </nav>

          {/* User Stats Card */}
          <div className="mx-6 mt-6 p-4 bg-[#f5f1ea] rounded-lg border border-[#d4cec4]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5a524b]">Balance</span>
                <span className="text-sm font-bold text-[#3a3735]">
                  CHF {user?.balance.toFixed(2) || 0.0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5a524b]">Rating</span>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-[#c8a882] mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-[#3a3735]">
                    {user?.rating.toFixed(1) || 0.0}
                  </span>
                </div>
              </div>
              {user.emailVerified && (
                <div className="pt-2 border-t border-[#d4cec4]">
                  <span className="inline-flex items-center text-xs text-green-700">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified Account
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-[#3a3735]/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>

            <aside className="fixed top-0 left-0 w-64 h-full bg-[#faf8f4] shadow-2xl z-50 lg:hidden transform transition-transform">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#3a3735] flex items-center justify-center rounded-sm">
                      <span
                        className="text-[#c8a882] text-xl font-bold"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        N
                      </span>
                    </div>
                    <span
                      style={{ fontFamily: "Playfair Display, serif" }}
                      className="text-[#3a3735] tracking-tight text-lg font-bold"
                    >
                      NextLoop
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-[#3a3735] hover:text-[#c8a882]"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                          isActive
                            ? "bg-[#3a3735] text-[#c8a882] font-semibold"
                            : "text-[#5a524b] hover:bg-[#f5f1ea] hover:text-[#3a3735]"
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                        <span className="tracking-wide">{item.name}</span>
                      </a>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-[#5a524b] hover:bg-red-50 hover:text-red-600 transition-all w-full mt-4"
                  >
                    <LogOut className="w-5 h-5" strokeWidth={1.5} />
                    <span className="tracking-wide">Logout</span>
                  </button>
                </nav>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
