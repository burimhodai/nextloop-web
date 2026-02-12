// components/listings/BoostModal.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface BoostModalProps {
  listingId: string;
  listingTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BOOST_TYPES = [
  {
    type: "FEATURED",
    name: "Hervorgehoben",
    icon: "⭐",
    description: "Fallen Sie auf mit einem 'Hervorgehoben'-Abzeichen",
    costPerDay: 10,
    benefits: [
      "Benachmarkung auf dem Inserat",
      "Höhere Sichtbarkeit in der Suche",
      "Heben Sie sich von der Konkurrenz ab",
    ],
  },
  {
    type: "CATEGORY_TOP",
    name: "Kategorie Top",
    icon: "🏆",
    description: "Erscheinen Sie ganz oben in Ihrer Kategorie",
    costPerDay: 15,
    benefits: [
      "Topposition in der Kategorie",
      "Erhöhte Präsenz",
      "Bevorzugte Platzierung",
    ],
  },
  {
    type: "HOMEPAGE",
    name: "Startseite",
    icon: "🚀",
    description: "Erscheinen Sie auf der Startseite für maximale Sichtbarkeit",
    costPerDay: 25,
    benefits: [
      "Startseiten-Feature",
      "Maximale Reichweite",
      "Premium-Positionierung",
      "Beste Konversionsrate",
    ],
  },
  {
    type: "SEARCH_PRIORITY",
    name: "Such-Priorität",
    icon: "🔍",
    description: "Verbessern Sie Ihr Ranking in den Suchergebnissen",
    costPerDay: 20,
    benefits: [
      "Höheres Suchranking",
      "Vor Wettbewerbern erscheinen",
      "Mehr Suchimpressionen",
    ],
  },
];

export const BoostModal: React.FC<BoostModalProps> = ({
  listingId,
  listingTitle,
  onClose,
  onSuccess,
}) => {
  const [selectedType, setSelectedType] = useState("FEATURED");
  const [duration, setDuration] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBoost = BOOST_TYPES.find((b) => b.type === selectedType)!;
  const totalCost = selectedBoost.costPerDay * duration;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_URL}/boosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing: listingId,
          type: selectedType,
          duration: duration,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Boost konnte nicht erstellt werden");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inserat konnte nicht geboostet werden");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-[#faf8f4] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Inserat boosten
            </h2>
            <p className="text-sm text-gray-600 mt-1">{listingTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Boost Types */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Wähle Boost-Typ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BOOST_TYPES.map((boost) => (
                <button
                  key={boost.type}
                  onClick={() => setSelectedType(boost.type)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${selectedType === boost.type
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{boost.icon}</span>
                      <h4 className="font-semibold text-gray-900">
                        {boost.name}
                      </h4>
                    </div>
                    <span className="text-sm font-medium text-purple-600">
                      CHF {boost.costPerDay}/Tag
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {boost.description}
                  </p>
                  <ul className="space-y-1">
                    {boost.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-xs text-gray-500 flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Wähle Dauer
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[3, 7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setDuration(days)}
                  className={`p-4 rounded-lg border-2 transition-all ${duration === days
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="text-2xl font-bold text-gray-900">{days}</div>
                  <div className="text-xs text-gray-600 mt-1">Tage</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oder geben Sie eine benutzerdefinierte Dauer ein (Tage)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Anzahl der Tage eingeben"
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Zusammenfassung
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Boost-Typ:</span>
                <span className="font-medium text-gray-900">
                  {selectedBoost.icon} {selectedBoost.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dauer:</span>
                <span className="font-medium text-gray-900">
                  {duration} Tage
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kosten pro Tag:</span>
                <span className="font-medium text-gray-900">
                  CHF {selectedBoost.costPerDay.toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Gesamtkosten:
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    CHF {totalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1"
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Inserat boosten für CHF {totalCost.toFixed(2)}
            </Button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">So funktioniert das Boosten:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>
                    Ihr Inserat wird sofort nach der Zahlung beworben
                  </li>
                  <li>Der Boost ist für die gewählte Dauer aktiv</li>
                  <li>Sie können die Leistung in Ihrem Dashboard verfolgen</li>
                  <li>Jederzeit kündbar für eine anteilige Rückerstattung</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
