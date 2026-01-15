"use client";
import { X, Gavel, Grid, Zap, Heart, Settings, User, FileText, Eye, List } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#3a3735]/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-[#faf8f4] shadow-2xl z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#d4cec4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3a3735] flex items-center justify-center">
                <span className="text-[#c8a882]" style={{ fontFamily: 'Playfair Display, serif' }}>N</span>
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#3a3735] tracking-tight">
                NextLoop
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-[#3a3735] hover:text-[#c8a882] transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-8 py-8">
            <div className="space-y-8">
              {/* Main Navigation */}
              <div>
                <h6
                  className="text-[#c8a882] mb-4 text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Durchsuchen
                </h6>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Gavel className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Auktionen</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Grid className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Kategorien</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Zap className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Live bieten</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Zap className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Hervorgehoben</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Heart className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Gespeicherte Artikel</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Settings className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Einstellungen</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Account Section */}
              <div>
                <h6
                  className="text-[#c8a882] mb-4 text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Konto
                </h6>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <User className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Profil</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Gavel className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Meine Gebote</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <List className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Meine Inserate</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#3a3735] hover:bg-[#f5f1ea] hover:text-[#c8a882] transition-colors">
                      <Eye className="w-5 h-5" strokeWidth={1.5} />
                      <span className="tracking-wide">Merkliste</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-[#d4cec4]">
            <p className="text-[#5a524b] text-xs">
              © 2025 NextLoop
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
