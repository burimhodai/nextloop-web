"use client";
import { useState, useEffect } from "react";
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

export default function PurchaseSuccessPage() {
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
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a882] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5a524b]">Ihr Kauf wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl text-[#3a3735] mb-4">
            Verifizierung Fehlgeschlagen
          </h2>
          <p className="text-[#5a524b] mb-6">{error}</p>
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
    <div className="min-h-screen bg-[#faf8f4] py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-serif text-[#3a3735] mb-4">
            Kauf Erfolgreich!
          </h1>
          <p className="text-lg text-[#5a524b]">
            Vielen Dank für Ihre Bestellung. Wir haben Ihre Zahlung erhalten.
          </p>
        </div>

        {sessionData && (
          <>
            {/* Order Summary */}
            <div className="bg-white p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-serif text-[#3a3735] mb-6">
                Bestellübersicht
              </h2>

              <div className="flex gap-6 mb-8 pb-8 border-b border-[#d4cec4]">
                {sessionData.listing.images?.[0] && (
                  <div className="w-32 h-32 bg-[#e8dfd0] flex-shrink-0">
                    <img
                      src={sessionData.listing.images[0].url}
                      alt={sessionData.listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl text-[#3a3735] font-medium mb-2">
                    {sessionData.listing.name}
                  </h3>
                  <div className="space-y-2 text-sm text-[#5a524b]">
                    <div className="flex justify-between">
                      <span>Artikelpreis:</span>
                      <span className="font-medium text-[#3a3735]">
                        CHF {sessionData.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Versandkosten:</span>
                      <span className="font-medium text-[#3a3735]">
                        CHF {sessionData.shippingCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#d4cec4]">
                      <span className="font-medium">Gesamtbetrag Bezahlt:</span>
                      <span className="font-medium text-[#c8a882] text-lg">
                        CHF {sessionData.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[#3a3735] mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#c8a882]" />
                  Lieferadresse
                </h3>
                <div className="bg-[#f5f1ea] p-4 text-sm text-[#5a524b]">
                  <p className="font-medium text-[#3a3735] mb-1">
                    {sessionData.customer.name}
                  </p>
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
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[#3a3735] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#c8a882]" />
                  Bestätigungs-E-Mail
                </h3>
                <p className="text-sm text-[#5a524b]">
                  Die Bestellbestätigung und Quittung wurden gesendet an:{" "}
                  <span className="font-medium text-[#3a3735]">
                    {sessionData.customer.email}
                  </span>
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-serif text-[#3a3735] mb-6">
                Was passiert als Nächstes?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#c8a882] rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3a3735] mb-1">
                      Bestellbestätigung
                    </h4>
                    <p className="text-sm text-[#5a524b]">
                      Sie erhalten in Kürze eine Bestellbestätigung per E-Mail
                      mit allen Details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#c8a882] rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3a3735] mb-1">
                      Bearbeitung durch den Verkäufer
                    </h4>
                    <p className="text-sm text-[#5a524b]">
                      Der Verkäufer wird benachrichtigt und bereitet Ihren
                      Artikel für den Versand vor.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#c8a882] rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3a3735] mb-1">
                      Versand & Sendungsverfolgung
                    </h4>
                    <p className="text-sm text-[#5a524b]">
                      Sobald die Ware versendet wurde, erhalten Sie eine
                      Sendungsverfolgungsnummer, um Ihre Lieferung zu
                      überwachen.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#c8a882] rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3a3735] mb-1">
                      Lieferung
                    </h4>
                    <p className="text-sm text-[#5a524b]">
                      Ihr Artikel wird sorgfältig verpackt und an Ihre Adresse
                      geliefert.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-[#f5f1ea] p-6 mb-8">
              <h3 className="font-medium text-[#3a3735] mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#c8a882]" />
                Wichtige Informationen
              </h3>
              <ul className="space-y-2 text-sm text-[#5a524b]">
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-1">•</span>
                  <span>
                    Alle Artikel werden mit vollständiger Versicherung und
                    Sendungsverfolgung versandt.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-1">•</span>
                  <span>
                    Bitte überprüfen Sie Ihren Artikel sofort bei der Lieferung.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-1">•</span>
                  <span>
                    Wenden Sie sich an den Kundendienst, wenn Sie Probleme mit
                    Ihrer Bestellung haben.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8a882] mt-1">•</span>
                  <span>
                    Ihre Zahlung wird sicher verwahrt, bis Sie den Erhalt
                    bestätigen.
                  </span>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#d4cec4] text-[#3a3735] hover:bg-[#f5f1ea] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Weiter einkaufen</span>
          </button>
          <button
            onClick={() => router.push("/account/orders")}
            className="flex items-center gap-2 px-6 py-3 bg-[#3a3735] text-white hover:bg-[#c8a882] hover:text-[#3a3735] transition-colors"
          >
            <span>Meine Bestellungen ansehen</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
