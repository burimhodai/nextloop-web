"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Editorial() {
  return (
    <section className="py-32 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-[#c8a882]"></div>
              <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
                Über uns
              </span>
            </div>

            <h2
              className="text-[#3a3735] mb-8 text-4xl lg:text-5xl"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Willkommen bei NextLoop – Wo Luxus eine zweite Chance bekommt
            </h2>

            <div className="space-y-6 text-[#5a524b] leading-relaxed mb-8">
              <p>
                Seit März 2025 verfolgen wir bei NextLoop eine einfache, aber
                kraftvolle Mission: Wir geben wertvollen Gegenständen ein neues
                Zuhause. Unser Name steht für den nächsten Kreislauf – den
                nächsten Loop – den wir für deine Schätze schaffen. Wir sind
                nicht einfach ein Second-Hand-Marktplatz, sondern eine
                Gemeinschaft von Liebhabern, die verstehen, dass echte Qualität
                zeitlos ist.
              </p>

              <p>
                Gegründet aus einer tiefen Leidenschaft für Design, Handwerk und
                Nachhaltigkeit, bieten wir dir ein vollkommen neues Erlebnis im
                Handel mit Second-Hand-Luxusgütern. Bei NextLoop konzentrieren
                wir uns bewusst auf die Segmente, in denen echte Expertise
                zählt:{" "}
                <strong>
                  Designermöbel, exklusive Uhren, edlen Schmuck und einzigartige
                  Kunstwerke
                </strong>
                .
              </p>

              <p>
                Bewusst verzichten wir auf den Handel mit Kleidung – das
                ermöglicht uns, uns vollständig auf die Qualität und
                Authentizität in diesen Premium-Kategorien zu konzentrieren. Ob
                du verkaufen oder kaufen möchtest: Bei uns bist du genau
                richtig.
              </p>
            </div>

            <Link
              href="/about"
              className="group flex items-center gap-3 text-[#3a3735] hover:text-[#c8a882] transition-colors"
            >
              <span className="tracking-wide">
                Mehr über unsere Services erfahren
              </span>
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </Link>

            {/* Stats */}
            <div className="mt-12 pt-12 border-t border-[#d4cec4] grid grid-cols-2 gap-8">
              <div>
                <div
                  className="text-[#c8a882] mb-2"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "2rem",
                  }}
                >
                  2025
                </div>
                <p className="text-[#5a524b] text-sm">
                  Gegründet aus Leidenschaft
                </p>
              </div>
              <div>
                <div
                  className="text-[#c8a882] mb-2"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "2rem",
                  }}
                >
                  100%
                </div>
                <p className="text-[#5a524b] text-sm">
                  Authentizität garantiert
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
