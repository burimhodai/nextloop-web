"use client";
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#f5f1ea] border-t border-[#d4cec4]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#3a3735] flex items-center justify-center">
                <span className="text-[#c8a882]" style={{ fontFamily: 'Playfair Display, serif' }}>N</span>
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#3a3735] tracking-tight">
                NextLoop
              </span>
            </div>
            <p className="text-[#5a524b] text-sm leading-relaxed mb-6">
              Curating exceptional auctions for discerning collectors worldwide since 1999.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#5a524b] text-sm">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                <span>+41 22 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-[#5a524b] text-sm">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span>contact@lumiere.ch</span>
              </div>
              <div className="flex items-center gap-3 text-[#5a524b] text-sm">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                <span>Geneva, Switzerland</span>
              </div>
            </div>
          </div>

          {/* Auctions */}
          <div>
            <h6 
              className="text-[#3a3735] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Auctions
            </h6>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Current Auctions
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Upcoming Events
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Past Results
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Private Sales
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h6 
              className="text-[#3a3735] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              About
            </h6>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Specialists
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h6 
              className="text-[#3a3735] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Resources
            </h6>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Buyer's Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Seller's Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Authentication
                </a>
              </li>
              <li>
                <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#d4cec4] mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#5a524b] text-sm">
            © 2025 NextLoop Auction House. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-[#5a524b] hover:text-[#c8a882] text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}