import { Wallet, TrendingUp, TrendingDown, Plus, ArrowUpRight, Search, Filter } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'Kauf' | 'Verkauf' | 'Boost' | 'Rückerstattung' | 'Auszahlung';
  amount: number;
  date: string;
  status: 'Abgeschlossen' | 'Ausstehend' | 'Fehlgeschlagen';
  description: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    type: 'Verkauf',
    amount: 52000,
    date: '2025-01-15',
    status: 'Abgeschlossen',
    description: 'Château Margaux 1900 sold'
  },
  {
    id: 2,
    type: 'Kauf',
    amount: -780000,
    date: '2025-01-14',
    status: 'Abgeschlossen',
    description: 'Post-Impressionist Landscape'
  },
  {
    id: 3,
    type: 'Boost',
    amount: -250,
    date: '2025-01-13',
    status: 'Abgeschlossen',
    description: 'Listing promotion - Patek Philippe'
  },
  {
    id: 4,
    type: 'Verkauf',
    amount: 18500,
    date: '2025-01-12',
    status: 'Abgeschlossen',
    description: 'Eames Lounge Chair 1956'
  },
  {
    id: 5,
    type: 'Auszahlung',
    amount: -25000,
    date: '2025-01-10',
    status: 'Ausstehend',
    description: 'Bank transfer to **** 4532'
  },
  {
    id: 6,
    type: 'Rückerstattung',
    amount: 3500,
    date: '2025-01-08',
    status: 'Abgeschlossen',
    description: 'Cancelled auction refund'
  }
];

const typeColors = {
  Kauf: 'text-red-600',
  Verkauf: 'text-green-600',
  Boost: 'text-purple-600',
  Rückerstattung: 'text-blue-600',
  Auszahlung: 'text-orange-600'
};

const typeIcons = {
  Kauf: <TrendingDown className="w-4 h-4" strokeWidth={1.5} />,
  Verkauf: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
  Boost: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
  Rückerstattung: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />,
  Auszahlung: <TrendingDown className="w-4 h-4" strokeWidth={1.5} />
};

export function WalletAndTransactions() {
  return (
    <div className="mb-12">
      <h2
        className="text-[#3a3735] mb-8"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
      >
        Wallet & Transaktionen
      </h2>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#3a3735] to-[#5a524b] p-8 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6" strokeWidth={1.5} />
            <p className="text-sm opacity-90">Verfügbares Guthaben</p>
          </div>
          <p
            className="mb-2"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem' }}
          >
            $45,230
          </p>
          <p className="text-xs opacity-75">Sofort nutzbar oder auszahlbar</p>
        </div>

        <div className="bg-white p-8 shadow-md border border-[#e8dfd0]">
          <p className="text-[#5a524b] text-sm mb-4">Ausstehendes Guthaben</p>
          <p
            className="text-[#c8a882] mb-2"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
          >
            $12,450
          </p>
          <p className="text-xs text-[#5a524b]">Aus aktuellen Verkäufen</p>
        </div>

        <div className="bg-white p-8 shadow-md border border-[#e8dfd0]">
          <p className="text-[#5a524b] text-sm mb-4">Gesamteinnahmen</p>
          <p
            className="text-green-600 mb-2"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
          >
            $234,680
          </p>
          <p className="text-xs text-[#5a524b]">Einnahmen gesamt</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <button className="flex items-center gap-2 bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-6 py-3 transition-colors tracking-wide">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Guthaben hinzufügen
        </button>
        <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] border border-[#3a3735] hover:border-[#c8a882] px-6 py-3 transition-colors tracking-wide">
          <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
          Auf Bankkonto auszahlen
        </button>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-[#3a3735]"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}
          >
            Transaktionsverlauf
          </h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a524b]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Transaktionen suchen..."
                className="pl-10 pr-4 py-2 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm placeholder:text-[#5a524b]/60 focus:outline-none focus:border-[#c8a882]"
              />
            </div>
            <button className="flex items-center gap-2 text-[#3a3735] hover:text-[#c8a882] border border-[#3a3735] hover:border-[#c8a882] px-4 py-2 text-sm transition-colors">
              <Filter className="w-4 h-4" strokeWidth={1.5} />
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md border border-[#e8dfd0]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f5f1ea] border-b border-[#d4cec4]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs tracking-wider text-[#5a524b] uppercase">Typ</th>
                  <th className="px-6 py-4 text-left text-xs tracking-wider text-[#5a524b] uppercase">Beschreibung</th>
                  <th className="px-6 py-4 text-left text-xs tracking-wider text-[#5a524b] uppercase">Datum</th>
                  <th className="px-6 py-4 text-left text-xs tracking-wider text-[#5a524b] uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs tracking-wider text-[#5a524b] uppercase">Betrag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfd0]">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-[#faf8f4] transition-colors">
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${typeColors[transaction.type]}`}>
                        {typeIcons[transaction.type]}
                        <span className="text-sm">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3a3735]">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm text-[#5a524b]">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs ${transaction.status === 'Abgeschlossen' ? 'bg-green-50 text-green-700' :
                          transaction.status === 'Ausstehend' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                        }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span style={{ fontFamily: 'Playfair Display, serif' }}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
