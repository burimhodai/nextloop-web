"use client";
import { Heart, Star, Clock } from 'lucide-react';
import Image from 'next/image';

interface PromotedItem {
  id: number;
  title: string;
  description: string;
  currentBid: number;
  image: string;
  seller: string;
  timeLeft: string;
}

const mainPromoted: PromotedItem = {
  id: 1,
  title: "Patek Philippe Nautilus 5711/1A - Rare Final Edition",
  description: "The most sought-after luxury sports watch. Final edition in stainless steel with blue dial. Complete set with box and papers, purchased from authorized dealer in 2021. Pristine condition, worn only a handful of times.",
  currentBid: 185000,
  image: "https://images.unsplash.com/photo-1554151447-b9d2197448f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYzMDM0MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  seller: "Premier Timepieces",
  timeLeft: "2 days"
};

const smallerPromoted: PromotedItem[] = [
  {
    id: 2,
    title: "Cartier Love Bracelet - 18K Gold",
    description: "Classic yellow gold bracelet with original screwdriver and certificate.",
    currentBid: 8500,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwZGlhbW9uZHxlbnwxfHx8fDE3NjMwNDM5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    seller: "LuxeJewels",
    timeLeft: "5 hours"
  },
  {
    id: 3,
    title: "1962 Ferrari 250 GTO",
    description: "One of only 36 ever made. Documented racing history.",
    currentBid: 4500000,
    image: "https://images.unsplash.com/photo-1628832908835-814f799db7c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwY2FyfGVufDF8fHx8MTc2MzEyMjc0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    seller: "Heritage Motors",
    timeLeft: "1 day"
  },
  {
    id: 4,
    title: "Eames Lounge Chair - Original 1956",
    description: "Authentic Herman Miller production with rosewood and black leather.",
    currentBid: 18500,
    image: "https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmdXJuaXR1cmUlMjBjaGFpcnxlbnwxfHx8fDE3NjMxMjI3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    seller: "Vintage Modern",
    timeLeft: "12 hours"
  },
  {
    id: 5,
    title: "Château Margaux 1900 - Pristine",
    description: "Exceptional vintage with perfect provenance and storage history.",
    currentBid: 52000,
    image: "https://images.unsplash.com/photo-1734490037300-6ff9ffd4ed13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd2luZSUyMGNlbGxhcnxlbnwxfHx8fDE3NjMxMjI3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    seller: "Rare Cellars",
    timeLeft: "3 days"
  }
];

export function PromotedListings() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#faf8f4] to-[#f5f1ea]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <Star className="w-5 h-5 text-[#c8a882]" strokeWidth={1.5} fill="#c8a882" />
            <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
              Featured Spotlight
            </span>
          </div>
          <h2 
            className="text-[#3a3735]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Promoted Listings
          </h2>
        </div>

        {/* Main #1 Promoted Item */}
        <div className="mb-12 bg-white shadow-2xl overflow-hidden group cursor-pointer hover:shadow-3xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-[#e8dfd0]">
              <Image
                src={mainPromoted.image}
                alt={mainPromoted.title}
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 bg-[#c8a882] text-[#3a3735] px-6 py-3 flex items-center gap-2 shadow-lg">
                <Star className="w-4 h-4" strokeWidth={2} fill="#3a3735" />
                <span className="tracking-wider">#1 PROMOTED</span>
              </div>
              <button className="absolute top-6 right-6 w-12 h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors">
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="p-12 flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-12 bg-[#c8a882]"></div>
                  <span className="text-[#5a524b] text-sm">by {mainPromoted.seller}</span>
                </div>
                <h3 
                  className="text-[#3a3735] mb-4 group-hover:text-[#c8a882] transition-colors"
                  style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
                >
                  {mainPromoted.title}
                </h3>
                <p className="text-[#5a524b] leading-relaxed">
                  {mainPromoted.description}
                </p>
              </div>

              <div className="mb-8 pt-6 border-t border-[#d4cec4]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#c8a882] text-xs tracking-wider uppercase mb-2">
                      Current Bid
                    </p>
                    <p 
                      className="text-[#3a3735]"
                      style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem' }}
                    >
                      ${mainPromoted.currentBid.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[#5a524b]">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-sm">{mainPromoted.timeLeft} left</span>
                  </div>
                </div>

                <button className="w-full bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] py-4 text-center tracking-wide transition-colors shadow-lg">
                  Place Your Bid
                </button>
              </div>

              <p className="text-[#5a524b] text-xs">
                Free worldwide shipping · Authenticity guaranteed · 14-day return policy
              </p>
            </div>
          </div>
        </div>

        {/* Smaller Promoted Items */}
        <div>
          <h3 
            className="text-[#3a3735] mb-8"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}
          >
            More Promoted Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {smallerPromoted.map((item) => (
              <div 
                key={item.id}
                className="group bg-white shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e8dfd0]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#c8a882] text-[#3a3735] px-2 py-1 text-xs tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" strokeWidth={2} fill="#3a3735" />
                    PROMOTED
                  </div>
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors">
                    <Heart className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h4 
                    className="text-[#3a3735] mb-2 group-hover:text-[#c8a882] transition-colors line-clamp-2"
                    style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem' }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[#5a524b] text-xs mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-[#d4cec4]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[#c8a882] text-xs uppercase mb-1">
                          Current Bid
                        </p>
                        <p className="text-[#3a3735] text-sm">
                          ${item.currentBid.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[#5a524b]">
                        <Clock className="w-3 h-3" strokeWidth={1.5} />
                        <span className="text-xs">{item.timeLeft}</span>
                      </div>
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