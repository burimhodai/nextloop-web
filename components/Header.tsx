"use client";
import { useAuthStore } from "@/lib/stores/authStore";
import { Search, User, Heart, Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Link component definition remains the same
interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Link: React.FC<LinkProps> = ({ href, children, className, onClick }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

export function Header() {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>("/");

  // Use the state and action from the real Zustand store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handleScroll = () => {
      const categoriesElement = document.getElementById("hero-categories");
      if (categoriesElement) {
        const rect = categoriesElement.getBoundingClientRect();
        const isOutOfView = rect.bottom < 0;
        setShowSearch(isOutOfView);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
      if (!target.closest(".categories-menu-container")) {
        setShowCategoriesMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userLinkHref: string = isAuthenticated ? "/profile" : "/auth/login";
  const firstLetter: string = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "U";

  const isHomePage = currentPath === "/" || currentPath.includes("/search");

  const categories = [
    { name: "Uhren", icon: "⌚" },
    { name: "Kunst", icon: "🎨" },
    { name: "Elektronik", icon: "💻" },
    { name: "Jewelry", icon: "💎" },
    { name: "Designermöbel", icon: "🪑" },
    { name: "Wine", icon: "🍷" },
    { name: "Sammlerstücke", icon: "📸" },
    { name: "Instrumente", icon: "🎵" },
  ];

  const handleLogoutClick = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    logout();
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-[#faf8f4] ${["/dashboard", "/profile"].some((path) => currentPath.includes(path)) && "hidden"} border-b border-black/10`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/nextloop_logo.svg"
                alt="NextLoop"
                width={120}
                height={40}
                className="h-10"
              />
            </Link>

            {/* <nav className="hidden lg:flex items-center gap-8 text-sm text-[#5a524b]">
              <>
                <Link
                  href="/"
                  className="transition-colors py-1 hover:text-black/70"
                >
                  Home
                </Link>
                <div className="relative categories-menu-container">
                  <button
                    onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                    className="transition-colors py-1 hover:text-black/70 flex items-center gap-1"
                  >
                    Kategorien
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        showCategoriesMenu ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showCategoriesMenu && (
                    <div className="absolute left-0 mt-2 w-56 bg-[#faf8f4] rounded-md border border-[#e8dfd0] shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden z-50">
                      <div className="py-2">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            href={`/category/${category.name.toLowerCase()}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
                            onClick={() => setShowCategoriesMenu(false)}
                          >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            </nav> */}
          </div>

          <div
            className={`hidden md:flex flex-1 justify-center absolute left-1/2 -translate-x-1/2 ${
              showSearch ? "opacity-100" : "opacity-0 pointer-events-none"
            } transition-opacity duration-300 max-w-xl w-full`}
          >
            <div className="flex w-full gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a524b]"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  placeholder="Angebote suchen…"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#f5f1ea] rounded-md border border-[#d4cec4] text-[#3a3735] text-sm placeholder:text-[#5a524b]/60 focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 text-sm border border-black/20 text-[#3a3735] hover:bg-black hover:text-white transition-all rounded-md shadow-sm"
              >
                Abmelden
              </button>
            )}

            <div className="relative user-menu-container flex items-center">
              <Link
                href={userLinkHref}
                onClick={(e) => {
                  setShowUserMenu(!showUserMenu);
                }}
                className={`flex items-center text-[#3a3735] hover:text-[#c8a882] transition-colors p-1.5 rounded-full hover:bg-[#e8dfd0]`}
              >
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-[#c8a882] flex items-center justify-center border border-[#3a3735]/10 shadow-inner">
                    <span className="text-sm font-semibold text-[#3a3735]">
                      {firstLetter}
                    </span>
                  </div>
                ) : (
                  <User className="w-5 h-5" strokeWidth={1.5} />
                )}
              </Link>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 top-full w-48 bg-[#faf8f4] rounded-md border border-[#e8dfd0] shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="py-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2.5 text-sm text-[#3a3735] border-b border-[#e8dfd0] font-semibold">
                          Hallo, {user?.fullName.split(" ")[0]}
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profil Einstellungen
                        </Link>
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center gap-3"
                          onClick={handleLogoutClick}
                        >
                          Abmelden
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="block px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="lg:hidden text-[#3a3735] hover:text-[#c8a882] transition-colors">
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
