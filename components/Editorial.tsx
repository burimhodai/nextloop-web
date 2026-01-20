"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Editorial() {
  return (
    <section className="py-32 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-3/4 overflow-hidden shadow-2xl">
                <Image
                  fill
                  src="https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoZXJpdGFnZSUyMGNyYWZ0c21hbnNoaXB8ZW58MXx8fHwxNzYzMTIyNzQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Heritage craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-[#c8a882] -z-10"></div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-[#c8a882]"></div>
              <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
                Unsere Geschichte
              </span>
            </div>

            <h2
              className="text-[#3a3735] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Herkunft & Tradition
            </h2>

            <div className="space-y-6 text-[#5a524b] leading-relaxed mb-8">
              <p>
                Bei Lumière glauben wir, dass jedes außergewöhnliche Objekt eine
                Geschichte in sich trägt – eine Erzählung von Kunstfertigkeit,
                Innovation und dem Lauf der Zeit. Unsere Auktionen werden mit
                größter Sorgfalt kuratiert, um nur die feinsten Beispiele
                menschlicher Errungenschaften aus verschiedenen Jahrhunderten
                und Kulturen zu präsentieren.
              </p>

              <p>
                Von seltenen Zeitmessern, gefertigt von Meisteruhrmachern, bis
                hin zu Kunstwerken von Museumsqualität und Antiquitäten – jedes
                Los in unserer Kollektion wurde von führenden Experten
                authentifiziert und kommt mit umfassender
                Provenienz-Dokumentation.
              </p>

              <p>
                Wir laden anspruchsvolle Sammler ein, Stücke zu entdecken, die
                über bloßen Besitz hinausgehen – Schätze, die Teil Ihres
                Vermächtnisses werden und ihre Reise durch die Zeit fortsetzen.
              </p>
            </div>

            <button className="group flex items-center gap-3 text-[#3a3735] hover:text-[#c8a882] transition-colors">
              <span className="tracking-wide">
                Mehr über unseren Prozess erfahren
              </span>
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </button>

            {/* Stats */}
            <div className="mt-12 pt-12 border-t border-[#d4cec4] grid grid-cols-3 gap-8">
              <div>
                <div
                  className="text-[#c8a882] mb-2"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "2rem",
                  }}
                >
                  25+
                </div>
                <p className="text-[#5a524b] text-sm">Jahre der Exzellenz</p>
              </div>
              <div>
                <div
                  className="text-[#c8a882] mb-2"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "2rem",
                  }}
                >
                  98%
                </div>
                <p className="text-[#5a524b] text-sm">Kundenzufriedenheit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
