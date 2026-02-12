"use client";

import React from "react";
import { Shield, Scale, FileText, Gavel } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function AGBPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-20 bg-[#faf8f4] border-b border-[#e8e2d8]">
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl text-[#3a3735] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="text-[#c8a882] tracking-widest uppercase text-sm font-medium">
            Gültig ab: 08. Januar 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-brown max-w-none text-[#5a524b] leading-relaxed">
            <p className="text-lg mb-12">
              Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Rechte und
              Pflichten im Zusammenhang mit der Nutzung der auf der Webseite
              „www.nextloop.ch“ angebotenen Dienstleistungen.
            </p>

            {/* Section 1: Einleitung */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  1. Einleitung
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <p>
                  <strong>1.1 Anwendungsbereich und Geltung:</strong> Diese AGB
                  der Nextloop - Inh. Atipi, Gartenstrasse 14, 4416 Bubendorf,
                  Schweiz, sowie die ergänzenden Bestimmungen wie die
                  Datenschutzerklärung und das Gebührenreglement, regeln das
                  vertragliche Verhältnis zwischen Nextloop und den Mitgliedern.
                </p>
                <p>
                  <strong>1.2 Marktplatz von Nextloop:</strong> Nextloop stellt
                  seinen Marktplatz als Plattform für das Anbieten und den
                  Erwerb von Waren, Dienstleistungen und Rechten („Produkte“)
                  zur Verfügung. Der Anbieter wird als „Verkäufer“ und der
                  Erwerber als „Käufer“ bezeichnet.
                </p>
                <p>
                  <strong>1.3 Eigenverantwortliche Nutzung:</strong> Mitglieder
                  schliessen untereinander autonom Verträge ab. Aus solchen
                  Verträgen verpflichtet und berechtigt sind einzig der
                  Verkäufer und der Käufer. Nextloop ist nicht Vertragspartei
                  dieser Verträge.
                </p>
              </div>
            </div>

            {/* Section 2: Mitgliedschaft */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  2. Mitgliedschaft
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <p>
                  Voraussetzung für die Nutzung des Marktplatzes ist die
                  Mitgliedschaft als angemeldeter Benutzer. Anmeldung und
                  Mitgliedschaft sind kostenlos, persönlich und nicht
                  übertragbar. Die Mitgliedschaft steht nur unbeschränkt
                  handlungsfähigen Personen offen.
                </p>
              </div>
            </div>

            {/* Section 3: Gebührenreglement (FILE 2 Content) */}
            <div className="mb-16 bg-[#faf8f4] p-8 rounded-2xl border border-[#e8e2d8]">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  3. Gebührenreglement
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <p>
                  <strong>3.1 Grundsatz:</strong> Nextloop finanziert sich durch
                  Einstellgebühren und Erfolgsprovisionen. Mit der Nutzung des
                  Marktplatzes anerkennen die Mitglieder die jeweils gültigen
                  Gebühren.
                </p>
                <p>
                  <strong>3.2 Erfolgsprovision:</strong> Bei einem erfolgreichen
                  Verkauf wird eine Erfolgsprovision auf den erzielten
                  Verkaufspreis (ohne Versandkosten) fällig. Nextloop ist
                  berechtigt, diese direkt vom Käufer einzuziehen oder dem
                  Verkäufer in Rechnung zu stellen.
                </p>
                <p>
                  <strong>3.3 Zahlungsbedingungen:</strong> Gebühren sind innert
                  der auf der Rechnung angegebenen Frist zu begleichen. Bei
                  Zahlungsverzug kann Nextloop Mahngebühren erheben und das
                  Mitgliedskonto sperren.
                </p>
              </div>
            </div>

            {/* Section 4: Verkaufs- und Bietregeln */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Gavel className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  4. Verkaufs- und Bietregeln
                </h2>
              </div>
              <ul className="space-y-4 pl-9 list-none">
                <li>
                  <strong>Verbindlichkeit:</strong> Jedes Angebot und jedes
                  Gebot ist verbindlich.
                </li>
                <li>
                  <strong>Manipulation:</strong> Es ist strengstens verboten,
                  den Preis durch Eigengebote oder manipulative Praktiken zu
                  beeinflussen.
                </li>
                <li>
                  <strong>Verbotene Artikel:</strong> Der Verkauf von Artikeln,
                  die gegen gesetzliche Vorschriften oder die
                  Nextloop-Grundsätze verstossen, ist verboten.
                </li>
                <li>
                  <strong>Umgehungsverbot:</strong> Es ist untersagt, Verträge
                  ausserhalb der Plattform abzuschliessen, um die
                  Gebührenstruktur zu umgehen.
                </li>
              </ul>
            </div>

            {/* Section 5: Concierge-Service */}
            <div className="mb-16 border-l-4 border-[#c8a882] pl-8">
              <h2
                className="text-2xl text-[#3a3735] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                5. Concierge-Service
              </h2>
              <p>
                Nextloop bietet einen optionalen Concierge-Service zur
                Unterstützung bei der Angebotserstellung und Abwicklung an.
                Nextloop agiert hierbei lediglich als Vermittler und übernimmt
                keine Haftung für den Erfolg des Verkaufs oder die Qualität der
                Produkte. Es gelten separate Gebühren gemäss
                Leistungsbeschreibung.
              </p>
            </div>

            {/* Section 6: Haftung & Schlussbestimmungen */}
            <div className="mb-16">
              <h2
                className="text-2xl text-[#3a3735] mb-6"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                6. Haftung und Gerichtsstand
              </h2>
              <div className="space-y-4">
                <p>
                  <strong>6.1 Haftungsausschluss:</strong> Nextloop haftet nur
                  für direkte Schäden durch vorsätzliche oder grobfahrlässige
                  Handlungen. Eine Haftung für leichte Fahrlässigkeit sowie für
                  indirekte Schäden ist ausgeschlossen.
                </p>
                <p>
                  <strong>6.2 Anwendbares Recht:</strong> Diese AGB unterstehen
                  ausschliesslich materiellem Schweizer Recht. Ausschliesslicher
                  Gerichtsstand ist der Sitz von Nextloop.
                </p>
              </div>
            </div>

            <hr className="border-[#e8e2d8] my-12" />

            <div className="text-sm text-[#8a827c] text-center italic">
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt
              die Gültigkeit der übrigen Bestimmungen unberührt.
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
