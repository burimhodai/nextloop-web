import {
  User,
  Camera,
  Mail,
  Phone,
  Globe,
  Building,
  Shield,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

export function AccountSettings() {
  return (
    <div className="mb-12">
      <h2
        className="text-[#3a3735] mb-8"
        style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem" }}
      >
        Kontoeinstellungen
      </h2>

      {/* Profile Information */}
      <div className="bg-white p-8 shadow-md border border-[#e8dfd0] mb-6">
        <h3
          className="text-[#3a3735] mb-6"
          style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem" }}
        >
          Profilinformationen
        </h3>

        <div className="flex items-start gap-8 mb-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 bg-[#e8dfd0] flex items-center justify-center relative group cursor-pointer">
              <User className="w-16 h-16 text-[#5a524b]" strokeWidth={1.5} />
              <div className="absolute inset-0 bg-[#3a3735]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <button className="text-[#c8a882] text-sm hover:text-[#3a3735] transition-colors">
              Foto ändern
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#5a524b] text-sm mb-2">
                Vollständiger Name
              </label>
              <input
                type="text"
                defaultValue="Alexandra Sterling"
                className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] transition-all"
              />
            </div>
            <div>
              <label className="block text-[#5a524b] text-sm mb-2">
                Benutzername
              </label>
              <input
                type="text"
                defaultValue="@alex.sterling"
                className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] transition-all"
              />
            </div>
            <div>
              <label className="block text-[#5a524b] text-sm mb-2">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                defaultValue="alex.sterling@example.com"
                className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] transition-all"
              />
            </div>
            <div>
              <label className="block text-[#5a524b] text-sm mb-2">
                Telefonnummer
              </label>
              <input
                type="tel"
                defaultValue="+41 22 123 4567"
                className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] transition-all"
              />
            </div>
            <div>
              <label className="block text-[#5a524b] text-sm mb-2">
                Bevorzugte Sprache
              </label>
              <select className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] transition-all">
                <option>English</option>
                <option>Französisch</option>
                <option>Deutsch</option>
                <option>Italienisch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white p-8 shadow-md border border-[#e8dfd0] mb-6">
        <h3
          className="text-[#3a3735] mb-6"
          style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem" }}
        >
          Unternehmensinformationen
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[#5a524b] text-sm mb-2">
              Firmenname
            </label>
            <input
              type="text"
              defaultValue="Sterling Collectibles Ltd."
              className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] transition-all"
            />
          </div>
          <div>
            <label className="block text-[#5a524b] text-sm mb-2">
              MwSt.-Nummer
            </label>
            <input
              type="text"
              defaultValue="CHE-123.456.789"
              className="w-full px-4 py-3 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] focus:outline-none focus:border-[#c8a882] transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" strokeWidth={1.5} />
            <div>
              <p className="text-green-700">Verifizierter Verkäufer</p>
              <p className="text-green-600 text-sm">
                Bewertung: 4,9/5,0 aus 234 Bewertungen
              </p>
            </div>
          </div>
          <button className="text-green-600 hover:text-green-700 text-sm">
            Öffentliches Profil ansehen
          </button>
        </div>
      </div>

      {/* Address Management */}
      <div className="bg-white p-8 shadow-md border border-[#e8dfd0] mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-[#3a3735]"
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.5rem",
            }}
          >
            Adressverwaltung
          </h3>
          <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] text-sm transition-colors">
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Neue Adresse hinzufügen
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-6 border-2 border-[#c8a882] bg-[#faf8f4]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c8a882]" strokeWidth={1.5} />
                <span className="text-[#c8a882] text-sm tracking-wider">
                  Hauptadresse
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[#3a3735] hover:text-[#c8a882] text-sm">
                  Bearbeiten
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm">
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <p className="text-[#3a3735] mb-1">Alexandra Sterling</p>
            <p className="text-[#5a524b] text-sm">Rue du Rhône 123</p>
            <p className="text-[#5a524b] text-sm">1204 Geneva, Switzerland</p>
            <p className="text-[#5a524b] text-sm">+41 22 123 4567</p>
          </div>

          <div className="p-6 border border-[#d4cec4] bg-white">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[#5a524b] text-sm">Rechnungsadresse</span>
              <div className="flex items-center gap-2">
                <button className="text-[#3a3735] hover:text-[#c8a882] text-sm">
                  Bearbeiten
                </button>
                <button className="text-red-600 hover:text-red-700 text-sm">
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <p className="text-[#3a3735] mb-1">Sterling Collectibles Ltd.</p>
            <p className="text-[#5a524b] text-sm">Avenue de la Gare 45</p>
            <p className="text-[#5a524b] text-sm">1003 Lausanne, Switzerland</p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white p-8 shadow-md border border-[#e8dfd0]">
        <h3
          className="text-[#3a3735] mb-6"
          style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem" }}
        >
          Sicherheitseinstellungen
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-[#e8dfd0]">
            <div>
              <p className="text-[#3a3735] mb-1">Passwort</p>
              <p className="text-[#5a524b] text-sm">
                Zuletzt vor 3 Monaten geändert
              </p>
            </div>
            <button className="text-[#3a3735] hover:text-[#c8a882] border border-[#3a3735] hover:border-[#c8a882] px-4 py-2 text-sm transition-colors">
              Passwort ändern
            </button>
          </div>

          <div className="flex items-center justify-between pb-6 border-b border-[#e8dfd0]">
            <div>
              <p className="text-[#3a3735] mb-1">
                Zwei-Faktor-Authentifizierung
              </p>
              <p className="text-[#5a524b] text-sm">
                Zusätzliche Sicherheitsebene hinzufügen
              </p>
            </div>
            <button className="bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-4 py-2 text-sm transition-colors">
              2FA aktivieren
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#3a3735]">Aktive Sitzungen</p>
              <button className="text-red-600 hover:text-red-700 text-sm">
                Von allen Geräten abmelden
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-[#f5f1ea]">
                <div>
                  <p className="text-[#3a3735] text-sm mb-1">Chrome on MacOS</p>
                  <p className="text-[#5a524b] text-xs">
                    Geneva, Switzerland • Current session
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs">
                  Aktiv
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#f5f1ea]">
                <div>
                  <p className="text-[#3a3735] text-sm mb-1">
                    Safari on iPhone
                  </p>
                  {/* <p className="text-[#5a524b] text-xs">Zurich, Switzerland • 2 days ago</p> */}
                </div>
                <button className="text-red-600 hover:text-red-700 text-xs">
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex items-center justify-end gap-4">
        <button className="text-[#5a524b] hover:text-[#3a3735] px-6 py-3 transition-colors">
          Abbrechen
        </button>
        <button className="bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-8 py-3 transition-colors tracking-wide shadow-md">
          Änderungen speichern
        </button>
      </div>
    </div>
  );
}
