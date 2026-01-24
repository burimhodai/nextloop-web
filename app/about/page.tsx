// app/uber-uns/page.tsx
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Sparkles,
  Users,
  Heart,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title:
    "Über NextLoop | Second-Hand Luxus Marktplatz für Designermöbel, Uhren & Kunst",
  description:
    "Entdecke NextLoop - Deine Premium-Plattform für Second-Hand Luxusgüter. Wir handeln mit Designermöbeln, exklusiven Uhren, edlem Schmuck und Kunstwerken. Gegründet März 2025.",
  keywords:
    "NextLoop, Second-Hand Luxus, Designermöbel gebraucht, Luxusuhren verkaufen, Schmuck Second-Hand, Kunstwerke kaufen, Concierge Service, Auktionshaus Österreich",
  openGraph: {
    title: "Über NextLoop - Wo Luxus eine zweite Chance bekommt",
    description:
      "Premium Second-Hand Marktplatz für Designermöbel, Uhren, Schmuck & Kunst. Concierge Service, professionelle Abwicklung, garantierte Authentizität.",
    type: "website",
    locale: "de_AT",
    siteName: "NextLoop",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-[#faf8f4] to-[#f5f1e8] overflow-hidden">
        {/* Mountain backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left mountain - hidden on mobile */}
          <div className="hidden md:block absolute left-0 top-0 w-1/2 h-full opacity-80">
            <Image
              src="/mountain-left.png"
              alt=""
              width={800}
              height={1000}
              className="absolute -left-12 top-32 w-full h-auto"
              priority
            />
          </div>

          {/* Right mountain - visible on all screens */}
          <div className="absolute right-0 top-0 w-2/3 md:w-1/2 h-full opacity-80">
            <Image
              src="/mountain-right.png"
              alt=""
              width={800}
              height={1000}
              className="absolute sm:right-0 sm:top-42 sm:scale-100 scale-400 top-65 w-full h-auto"
              priority
            />
          </div>
        </div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#c8a882] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c8a882] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-8 border border-[#c8a882]/20">
              <Sparkles className="w-4 h-4 text-[#c8a882]" />
              <span className="text-sm text-[#5a524b] tracking-wide">
                Gegründet März 2025
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl text-[#3a3735] mb-6 leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Willkommen bei NextLoop
            </h1>

            <p
              className="text-xl md:text-2xl text-[#c8a882] mb-8 font-light"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Wo Luxus eine zweite Chance bekommt
            </p>

            <p className="text-lg text-[#5a524b] leading-relaxed max-w-3xl mx-auto">
              Seit März 2025 verfolgen wir bei NextLoop eine einfache, aber
              kraftvolle Mission: Wir geben wertvollen Gegenständen ein neues
              Zuhause. Unser Name steht für den nächsten Kreislauf – den
              nächsten Loop – den wir für deine Schätze schaffen.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-12 bg-[#c8a882]"></div>
                <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
                  Unsere Mission
                </span>
              </div>

              <h2
                className="text-4xl md:text-5xl text-[#3a3735] mb-6"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Eine Gemeinschaft von Liebhabern
              </h2>

              <div className="space-y-4 text-[#5a524b] leading-relaxed">
                <p>
                  Wir sind nicht einfach ein Second-Hand-Marktplatz. Wir sind
                  eine Gemeinschaft von Liebhabern, die verstehen, dass echte
                  Qualität zeitlos ist.
                </p>
                <p>
                  Gegründet aus einer tiefen Leidenschaft für Design, Handwerk
                  und Nachhaltigkeit, haben wir NextLoop aufgebaut, um dir ein
                  vollkommen neues Erlebnis im Handel mit
                  Second-Hand-Luxusgütern zu bieten. Ob du Designermöbel
                  verkaufen möchtest, eine seltene Uhr zu Geld machen willst
                  oder wertvolle Kunstwerke einem neuen Besitzer zuführen
                  möchtest – bei NextLoop bist du genau richtig.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#faf8f4] p-8 rounded-2xl border border-[#e8e2d8] hover:border-[#c8a882] transition-all hover:shadow-lg">
                <Heart className="w-8 h-8 text-[#c8a882] mb-4" />
                <h3 className="text-xl font-semibold text-[#3a3735] mb-2">
                  Leidenschaft
                </h3>
                <p className="text-sm text-[#5a524b]">Für Design & Handwerk</p>
              </div>

              <div className="bg-[#faf8f4] p-8 rounded-2xl border border-[#e8e2d8] hover:border-[#c8a882] transition-all hover:shadow-lg mt-8">
                <Leaf className="w-8 h-8 text-[#c8a882] mb-4" />
                <h3 className="text-xl font-semibold text-[#3a3735] mb-2">
                  Nachhaltigkeit
                </h3>
                <p className="text-sm text-[#5a524b]">
                  Werte statt Verschwendung
                </p>
              </div>

              <div className="bg-[#faf8f4] p-8 rounded-2xl border border-[#e8e2d8] hover:border-[#c8a882] transition-all hover:shadow-lg">
                <Shield className="w-8 h-8 text-[#c8a882] mb-4" />
                <h3 className="text-xl font-semibold text-[#3a3735] mb-2">
                  Qualität
                </h3>
                <p className="text-sm text-[#5a524b]">
                  Expertise und Authentizität
                </p>
              </div>

              <div className="bg-[#faf8f4] p-8 rounded-2xl border border-[#e8e2d8] hover:border-[#c8a882] transition-all hover:shadow-lg mt-8">
                <Users className="w-8 h-8 text-[#c8a882] mb-4" />
                <h3 className="text-xl font-semibold text-[#3a3735] mb-2">
                  Community
                </h3>
                <p className="text-sm text-[#5a524b]">Liebhaber und Sammler</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-[#faf8f4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-[#c8a882]"></div>
              <span className="text-[#c8a882] text-sm tracking-[0.2em] uppercase">
                Unser Sortiment
              </span>
              <div className="h-px w-12 bg-[#c8a882]"></div>
            </div>

            <h2
              className="text-4xl md:text-5xl text-[#3a3735] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Second-Hand Handel auf höchstem Niveau
            </h2>

            <p className="text-lg text-[#5a524b] max-w-3xl mx-auto">
              Bei NextLoop konzentrieren wir uns bewusst auf die Segmente, in
              denen echte Expertise zählt. Bewusst verzichten wir auf den Handel
              mit Kleidung – das ermöglicht uns, uns vollständig auf die
              Qualität und Authentizität in diesen Premium-Kategorien zu
              konzentrieren.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Designermöbel",
                desc: "Klassiker von renommierten Herstellern",
              },
              { title: "Uhren", desc: "Exklusive Zeitmesser großer Marken" },
              { title: "Schmuck", desc: "Edle und kostbare Einzelstücke" },
              {
                title: "Kunstwerke",
                desc: "Einzigartige und bedeutende Stücke",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-2xl border-2 border-[#e8e2d8] hover:border-[#c8a882] transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div
                  className="text-[#c8a882] text-5xl font-light mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-2xl font-semibold text-[#3a3735] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#5a524b]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why NextLoop */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl text-[#3a3735] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Warum Second-Hand bei NextLoop?
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-[#faf8f4] p-12 rounded-3xl border border-[#e8e2d8]">
              <div className="space-y-8">
                <p className="text-lg text-[#5a524b] leading-relaxed text-center">
                  Jeder Artikel, den du bei uns findest, wird von unseren
                  erfahrenen Experten sorgfältig geprüft. Wir garantieren dir
                  Authentizität, überprüfen den Zustand gewissenhaft und
                  dokumentieren alles transparent. Du kannst mit vollständigem
                  Vertrauen kaufen – ohne Überraschungen, ohne versteckte
                  Mängel.
                </p>

                <div className="h-px bg-[#c8a882]/20"></div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border-2 border-[#c8a882]">
                      <CheckCircle2 className="w-8 h-8 text-[#c8a882]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#3a3735] mb-2">
                      Expertise
                    </h3>
                    <p className="text-sm text-[#5a524b]">
                      Sorgfältig geprüfte Objekte
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border-2 border-[#c8a882]">
                      <Shield className="w-8 h-8 text-[#c8a882]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#3a3735] mb-2">
                      Sicherheit
                    </h3>
                    <p className="text-sm text-[#5a524b]">
                      Authentizität garantiert
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border-2 border-[#c8a882]">
                      <Sparkles className="w-8 h-8 text-[#c8a882]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#3a3735] mb-2">
                      Transparenz
                    </h3>
                    <p className="text-sm text-[#5a524b]">
                      Keine versteckten Mängel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-[#3a3735] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Unsere Services
            </h2>
            <p className="text-xl text-[#c8a882] max-w-3xl mx-auto">
              Von Concierge Service bis professionelle Räumungen – wir
              optimieren deine Verkäufe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Concierge */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex flex-col">
              <div
                className="text-[#c8a882] text-4xl mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                01
              </div>
              <h3 className="text-2xl font-semibold mb-4">Concierge Service</h3>
              <p className="text-white/80 mb-6 flex-grow">
                Verkaufen ohne Aufwand. Du kontaktierst uns, wir übernehmen
                alles: professionelle Fotografie, detaillierte Beschreibungen
                und strategische Platzierung. Du entspannst dich, während wir
                den besten Preis erzielen.
              </p>
            </div>

            {/* Zusatzdienstleistungen */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex flex-col">
              <div
                className="text-[#c8a882] text-4xl mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                02
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Zusatzdienstleistungen
              </h3>
              <p className="text-white/80 mb-6 flex-grow">
                Optimiere deine Verkäufe mit professioneller Fotobearbeitung und
                SEO-optimierten Produktbeschreibungen. Nutze zudem unseren
                sicheren Zwischenlager-Service für deine Schätze.
              </p>
            </div>

            {/* Räumungen */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex flex-col">
              <div
                className="text-[#c8a882] text-4xl mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                03
              </div>
              <h3 className="text-2xl font-semibold mb-4">Räumungen</h3>
              <p className="text-white/80 mb-6 flex-grow">
                Nachlässe und Haushaltsauflösungen mit fairen
                Kickback-Verträgen. Wir bewerten fair, räumen professionell und
                du erhältst einen transparenten Anteil vom Verkaufserlös der
                Wertgegenstände.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Table */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl text-[#3a3735] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Deine Vorteile auf einen Blick
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Expertise",
                desc: "Wir kennen uns aus mit Designermöbeln, Uhren, Schmuck und Kunstwerken",
              },
              {
                title: "Transparenz",
                desc: "Faire Preise, klare Verträge, keine versteckten Gebühren",
              },
              {
                title: "Professionelle Abwicklung",
                desc: "Von der Fotografie bis zum Versand – alles aus einer Hand",
              },
              {
                title: "Sicherheit",
                desc: "Authentizitätsprüfung, Versicherung, sichere Lagerung",
              },
              {
                title: "Nachhaltigkeit",
                desc: "Wir geben wertvollen Dingen ein zweites Leben",
              },
              {
                title: "Benutzerfreundlichkeit",
                desc: "Einfache Bedienung, schnelle Verkäufe, zuverlässiger Service",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 bg-[#faf8f4] rounded-xl border border-[#e8e2d8] hover:border-[#c8a882] transition-all"
              >
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#c8a882]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#3a3735] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#5a524b]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-gradient-to-br from-[#faf8f4] to-[#f5f1e8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-4xl md:text-5xl text-[#3a3735] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Die NextLoop Community
          </h2>

          <p className="text-lg text-[#5a524b] leading-relaxed mb-8">
            Bei NextLoop geht es nicht nur um Transaktionen. Es geht um eine
            Gemeinschaft von Menschen, die Qualität schätzen, Nachhaltigkeit
            leben und verstehen, dass echte Werte zeitlos sind. Jeder
            Second-Hand-Kauf ist ein Statement gegen Überkonsum und
            Massenproduktion.
          </p>

          <div
            className="inline-flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xl md:text-2xl text-[#c8a882] font-light"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            <span>Qualität statt Quantität</span>
            <span className="text-[#3a3735] hidden md:inline">•</span>
            <span>Handwerk statt Massenware</span>
            <span className="text-[#3a3735] hidden md:inline">•</span>
            <span>Nachhaltigkeit statt Verschwendung</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
