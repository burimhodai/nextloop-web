"use client";
import { Clock, Users, Gavel, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IListing } from "@/lib/types/listing.types";
import { fetchLatestAuctions } from "@/services/listings";

function CountdownTimer({ endTime }: { endTime?: Date | string }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  if (timeLeft === 0) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <Clock className="w-4 h-4" strokeWidth={1.5} />
        <span className="text-sm tracking-wider">Beendet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-[#c8a882]">
      <Clock className="w-4 h-4" strokeWidth={1.5} />
      <span className="text-sm tracking-wider">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

export function LiveAuctions() {
  const [auctions, setAuctions] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchLatestAuctions(3);
      setAuctions(data.data || []);
    } catch (err) {
      console.error("Error fetching live auctions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load live auctions"
      );
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = (listing: IListing) => {
    return (
      listing.images?.find((img) => img.type === "MAIN")?.url ||
      listing.images?.[0]?.url ||
      "/placeholder.jpg"
    );
  };

  const getCurrentPrice = (listing: IListing) => {
    return listing.currentPrice || listing.startingPrice || 0;
  };

  const isAuctionEnded = (endTime?: Date | string) => {
    if (!endTime) return false;
    return new Date(endTime).getTime() <= Date.now();
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#f5f1ea]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-[#c8a882] animate-spin mb-4" />
            <p className="text-[#5a524b] font-serif italic">
              Live-Auktionen laden…
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-[#f5f1ea]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r">
            <p className="text-red-700 font-serif mb-2">{error}</p>
            <button
              onClick={fetchAuctions}
              className="text-red-700 text-sm underline hover:no-underline"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (auctions.length === 0) {
    return null; // Don't show section if no live auctions
  }

  return (
    <section className="py-24 bg-[#f5f1ea]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#c8a882]"></div>
            <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c8a882] rounded-full animate-pulse"></span>
              Jetzt Live
            </span>
            <div className="h-px w-12 bg-[#c8a882]"></div>
          </div>
          <h2
            className="text-[#3a3735] text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Laufende Gebote
          </h2>
          <p className="text-[#5a524b] max-w-2xl mx-auto">
            Erlebe Live-Auktionen und tritt im Wettbewerb mit Sammlern weltweit um außergewöhnliche Stücke an.
          </p>
        </div>

        {/* Live Auction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <Link
              href={`/auction/${auction._id}`}
              key={auction._id}
              className="group bg-white shadow-md hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e8dfd0]">
                <Image
                  fill
                  src={getMainImage(auction)}
                  alt={auction.name || "Live auction"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3a3735]/60 via-transparent to-transparent"></div>
                {!isAuctionEnded(auction.endTime) && (
                  <div className="absolute top-4 right-4 bg-[#c8a882] text-[#3a3735] px-3 py-1 text-xs tracking-wider flex items-center gap-1">
                    <Gavel className="w-3 h-3" strokeWidth={2} />
                    live
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                <h3
                  className="text-[#3a3735] mb-4 line-clamp-2 group-hover:text-[#c8a882] transition-colors"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "1.25rem",
                  }}
                >
                  {auction.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5a524b]">
                      {auction.currentPrice ? "Aktuelles Gebot" : "Startgebot"}
                    </span>
                    <span className="text-[#c8a882] font-medium">
                      ${getCurrentPrice(auction).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#5a524b] flex items-center gap-2">
                      <Users className="w-4 h-4" strokeWidth={1.5} />
                      {auction.totalBids || 0} Bieter
                    </span>
                    <CountdownTimer endTime={auction.endTime} />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/auction/${auction._id}`;
                  }}
                  className="w-full bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] py-3 text-center tracking-wide transition-colors"
                >
                  Jetzt bieten
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/search?type=AUCTION"
            className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border-b border-[#3a3735] hover:border-[#c8a882] pb-1 transition-colors"
          >
            Jetzt alle Live-Auktionen entdecken
          </Link>
        </div>
      </div>
    </section>
  );
}
