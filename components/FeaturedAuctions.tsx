"use client";
import { Heart } from 'lucide-react';
import Image from 'next/image';

interface Auction {
  id: number;
  title: string;
  artist: string;
  year: string;
  currentBid: number;
  image: string;
  lot: string;
}

const auctions: Auction[] = [
  {
    id: 1,
    title: "Patek Philippe Nautilus",
    artist: "Patek Philippe",
    year: "2019",
    currentBid: 145000,
    image: "https://images.unsplash.com/photo-1554151447-b9d2197448f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzYzMDM0MzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lot: "001"
  },
  {
    id: 2,
    title: "Diamond Rivière Necklace",
    artist: "Cartier",
    year: "1925",
    currentBid: 320000,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwZGlhbW9uZHxlbnwxfHx8fDE3NjMwNDM5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lot: "002"
  },
  {
    id: 3,
    title: "Post-Impressionist Landscape",
    artist: "European Master",
    year: "1892",
    currentBid: 780000,
    image: "https://images.unsplash.com/photo-1637578035851-c5b169722de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzYzMDI5MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lot: "003"
  },
  {
    id: 4,
    title: "1962 Ferrari 250 GTO",
    artist: "Ferrari",
    year: "1962",
    currentBid: 4500000,
    image: "https://images.unsplash.com/photo-1628832908835-814f799db7c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbHV4dXJ5JTIwY2FyfGVufDF8fHx8MTc2MzEyMjc0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lot: "004"
  },
  {
    id: 5,
    title: "Mid-Century Lounge Chair",
    artist: "Eames",
    year: "1956",
    currentBid: 18500,
    image: "https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmdXJuaXR1cmUlMjBjaGFpcnxlbnwxfHx8fDE3NjMxMjI3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lot: "005"
  },
  {
    id: 6,
    title: "Hellenistic Marble Torso",
    artist: "Ancient Greece",
    year: "200 BCE",
    currentBid: 425000,
    image: "https://images.unsplash.com/photo-1628508438706-6e6a19853e1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwc2N1bHB0dXJlJTIwbWFyYmxlfGVufDF8fHx8MTc2MzEyMjc0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lot: "006"
  }
];

export function FeaturedAuctions() {
  return (
    <section className="py-24 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 flex items-end justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12 bg-[#c8a882]"></div>
              <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
                Current Offerings
              </span>
            </div>
            <h2 
              className="text-[#3a3735]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Featured Auctions
            </h2>
          </div>
          <button className="hidden md:block text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border-b border-[#3a3735] hover:border-[#c8a882] pb-1">
            View All Lots
          </button>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <div 
              key={auction.id}
              className="group bg-[#f5f1ea] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e8dfd0]">
                <Image
                  src={auction.image}
                  alt={auction.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors">
                  <Heart className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-4 left-4 bg-[#3a3735] text-[#faf8f4] px-4 py-2 text-sm tracking-wider">
                  LOT {auction.lot}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 
                    className="text-[#3a3735] mb-1 group-hover:text-[#c8a882] transition-colors"
                    style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem' }}
                  >
                    {auction.title}
                  </h3>
                  <p className="text-[#5a524b] text-sm">
                    {auction.artist} · {auction.year}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#d4cec4]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#c8a882] text-xs tracking-wider uppercase mb-1">
                        Current Bid
                      </p>
                      <p className="text-[#3a3735]">
                        ${auction.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <button className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border border-[#3a3735] hover:border-[#c8a882] px-5 py-2.5 transition-colors">
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}