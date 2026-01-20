// app/(dashboard)/dashboard/watchlist/page.tsx
"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";
import { getWatchlist, toggleWatchlist } from "@/services/listings";
import { Heart, Loader2, Package } from "lucide-react";
import { ListingCard } from "@/components/search/listing-card";

export default function WatchlistPage() {
  const { user, token } = useAuthStore();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id && token) {
      fetchWatchlist();
    }
  }, [user, token]);

  const fetchWatchlist = async () => {
    if (!user?._id || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const watchlistData = await getWatchlist(user._id, token);
      setListings(watchlistData);
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setError("Failed to load watchlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchlistChange = async (
    listingId: string,
    isInWatchlist: boolean,
  ) => {
    // Optimistically update UI
    if (!isInWatchlist) {
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId),
      );
    }
  };

  const handleRemoveAll = async () => {
    if (!user?._id || !token) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your watchlist?",
    );

    if (!confirmed) return;

    try {
      // Remove all items
      for (const listing of listings) {
        await toggleWatchlist(listing._id, user._id, token);
      }
      setListings([]);
    } catch (err) {
      console.error("Error removing all items:", err);
      setError("Failed to clear watchlist. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a3735] mb-2">Merkliste</h1>
          <p className="text-[#5a524b]">
            Ihre gespeicherten Elemente werden geladen...
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#c8a882] animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a3735] mb-2">Merkliste</h1>
          <p className="text-[#5a524b]">Ihre gespeicherten Elemente</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={fetchWatchlist}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart
                className="w-5 h-5 text-red-600 fill-current"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3a3735]">Merkliste</h1>
              <p className="text-[#5a524b]">
                {listings.length}{" "}
                {listings.length === 1 ? "Artikel" : "Artikel"} gespeichert
              </p>
            </div>
          </div>

          {listings.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
            >
              Alles löschen
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {listings.length === 0 ? (
        <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#f5f1ea] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-[#d4cec4]" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-[#3a3735] mb-3">
              Ihre Watchlist ist leer
            </h2>
            <p className="text-[#5a524b] mb-6">
              Fügen Sie Artikel zu Ihrer Merkliste hinzu, um Angebote im Blick
              zu behalten, die Sie interessieren.
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3a3735] text-[#c8a882] rounded-lg hover:bg-[#c8a882] hover:text-[#3a3735] transition-all font-medium"
            >
              <Package className="w-5 h-5" strokeWidth={1.5} />
              Angebote durchsuchen
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5a524b]">
                  Gesamtanzahl Artikel
                </span>
                <span className="text-2xl font-bold text-[#3a3735]">
                  {listings.length}
                </span>
              </div>
            </div>

            <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5a524b]">Auktionen</span>
                <span className="text-2xl font-bold text-[#3a3735]">
                  {listings.filter((l) => l.type === "AUCTION").length}
                </span>
              </div>
            </div>

            <div className="bg-[#faf8f4] border border-[#d4cec4] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5a524b]">Jetzt kaufen</span>
                <span className="text-2xl font-bold text-[#3a3735]">
                  {listings.filter((l) => l.type === "BUY_NOW").length}
                </span>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                isInWatchlist={true}
                onWatchlistChange={handleWatchlistChange}
              />
            ))}
          </div>
        </>
      )}

      {/* Tips Section */}
      {listings.length > 0 && (
        <div className="mt-8 bg-[#f5f1ea] border border-[#d4cec4] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#3a3735] mb-3">
            Watchlist-Tipps
          </h3>
          <ul className="space-y-2 text-sm text-[#5a524b]">
            <li className="flex items-start gap-2">
              <span className="text-[#c8a882] mt-0.5">•</span>
              <span>
                Sie erhalten Benachrichtigungen, wenn sich die Preise von
                Artikeln auf Ihrer Beobachtungsliste ändern.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c8a882] mt-0.5">•</span>
              <span>
                Bei Auktionen benachrichtigen wir Sie, wenn das Bieten bald
                endet.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c8a882] mt-0.5">•</span>
              <span>
                Klicken Sie auf das Herzsymbol bei einem beliebigen Eintrag, um
                ihn Ihrer Beobachtungsliste hinzuzufügen.
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
