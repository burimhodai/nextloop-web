// app/(dashboard)/layout.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  AlertCircle,
  ShieldAlert,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/auth/login");
  //   }
  // }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isIdVerified = user?.idVerification?.success || false;

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Profil",
      href: "/profile",
      icon: User,
    },
    {
      name: "Meine Anzeigen",
      href: "/dashboard/listings",
      icon: Package,
    },
    {
      name: "Merkliste",
      href: "/dashboard/watchlist",
      icon: Heart,
    },
    {
      name: "Käufe",
      href: "/dashboard/purchases",
      icon: DollarSign,
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
          <p className="text-[#5a524b]">Laden...</p>
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
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/nextloop_logo.svg"
              alt="NextLoop"
              width={120}
              height={40}
              className="h-10"
            />
          </Link>
          {/* Right Side - User Info */}
          <div className="flex items-center gap-4">
            <button className="relative text-[#3a3735] hover:text-[#c8a882] transition-colors">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-[#3a3735]">
                  {user?.fullName}
                </p>
                <p className="text-xs text-[#5a524b]">@{user.username}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#c8a882] flex items-center justify-center border-2 border-[#3a3735]/10">
                <span className="text-sm font-semibold text-[#3a3735]">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ID Verification Banner */}
        {!isIdVerified && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <ShieldAlert
                  className="w-5 h-5 text-amber-600"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Identitätsprüfung erforderlich
                  </p>
                  <p className="text-xs text-amber-700">
                    Schließen Sie die Identitätsprüfung ab, um Angebote zu
                    erstellen und an Auktionen teilzunehmen.
                  </p>
                </div>
              </div>
              <a
                href="/profile/verify"
                className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
              >
                Jetzt überprüfen
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden h-fit lg:block w-64 bg-[#faf8f4] border-r border-black/10 min-h-[calc(100vh-73px)] sticky top-[73px]">
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
              <span className="tracking-wide">Abmelden</span>
            </button>
          </nav>

          {/* ID Verification Alert in Sidebar */}
          {!isIdVerified && (
            <div className="mx-6 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle
                  className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Nachweis erforderlich
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Verifizieren Sie Ihre Identität, um vollen Zugriff auf den
                    Marktplatz zu erhalten.
                  </p>
                </div>
              </div>
              <a
                href="/profile/verify"
                className="block w-full text-center px-3 py-2 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
              >
                Identität überprüfen
              </a>
            </div>
          )}

          {/* User Stats Card */}
          <div className="mx-6 mt-6 p-4 bg-[#f5f1ea] rounded-lg border border-[#d4cec4]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5a524b]">Kontostand</span>
                <span className="text-sm font-bold text-[#3a3735]">
                  CHF {user?.balance?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5a524b]">Bewertung</span>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-[#c8a882] mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-[#3a3735]">
                    {user?.rating?.toFixed(1) || "0.0"}
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
                    Verifiziertes Konto
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

            <aside className="fixed top-0 left-0 w-64 h-full bg-[#faf8f4] shadow-2xl z-50 lg:hidden transform transition-transform overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/nextloop_logo.svg"
                      alt="NextLoop"
                      width={120}
                      height={40}
                      className="h-10"
                    />
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-[#3a3735] hover:text-[#c8a882]"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                {/* ID Verification Alert - Mobile */}
                {!isIdVerified && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle
                        className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                          Nachweis erforderlich
                        </p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Bestätigen Sie Ihre Identität, um Einträge zu
                          erstellen.
                        </p>
                      </div>
                    </div>
                    <a
                      href="/profile/verify"
                      className="block w-full text-center px-3 py-2 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
                    >
                      Identität überprüfen
                    </a>
                  </div>
                )}

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
                    <span className="tracking-wide">Abmelden</span>
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
