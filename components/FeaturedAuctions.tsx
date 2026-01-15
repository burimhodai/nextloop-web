"use client";
import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchBoostedListings } from "@/services/listings";
import { IListing } from "@/lib/types/listing.types";

export function FeaturedAuctions() {
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

      // Fetch boosted auctions from HOMEPAGE boost type, filtered by AUCTION type
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search/listings/boosted/HOMEPAGE?type=AUCTION`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch auctions");
      }

      // Take only first 6 auctions for featured section
      setAuctions(data.data?.slice(0, 6) || []);
    } catch (err) {
      console.error("Error fetching featured auctions:", err);
      setError(err instanceof Error ? err.message : "Failed to load auctions");
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

  const formatPrice = (listing: IListing) => {
    return listing.currentPrice || listing.startingPrice || 0;
  };

  const getSellerName = (listing: IListing) => {
    if (typeof listing.seller === "object" && listing.seller?.username) {
      return listing.seller.username;
    }
    return "Verkäufer";
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#faf8f4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-[#c8a882] animate-spin mb-4" />
            <p className="text-[#5a524b] font-serif italic">
              Empfohlene Auktionen werden geladen …
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-[#faf8f4]">
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
    return null; // Don't show section if no auctions
  }

  return (
    <section className="py-24 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16 flex items-end justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12 bg-[#c8a882]"></div>
              <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
                Aktuelle Angebote
              </span>
            </div>
            <h2
              className="text-[#3a3735] text-4xl md:text-5xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Empfohlene Auktionen
            </h2>
          </div>
          <Link
            href="/search?type=AUCTION"
            className="hidden md:block text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border-b border-[#3a3735] hover:border-[#c8a882] pb-1 transition-colors"
          >
            Alle Lose ansehen
          </Link>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction, index) => (
            <Link
              href={`/auction/${auction._id}`}
              key={auction._id}
              className="group bg-[#f5f1ea] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e8dfd0]">
                <Image
                  src={getMainImage(auction)}
                  alt={auction.name || "Auction item"}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Add to watchlist functionality
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#c8a882] hover:text-white transition-colors z-10"
                >
                  <Heart className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-4 left-4 bg-[#3a3735] text-[#faf8f4] px-4 py-2 text-sm tracking-wider">
                  Los {String(index + 1).padStart(3, "0")}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="mb-3">
                  <h3
                    className="text-[#3a3735] mb-1 group-hover:text-[#c8a882] transition-colors line-clamp-2"
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: "1.25rem",
                    }}
                  >
                    {auction.name}
                  </h3>
                  <p className="text-[#5a524b] text-sm">
                    {getSellerName(auction)}
                    {auction.createdAt &&
                      ` · ${new Date(auction.createdAt).getFullYear()}`}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#d4cec4]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#c8a882] text-xs tracking-wider uppercase mb-1">
                        {auction.currentPrice ? "Aktuelles Gebot" : "Startgebot"}
                      </p>
                      <p
                        className="text-[#3a3735] font-medium"
                        style={{ fontSize: "1.125rem" }}
                      >
                        ${formatPrice(auction).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/auction/${auction._id}`;
                      }}
                      className="text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border border-[#3a3735] hover:border-[#c8a882] px-5 py-2.5 transition-colors"
                    >
                      Jetzt bieten
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button - Mobile */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/search?type=AUCTION"
            className="inline-block text-[#3a3735] hover:text-[#c8a882] text-sm tracking-wide border-b border-[#3a3735] hover:border-[#c8a882] pb-1 transition-colors"
          >
            Alle Lose ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
