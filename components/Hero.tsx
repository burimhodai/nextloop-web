"use client";
import { Search, ChevronDown, Watch, Palette, Laptop, Gem, Armchair, Wine, Camera, Music, Heart, Clock } from 'lucide-react';
import Image from 'next/image';

const quickCategories = [
  { name: "Watches", icon: <Watch className="w-5 h-5" strokeWidth={1.5} /> },
  { name: "Art", icon: <Palette className="w-5 h-5" strokeWidth={1.5} /> },
  { name: "Electronics", icon: <Laptop className="w-5 h-5" strokeWidth={1.5} /> },
  { name: "Jewelry", icon: <Gem className="w-5 h-5" strokeWidth={1.5} /> },
  { name: "Furniture", icon: <Armchair className="w-5 h-5" strokeWidth={1.5} /> },
  { name: "Wine", icon: <Wine className="w-5 h-5" strokeWidth={1.5} /> },
  { name: "Collectibles", icon: <Camera className="w-5 h-5" strokeWidth={1.5} /> },
  { name: "Instruments", icon: <Music className="w-5 h-5" strokeWidth={1.5} /> }
];

const featuredListings = [
  {
    id: 1,
    title: "Patek Philippe Nautilus",
    currentBid: 145000,
    timeLeft: "2 days",
    image: "https://images.unsplash.com/photo-1554151447-b9d2197448f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYzMDM0MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    title: "Diamond Rivière Necklace",
    currentBid: 320000,
    timeLeft: "5 hours",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwZGlhbW9uZHxlbnwxfHx8fDE3NjMwNDM5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    title: "Vintage Ferrari 250 GTO",
    currentBid: 4500000,
    timeLeft: "1 day",
    image: "https://images.unsplash.com/photo-1628832908835-814f799db7c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwY2FyfGVufDF8fHx8MTc2MzEyMjc0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    title: "Eames Lounge Chair 1956",
    currentBid: 18500,
    timeLeft: "3 days",
    image: "https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmdXJuaXR1cmUlMjBjaGFpcnxlbnwxfHx8fDE3NjMxMjI3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 5,
    title: "Post-Impressionist Art",
    currentBid: 780000,
    timeLeft: "12 hours",
    image: "https://images.unsplash.com/photo-1637578035851-c5b169722de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzYzMDI5MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 6,
    title: "Château Margaux 1900",
    currentBid: 52000,
    timeLeft: "18 hours",
    image: "https://images.unsplash.com/photo-1734490037300-6ff9ffd4ed13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd2luZSUyMGNlbGxhcnxlbnwxfHx8fDE3NjMxMjI3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#faf8f4] to-[#f5f1ea] py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Content */}
        <div className="text-center mb-12">
          <h1 
            className="text-[#3a3735] mb-6 leading-[1.1]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Find Extraordinary Items
          </h1>
          
          <p className="text-[#5a524b] leading-relaxed max-w-2xl mx-auto mb-10">
            Browse thousands of luxury auctions from verified sellers worldwide. 
            Discover rare timepieces, fine art, collectibles, and more.
          </p>

          {/* Advanced Search Box */}
          <div className="bg-white p-6 shadow-lg w-full max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a524b]" strokeWidth={1.5} />
                <input 
                  type="text"
                  placeholder="Search for items, brands, or keywords..."
                  className="w-full pl-12 pr-4 py-3.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] placeholder:text-[#5a524b]/60 focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="relative w-full md:w-56">
                <select className="w-full px-4 py-3.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all appearance-none cursor-pointer">
                  <option>All Categories</option>
                  <option>Watches & Timepieces</option>
                  <option>Fine Art</option>
                  <option>Electronics</option>
                  <option>Jewelry & Gems</option>
                  <option>Furniture & Design</option>
                  <option>Wine & Spirits</option>
                  <option>Collectibles</option>
                  <option>Instruments</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a524b] pointer-events-none" strokeWidth={1.5} />
              </div>

              {/* Search Button */}
              <button className="group bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-8 py-3.5 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                <Search className="w-4 h-4" strokeWidth={1.5} />
                <span className="tracking-wide">Search</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-[#5a524b]">
              <span>Popular:</span>
              <button className="hover:text-[#c8a882] transition-colors">Rolex</button>
              <button className="hover:text-[#c8a882] transition-colors">Vintage Art</button>
              <button className="hover:text-[#c8a882] transition-colors">Ferrari</button>
              <button className="hover:text-[#c8a882] transition-colors">Hermès</button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="w-full max-w-4xl mx-auto mb-16" id="hero-categories">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#c8a882]/50"></div>
              <span className="text-[#c8a882] text-xs tracking-[0.2em] uppercase">
                Browse Categories
              </span>
              <div className="h-px w-8 bg-[#c8a882]/50"></div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {quickCategories.map((category, index) => (
                <button 
                  key={index}
                  className="group bg-white hover:bg-[#c8a882] p-4 flex flex-col items-center gap-2 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="text-[#3a3735] group-hover:text-white transition-colors">
                    {category.icon}
                  </div>
                  <span className="text-[#3a3735] group-hover:text-white text-xs transition-colors">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Listings Preview */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h3 
              className="text-[#3a3735]"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem' }}
            >
              Featured Auctions
            </h3>
            <button className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border-b border-[#3a3735] hover:border-[#c8a882] pb-1 transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredListings.map((listing) => (
              <div 
                key={listing.id}
                className="group bg-white hover:bg-[#f5f1ea] cursor-pointer transition-all shadow-sm hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-[#e8dfd0]">
                  <Image
                    width={300}
                    height={300}
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors">
                    <Heart className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="p-3">
                  <h4 
                    className="text-[#3a3735] mb-2 text-sm line-clamp-2 group-hover:text-[#c8a882] transition-colors"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {listing.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#c8a882]">
                      ${listing.currentBid.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1 text-[#5a524b]">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      <span>{listing.timeLeft}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}