"use client";
import { useAuthStore } from "@/lib/stores/authStore";
import { Search, User, Heart, Menu, LogOut } from "lucide-react";
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
  const [currentPath, setCurrentPath] = useState<string>("/profile");

  // Use the state and action from the real Zustand store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
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

  const navItems = [
    { name: "Profile", href: "/profile" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Marketplace", href: "/marketplace" },
  ];

  const handleLogoutClick = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f4] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
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
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm text-[#5a524b]">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPath(item.href);
                    }}
                    className={`transition-colors py-1 ${
                      isActive
                        ? "text-[#3a3735] font-semibold border-b-2 border-black"
                        : "hover:text-black/70"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
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
                  placeholder="Search for items..."
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
                Logout
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
                          Hello, {user?.fullName.split(" ")[0]}
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
                          Profile Settings
                        </Link>
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors flex items-center gap-3"
                          onClick={handleLogoutClick}
                        >
                          Logout
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
