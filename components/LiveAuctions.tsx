"use client";
import { Clock, Users, Gavel } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LiveAuction {
  id: number;
  title: string;
  currentBid: number;
  bidders: number;
  image: string;
  endsIn: number; // seconds
}

const liveAuctions: LiveAuction[] = [
  {
    id: 1,
    title: "Château Margaux 1900",
    currentBid: 52000,
    bidders: 14,
    image: "https://images.unsplash.com/photo-1734490037300-6ff9ffd4ed13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd2luZSUyMGNlbGxhcnxlbnwxfHx8fDE3NjMxMjI3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    endsIn: 3542
  },
  {
    id: 2,
    title: "18th Century Pocket Watch",
    currentBid: 38500,
    bidders: 8,
    image: "https://images.unsplash.com/photo-1554151447-b9d2197448f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNjMwMzQzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    endsIn: 1822
  },
  {
    id: 3,
    title: "Handcrafted Leather Set",
    currentBid: 4200,
    bidders: 5,
    image: "https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoZXJpdGFnZSUyMGNyYWZ0c21hbnNoaXB8ZW58MXx8fHwxNzYzMTIyNzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    endsIn: 7234
  }
];

function CountdownTimer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 text-[#c8a882]">
      <Clock className="w-4 h-4" strokeWidth={1.5} />
      <span className="text-sm tracking-wider">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}

export function LiveAuctions() {
  return (
    <section className="py-24 bg-[#f5f1ea]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#c8a882]"></div>
            <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c8a882] rounded-full animate-pulse"></span>
              Live Now
            </span>
            <div className="h-px w-12 bg-[#c8a882]"></div>
          </div>
          <h2 
            className="text-[#3a3735] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Active Bidding
          </h2>
          <p className="text-[#5a524b] max-w-2xl mx-auto">
            Join live auctions and compete with collectors worldwide for exceptional pieces
          </p>
        </div>

        {/* Live Auction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {liveAuctions.map((auction) => (
            <div 
              key={auction.id}
              className="group bg-white shadow-md hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e8dfd0]">
                <Image
                fill
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a3735]/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 bg-[#c8a882] text-[#3a3735] px-3 py-1 text-xs tracking-wider flex items-center gap-1">
                  <Gavel className="w-3 h-3" strokeWidth={2} />
                  LIVE
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 
                  className="text-[#3a3735] mb-4"
                  style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem' }}
                >
                  {auction.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5a524b]">Current Bid</span>
                    <span className="text-[#c8a882]">
                      ${auction.currentBid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5a524b] flex items-center gap-2">
                      <Users className="w-4 h-4" strokeWidth={1.5} />
                      {auction.bidders} bidders
                    </span>
                    <CountdownTimer seconds={auction.endsIn} />
                  </div>
                </div>

                <button className="w-full bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] py-3 text-center tracking-wide transition-colors">
                  Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border-b border-[#3a3735] hover:border-[#c8a882] pb-1">
            View All Live Auctions
          </button>
        </div>
      </div>
    </section>
  );
}