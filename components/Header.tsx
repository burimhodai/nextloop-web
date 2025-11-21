"use client";
import { Search, User, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the hero categories section is out of view
      const categoriesElement = document.getElementById('hero-categories');
      if (categoriesElement) {
        const rect = categoriesElement.getBoundingClientRect();
        const isOutOfView = rect.bottom < 0;
        setShowSearch(isOutOfView);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f4] border-b border-[#e8dfd0] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onMenuClick}
              className="text-[#3a3735] hover:text-[#c8a882] transition-colors"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3a3735] flex items-center justify-center">
                <span className="text-[#c8a882]" style={{ fontFamily: 'Playfair Display, serif' }}>N</span>
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#3a3735] tracking-tight">
                NextLoop
              </span>
            </div>
          </div>

          {/* Center: Scrolled Search Bar */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a524b]" strokeWidth={1.5} />
                <input 
                  type="text"
                  placeholder="Search for items..."
                  className="w-full pl-10 pr-3 py-2.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm placeholder:text-[#5a524b]/60 focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all"
                />
              </div>
              <div className="relative w-44">
                <select className="w-full px-3 py-2.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all appearance-none cursor-pointer">
                  <option>All Categories</option>
                  <option>Watches</option>
                  <option>Art</option>
                  <option>Electronics</option>
                  <option>Jewelry</option>
                  <option>Furniture</option>
                  <option>Wine</option>
                  <option>Collectibles</option>
                  <option>Instruments</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#5a524b] pointer-events-none" strokeWidth={1.5} />
              </div>
              <button className="bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-6 py-2.5 transition-colors">
                <Search className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            <button className="text-[#3a3735] hover:text-[#c8a882] transition-colors">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <div className="relative user-menu-container">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-[#3a3735] hover:text-[#c8a882] transition-colors"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-[#faf8f4] border border-[#e8dfd0] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <Link 
                      href="/login"
                      className="block px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup"
                      className="block px-4 py-2.5 text-sm text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}