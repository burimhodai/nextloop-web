"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Home,
  ShoppingBag,
} from "lucide-react";

// Stellen Sie sicher, dass verifyCheckoutSession korrekt importiert wird
import { verifyCheckoutSession } from "@/services/listings";

interface SessionData {
  listing: {
    _id: string;
    name: string;
    images: { url: string }[];
  };
  amount: number;
  shippingCost: number;
  totalAmount: number;
  customer: {
    email: string;
    name: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

function PurchaseSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (sessionId) {
      verifySession();
    } else {
      setError("Keine Session ID angegeben");
      setLoading(false);
    }
  }, [sessionId]);

  const verifySession = async () => {
    try {
      setLoading(true);
      // Führen Sie die Überprüfung der Sitzung mit der bereitgestellten ID durch
      const response = await verifyCheckoutSession(sessionId!);
      if (response.success) {
        setSessionData(response.data);
      } else {
        setError("Verifizierung des Kaufs fehlgeschlagen");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Verifizierung des Kaufs fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1ea] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a3735] mb-4"></div>
          <p className="text-[#3a3735] text-lg">Ihr Kauf wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f1ea] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-[#3a3735] mb-4">
            Verifizierung Fehlgeschlagen
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/search")}
            className="px-6 py-3 bg-[#3a3735] text-white hover:bg-[#c8a882] transition-colors"
          >
            Weiter einkaufen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#3a3735] mb-2">
            Kauf Erfolgreich!
          </h1>
          <p className="text-gray-600">
            Vielen Dank für Ihre Bestellung. Wir haben Ihre Zahlung erhalten.
          </p>
        </div>

        {sessionData && (
          <>
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#3a3735] mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Bestellübersicht
              </h2>
              <div className="flex items-start gap-4 mb-6">
                {sessionData.listing.images?.[0] && (
                  <img
                    src={sessionData.listing.images[0].url}
                    alt={sessionData.listing.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#3a3735] mb-2">
                    {sessionData.listing.name}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Artikelpreis: CHF {sessionData.amount.toFixed(2)}</p>
                    <p>
                      Versandkosten: CHF {sessionData.shippingCost.toFixed(2)}
                    </p>
                    <p className="font-bold text-[#3a3735] text-lg pt-2 border-t">
                      Gesamtbetrag Bezahlt: CHF{" "}
                      {sessionData.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#3a3735] mb-4 flex items-center gap-2">
                <Home className="w-6 h-6" />
                Lieferadresse
              </h2>
              <div className="text-gray-600">
                <p className="font-semibold">{sessionData.customer.name}</p>
                <p>{sessionData.shippingAddress.line1}</p>
                {sessionData.shippingAddress.line2 && (
                  <p>{sessionData.shippingAddress.line2}</p>
                )}
                <p>
                  {sessionData.shippingAddress.postal_code}{" "}
                  {sessionData.shippingAddress.city}
                </p>
                <p>{sessionData.shippingAddress.country}</p>
              </div>
            </div>

            {/* Customer Email */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#3a3735] mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Bestätigungs-E-Mail
              </h2>
              <p className="text-gray-600">
                Die Bestellbestätigung und Quittung wurden gesendet an:{" "}
                <span className="font-semibold">
                  {sessionData.customer.email}
                </span>
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#3a3735] mb-6">
                Was passiert als Nächstes?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#c8a882] text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3a3735] mb-1">
                      Bestellbestätigung
                    </h3>
                    <p className="text-gray-600">
                      Sie erhalten in Kürze eine Bestellbestätigung per E-Mail
                      mit allen Details.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#c8a882] text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3a3735] mb-1">
                      Bearbeitung durch den Verkäufer
                    </h3>
                    <p className="text-gray-600">
                      Der Verkäufer wird benachrichtigt und bereitet Ihren
                      Artikel für den Versand vor.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#c8a882] text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3a3735] mb-1">
                      Versand & Sendungsverfolgung
                    </h3>
                    <p className="text-gray-600">
                      Sobald die Ware versendet wurde, erhalten Sie eine
                      Sendungsverfolgungsnummer, um Ihre Lieferung zu
                      überwachen.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#c8a882] text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#3a3735] mb-1">
                      Lieferung
                    </h3>
                    <p className="text-gray-600">
                      Ihr Artikel wird sorgfältig verpackt und an Ihre Adresse
                      geliefert.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-[#fff9f0] border border-[#c8a882] rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-[#3a3735] mb-4">
                Wichtige Informationen
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • Alle Artikel werden mit vollständiger Versicherung und
                  Sendungsverfolgung versandt.
                </li>
                <li>
                  • Bitte überprüfen Sie Ihren Artikel sofort bei der Lieferung.
                </li>
                <li>
                  • Wenden Sie sich an den Kundendienst, wenn Sie Probleme mit
                  Ihrer Bestellung haben.
                </li>
                <li>
                  • Ihre Zahlung wird sicher verwahrt, bis Sie den Erhalt
                  bestätigen.
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors rounded"
          >
            <ShoppingBag className="w-5 h-5" />
            Weiter einkaufen
          </button>
          <button
            onClick={() => router.push("/account/orders")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3a3735] text-white hover:bg-[#c8a882] hover:text-[#3a3735] transition-colors rounded"
          >
            Meine Bestellungen ansehen
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f1ea] flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a3735] mb-4"></div>
            <p className="text-[#3a3735] text-lg">Lädt...</p>
          </div>
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}
