"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { CheckCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function BoostSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { token } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifySession = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const response = await fetch(`${API_URL}/payment/verify-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Verifizierung fehlgeschlagen");
        }

        setData(result.data);
        setStatus("success");
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus("error");
      }
    };

    verifySession();
  }, [sessionId, token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-[#c8a882] animate-spin mb-4" />
        <h2 className="text-xl font-serif text-[#3a3735]">
          Zahlung wird verifiziert…
        </h2>
        <p className="text-[#5a524b] mt-2">
          Bitte warten, während wir Ihren Boost bestätigen.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-serif text-[#3a3735] mb-2">
            Etwas ist schiefgelaufen
          </h2>
          <p className="text-[#5a524b] mb-8">
            Wir konnten die Zahlungssitzung nicht verifizieren. Falls Sie belastet wurden, kontaktieren Sie bitte den Support.
          </p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-[#d4cec4] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#c8a882]" />

        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-[#3a3735] mb-4">
          Zahlung erfolgreich!
        </h1>

        <p className="text-lg text-[#5a524b] mb-8">
          Ihr Inserat <strong>{data?.listingTitle || "listing"}</strong> wurde erfolgreich geboostet.
        </p>

        <div className="bg-[#faf8f4] rounded-lg p-6 mb-8 text-left border border-[#e5e5e5]">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-[#5a524b]">Gezahlter Betrag:</span>
            <span className="font-bold text-[#3a3735]">
              CHF {data?.cost?.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-sm text-[#5a524b]">Boost-Typ:</span>
            <span className="font-bold text-[#3a3735] capitalize">
              {data?.type?.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#5a524b]">Dauer:</span>
            <span className="font-bold text-[#3a3735]">
              {data?.duration} Tage
            </span>
          </div>
        </div>

        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-[#3a3735] hover:bg-[#c8a882] text-white h-12"
        >
          Meine Inserate ansehen <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <Link
          href="/dashboard"
          className="block text-[#5a524b] hover:text-[#3a3735] text-sm mt-3"
        >
          Zurück zum Dashboard
        </Link>
      </div>
    </div>
  );
}
