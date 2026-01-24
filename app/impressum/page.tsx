"use client";

import React from "react";
import { Building2, Mail, Phone, User, Landmark } from "lucide-react";

export default function ImpressumPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-20 bg-[#faf8f4] border-b border-[#e8e2d8]">
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl text-[#3a3735] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Impressum
          </h1>
          <p className="text-[#c8a882] tracking-widest uppercase text-sm font-medium">
            Rechtliche Hinweise gemäss Schweizer Gesetzgebung
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Business Identity */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#faf8f4] rounded-full flex items-center justify-center border border-[#e8e2d8]">
                  <Building2 className="w-5 h-5 text-[#c8a882]" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#8a827c] mb-2 font-semibold">
                    Unternehmen
                  </h3>
                  <p className="text-lg text-[#3a3735] font-medium leading-relaxed">
                    N/A <br />
                    (Rechtlicher Name des Unternehmens)
                  </p>
                  <p className="text-[#5a524b]">Rechtsform: N/A</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#faf8f4] rounded-full flex items-center justify-center border border-[#e8e2d8]">
                  <Landmark className="w-5 h-5 text-[#c8a882]" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#8a827c] mb-2 font-semibold">
                    Sitz der Gesellschaft
                  </h3>
                  <p className="text-[#5a524b] leading-relaxed">
                    N/A (Strasse / Hausnummer) <br />
                    N/A (PLZ / Ort) <br />
                    Schweiz
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Representation */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#faf8f4] rounded-full flex items-center justify-center border border-[#e8e2d8]">
                  <User className="w-5 h-5 text-[#c8a882]" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#8a827c] mb-2 font-semibold">
                    Vertretungsberechtigte Person
                  </h3>
                  <p className="text-[#3a3735] font-medium">
                    N/A (Vorname Nachname)
                  </p>
                  <p className="text-sm text-[#5a524b]">
                    N/A (Funktion, z.B. Geschäftsführer)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#faf8f4] rounded-full flex items-center justify-center border border-[#e8e2d8]">
                  <Mail className="w-5 h-5 text-[#c8a882]" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#8a827c] mb-2 font-semibold">
                    Kontakt
                  </h3>
                  <p className="text-[#3a3735]">E-Mail: N/A</p>
                  <p className="text-[#3a3735]">Telefon: N/A</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-16 border-[#e8e2d8]" />

          {/* Registry & Tax */}
          <div className="grid md:grid-cols-2 gap-12 text-sm text-[#5a524b]">
            <div>
              <h3 className="text-[#3a3735] font-semibold mb-3">
                Handelsregister & UID
              </h3>
              <p>Handelsregister-Nummer: N/A</p>
              <p>Unternehmens-Identifikationsnummer (UID): N/A</p>
              <p>Mehrwertsteuer-Nummer: N/A</p>
            </div>
            <div>
              <h3 className="text-[#3a3735] font-semibold mb-3">
                Haftungsausschluss
              </h3>
              <p className="leading-relaxed">
                Der Autor übernimmt keinerlei Gewähr hinsichtlich der
                inhaltlichen Richtigkeit, Genauigkeit, Aktualität,
                Zuverlässigkeit und Vollständigkeit der Informationen.
                Haftungsansprüche gegen den Autor wegen Schäden materieller oder
                immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw.
                Nichtnutzung der veröffentlichten Informationen entstanden sind,
                werden ausgeschlossen.
              </p>
            </div>
          </div>

          {/* Links Disclaimer */}
          <div className="mt-12 text-sm text-[#5a524b]">
            <h3 className="text-[#3a3735] font-semibold mb-3">
              Haftung für Links
            </h3>
            <p className="leading-relaxed">
              Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres
              Verantwortungsbereichs. Es wird jegliche Verantwortung für solche
              Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten
              erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
