"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  Check,
  Zap,
  TrendingUp,
  Award,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IListing } from "@/lib/types/listing.types";
import { BoostTypes } from "@/lib/types/boost.types";

// --- 1. Constants ---
const BASE_BOOST_DURATION_DAYS = 7;
const MIN_DAYS = 3;
const MAX_DAYS = 30;

// --- 2. Boost Plan Interface ---
interface BoostPlan {
  id: BoostTypes;
  title: string;
  dailyRate: number;
  description: string;
  features: string[];
  recommended?: boolean;
  icon: React.ElementType;
}

export default function BoostListingPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token } = useAuthStore();
  const listingId = params.id as string;

  const [listing, setListing] = useState<IListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fetchedBoostCosts, setFetchedBoostCosts] = useState<
    { [key in BoostTypes]?: number } | null
  >(null);

  const [selectedPlanId, setSelectedPlanId] = useState<BoostTypes>(
    BoostTypes.SEARCH_PRIORITY,
  );
  const [selectedDurationDays, setSelectedDurationDays] = useState<number>(
    BASE_BOOST_DURATION_DAYS,
  );

  // --- Dynamic Boost Plans Generation ---
  const BOOST_PLANS: BoostPlan[] = useMemo(() => {
    if (!fetchedBoostCosts) return [];

    const getDailyRate = (type: BoostTypes) => fetchedBoostCosts[type] || 0;
    const getBasePrice = (type: BoostTypes) =>
      (fetchedBoostCosts[type] || 0).toFixed(2);

    return [
      {
        id: BoostTypes.FEATURED,
        title: "Hervorgehobener Eintrag",
        dailyRate: getDailyRate(BoostTypes.FEATURED),
        description:
          "Eine kostengünstige Möglichkeit, etwas mehr Aufmerksamkeit zu erlangen.",
        icon: ShieldCheck,
        features: [
          "Standardsichtbarkeit",
          `Tagespreis: CHF ${getBasePrice(BoostTypes.FEATURED)}`,
          "Grundlegende Unterstützung",
          "Einmalige Aktualisierung des Eintrags",
        ],
      },
      {
        id: BoostTypes.CATEGORY_TOP,
        title: "Kategorie-Upgrade",
        dailyRate: getDailyRate(BoostTypes.CATEGORY_TOP),
        description:
          "Werden Sie von Personen wahrgenommen, die gezielt in dieser Kategorie suchen.",
        icon: TrendingUp,
        features: [
          "Top-Suche der Kategorie",
          `Tagespreis: CHF ${getBasePrice(BoostTypes.CATEGORY_TOP)}`,
          "Standardunterstützung",
          "Grundlegende Analysen",
        ],
      },
      {
        id: BoostTypes.SEARCH_PRIORITY,
        title: "Spotlight-Suche",
        dailyRate: getDailyRate(BoostTypes.SEARCH_PRIORITY),
        description:
          "Erscheinen Sie in Suchergebnissen vor Standard-Einträgen.",
        recommended: true,
        icon: Zap,
        features: [
          "Prioritätssuche",
          `Tagespreis: CHF ${getBasePrice(BoostTypes.SEARCH_PRIORITY)}`,
          "Hervorgehobenes Abzeichen",
          "2x Sichtpotenzial",
          "Detaillierte Analysen",
        ],
      },
      {
        id: BoostTypes.HOMEPAGE,
        title: "Homepage Hero",
        dailyRate: getDailyRate(BoostTypes.HOMEPAGE),
        description:
          "Maximale Präsenz auf der Startseite und auf der gesamten Plattform.",
        icon: Award,
        features: [
          "Auf der Startseite",
          "Top-Suche der Kategorie",
          `Tagespreis: CHF ${getBasePrice(BoostTypes.HOMEPAGE)}`,
          "Goldener Rand-Styling",
          "Premium Support",
        ],
      },
    ];
  }, [fetchedBoostCosts]);

  // --- Dynamic Price Calculation ---
  const selectedPlan = useMemo(
    () => BOOST_PLANS.find((p) => p.id === selectedPlanId),
    [selectedPlanId, BOOST_PLANS],
  );

  const calculateTotalPrice = useCallback(
    (duration: number): string => {
      if (!selectedPlan) return "0.00";
      const total = selectedPlan.dailyRate * duration;
      return total.toFixed(2);
    },
    [selectedPlan],
  );

  const currentTotalPrice = calculateTotalPrice(selectedDurationDays);

  // --- Fetching Logic ---
  useEffect(() => {
    // Don't fetch if user is not loaded yet
    if (!user || !token || !listingId) {
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchPricing = async (retries = 3, delay = 1000) => {
      const endpoint = `${API_URL}/boost/pricing/get`;

      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error("Failed to fetch pricing");

          const result = await response.json();
          if (result.data) {
            setFetchedBoostCosts(result.data);
            return;
          } else {
            throw new Error("Invalid pricing data format");
          }
        } catch (e) {
          if (i === retries - 1) {
            throw e;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, delay * Math.pow(2, i)),
          );
        }
      }
    };

    const fetchListing = async () => {
      const response = await fetch(`${API_URL}/listing/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Listing not found");

      const data: IListing = await response.json();

      // Owner Check
      const sellerId =
        typeof data.seller === "object" ? data.seller?._id : data.seller;
      const userId = user._id;

      if (String(sellerId) !== String(userId)) {
        throw new Error("You do not have permission to boost this listing.");
      }

      setListing(data);
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([fetchListing(), fetchPricing()]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load all data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [listingId, token, user]);

  // --- Stripe Checkout Logic ---
  const handleCheckout = async () => {
    if (!listing || !selectedPlan || !user) {
      setError("User or listing information is missing.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const payload = {
        listingId: listingId,
        boostType: selectedPlan.id,
        duration: selectedDurationDays,
        userId: user._id,
      };

      const response = await fetch(
        `${API_URL}/payment/create-boost-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Payment initiation failed");
      }

      if (result.data && result.data.url) {
        window.location.href = result.data.url;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Loading State ---
  if (isLoading || !fetchedBoostCosts) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#c8a882] animate-spin mb-4" />
        <p className="text-[#3a3735] font-serif">Lade Boost-Optionen...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-[#3a3735] mb-2">
            Zugriff verweigert
          </h2>
          <p className="text-[#5a524b] mb-6">
            {error || "Listing not found or failed to load data."}
          </p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // --- Main Page ---
  return (
    <div className="min-h-screen bg-[#faf8f4] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-[#d4cec4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-xs uppercase tracking-widest text-[#5a524b] hover:text-[#c8a882] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Abbrechen und zurück
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif text-[#3a3735]">
                Heben Sie Ihren Eintrag hervor
              </h1>
              <p className="text-[#5a524b] mt-1">
                Mehr Sichtbarkeit erlangen und schneller verkaufen.
              </p>
            </div>

            {/* Listing Preview Snippet */}
            <div className="flex items-center gap-3 bg-[#faf8f4] px-4 py-2 rounded-lg border border-[#d4cec4]">
              <div className="w-10 h-10 bg-[#e5e5e5] rounded overflow-hidden">
                {listing.images?.[0]?.url && (
                  <img
                    src={listing.images[0].url}
                    alt="Listing"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#3a3735] line-clamp-1 max-w-[200px]">
                  {listing.name}
                </p>
                <p className="text-xs text-[#5a524b]">
                  Aktueller Status:{" "}
                  <span className="uppercase">{listing.status}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Duration Selector */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-[#d4cec4] flex items-center gap-6 flex-wrap">
          <Calendar className="w-8 h-8 text-[#c8a882] shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="duration-slider"
              className="block text-lg font-bold text-[#3a3735] mb-2"
            >
              Boost-Dauer auswählen ({selectedDurationDays} Tage)
            </label>
            <input
              id="duration-slider"
              type="range"
              min={MIN_DAYS}
              max={MAX_DAYS}
              step="1"
              value={selectedDurationDays}
              onChange={(e) => setSelectedDurationDays(Number(e.target.value))}
              className="w-full h-2 bg-[#d4cec4] rounded-lg appearance-none cursor-pointer range-lg focus:outline-none"
            />
          </div>
          <div className="w-20">
            <input
              type="number"
              min={MIN_DAYS}
              max={MAX_DAYS}
              value={selectedDurationDays}
              onChange={(e) => {
                const val = Math.min(
                  MAX_DAYS,
                  Math.max(MIN_DAYS, Number(e.target.value) || MIN_DAYS),
                );
                setSelectedDurationDays(val);
              }}
              className="w-full px-3 py-2 text-center text-[#3a3735] border border-[#d4cec4] rounded-lg focus:ring-1 focus:ring-[#c8a882] focus:border-[#c8a882] transition-colors"
            />
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {BOOST_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-xl border-2 transition-all cursor-pointer flex flex-col h-full bg-white shadow-sm hover:shadow-md
                  ${
                    isSelected
                      ? "border-[#c8a882] ring-1 ring-[#c8a882]"
                      : "border-transparent hover:border-[#d4cec4]"
                  }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3a3735] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-medium shadow-md">
                    Am beliebtesten
                  </div>
                )}

                <div className="p-6 md:p-8 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      isSelected
                        ? "bg-[#c8a882] text-white"
                        : "bg-[#faf8f4] text-[#3a3735]"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-[#3a3735] mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-[#5a524b] min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className="my-6 pt-6 border-t border-dashed border-[#d4cec4]">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-serif text-[#3a3735]">
                        CHF {(plan.dailyRate * selectedDurationDays).toFixed(2)}
                      </span>
                      <span className="text-[#5a524b] text-sm ml-2">
                        / {selectedDurationDays} tage
                      </span>
                    </div>
                    <p className="text-xs text-[#5a524b] mt-1 opacity-70">
                      ({plan.dailyRate.toFixed(2)} CHF pro Tag)
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-[#5a524b]"
                      >
                        <Check className="w-4 h-4 text-[#c8a882] mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <div
                    className={`w-full h-2 rounded-full ${
                      isSelected ? "bg-[#c8a882]" : "bg-[#faf8f4]"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-12 flex flex-col items-center justify-center space-y-4">
          <p className="text-sm text-[#5a524b]">
            Sichere Zahlung über Stripe. Dein Boost wird unmittelbar nach der
            Zahlung für {selectedDurationDays} Tage aktiviert.
          </p>
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            size="lg"
            className="w-full md:w-auto min-w-[300px] h-14 text-base bg-[#3a3735] hover:bg-[#c8a882] text-white transition-all shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Verarbeite zur
                Kasse...
              </span>
            ) : (
              `Zahle CHF ${currentTotalPrice} & Aktiviere Boost`
            )}
          </Button>
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        </div>
      </main>
    </div>
  );
}
