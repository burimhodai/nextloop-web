"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, Database, Cookie, Trash2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-20 bg-[#faf8f4] border-b border-[#e8e2d8]">
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl text-[#3a3735] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Datenschutzerklärung
          </h1>
          <p className="text-[#c8a882] tracking-widest uppercase text-sm font-medium">
            Stand: 07. Januar 2026 | Version 1.0
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-brown max-w-none text-[#5a524b] leading-relaxed">
            <p className="text-lg mb-12">
              NextLoop nimmt den Schutz Ihrer persönlichen Daten sehr ernst.
              Diese Erklärung erläutert, wie wir personenbezogene Daten gemäss
              dem Schweizer Bundesgesetz über den Datenschutz (DSG) und der
              DSGVO erheben und verarbeiten.
            </p>

            {/* 1. Datenerhebung */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  1. Welche Daten wir erheben
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <p>
                  <strong>Kontoinformationen:</strong> Name, E-Mail-Adresse,
                  Passwort (verschlüsselt), Telefonnummer und Geburtsdatum zur
                  Altersverifikation.
                </p>
                <p>
                  <strong>Adressdaten:</strong> Strasse, Ort, PLZ und Kanton für
                  den Versand und die Rechnungsstellung.
                </p>
                <p>
                  <strong>Zahlungsdaten:</strong> Zahlungen werden sicher über{" "}
                  <strong>Stripe</strong> abgewickelt. Wir speichern keine
                  Kreditkartennummern auf unseren eigenen Servern.
                </p>
              </div>
            </div>

            {/* 2. ID-Verifizierung (KYC) */}
            <div className="mb-16 bg-[#faf8f4] p-8 rounded-2xl border border-[#e8e2d8]">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  2. ID-Verifizierung & KYC Prozess
                </h2>
              </div>
              <div className="space-y-4 pl-9 text-sm">
                <p>
                  Um Betrug zu verhindern und Schweizer KYC-Vorgaben zu
                  erfüllen, führen wir eine Identitätsprüfung durch:
                </p>
                <ul className="list-disc space-y-2">
                  <li>Sie laden ein Foto Ihres Ausweises hoch.</li>
                  <li>
                    Nach der Prüfung durch unsere Administratoren werden die{" "}
                    <strong>Ausweisbilder dauerhaft gelöscht</strong>.
                  </li>
                  <li>
                    Wir speichern lediglich den Status (verifiziert), Ihren
                    Namen und das Ablaufdatum des Dokuments.
                  </li>
                </ul>
                <div className="flex items-center gap-2 text-[#c8a882] font-semibold mt-4">
                  <Trash2 className="w-4 h-4" />
                  <span>
                    Wichtig: Keine dauerhafte Speicherung von Ausweiskopien.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Cookies */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Cookie className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  3. Cookie-Richtlinien
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <p>
                  Wir verwenden Cookies, um die Funktionalität unserer Plattform
                  zu gewährleisten:
                </p>
                <ul className="list-disc space-y-2">
                  <li>
                    <strong>Essenzielle Cookies:</strong> Notwendig für den
                    Login-Status (JWT-Tokens) und die Sicherheit.
                  </li>
                  <li>
                    <strong>Funktionale Cookies:</strong> Speichern von
                    Sprachpräferenzen und Ihrer Watchlist.
                  </li>
                  <li>
                    <strong>Analyse-Cookies:</strong> Aggregierte Daten über die
                    Nutzung der Plattform zur Optimierung unseres Angebots.
                  </li>
                </ul>
                <p className="text-sm italic">
                  Sie können Cookies in Ihren Browsereinstellungen jederzeit
                  deaktivieren, jedoch kann dies die Funktionen der Webseite
                  einschränken.
                </p>
              </div>
            </div>

            {/* 4. Datensicherheit */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  4. Datensicherheit & Speicherung
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <p>
                  Ihre Daten werden sicher verschlüsselt (HTTPS/TLS) übertragen.
                  Passwörter werden mittels <strong>bcrypt</strong> (12 Rounds)
                  gehasht. Unsere Datenbanken befinden sich auf gesicherten
                  Servern mit strengen Zugriffskontrollen.
                </p>
              </div>
            </div>

            {/* 5. Ihre Rechte */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-[#c8a882]" />
                <h2
                  className="text-2xl text-[#3a3735] m-0"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  5. Ihre Rechte
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <p>
                  Gemäss Schweizer Datenschutzrecht haben Sie das Recht auf:
                </p>
                <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                  <li className="bg-[#faf8f4] p-4 rounded-lg border border-[#e8e2d8]">
                    Auskunft über Ihre Daten
                  </li>
                  <li className="bg-[#faf8f4] p-4 rounded-lg border border-[#e8e2d8]">
                    Berichtigung falscher Daten
                  </li>
                  <li className="bg-[#faf8f4] p-4 rounded-lg border border-[#e8e2d8]">
                    Löschung Ihres Kontos
                  </li>
                  <li className="bg-[#faf8f4] p-4 rounded-lg border border-[#e8e2d8]">
                    Datenübertragbarkeit
                  </li>
                </ul>
              </div>
            </div>

            <hr className="border-[#e8e2d8] my-12" />

            {/* Contact */}
            <div className="bg-[#3a3735] text-white p-10 rounded-3xl text-center">
              <h3
                className="text-white text-2xl mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Fragen zum Datenschutz?
              </h3>
              <p className="text-white/80 mb-6">
                Kontaktieren Sie uns per E-Mail::
              </p>
              <p className="font-semibold text-[#c8a882]">
                support@nextloop.ch
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
