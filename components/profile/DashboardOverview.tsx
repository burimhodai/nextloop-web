import { Package, Gavel, Wallet, Activity } from 'lucide-react';

const stats = [
  {
    label: "Total Listings",
    value: "24",
    icon: <Package className="w-6 h-6" strokeWidth={1.5} />,
    change: "+3 this month"
  },
  {
    label: "Active Bids",
    value: "12",
    icon: <Gavel className="w-6 h-6" strokeWidth={1.5} />,
    change: "5 leading"
  },
  {
    label: "Account Balance",
    value: "$45,230",
    icon: <Wallet className="w-6 h-6" strokeWidth={1.5} />,
    change: "+$12,450 this month"
  },
  {
    label: "Recent Activity",
    value: "8",
    icon: <Activity className="w-6 h-6" strokeWidth={1.5} />,
    change: "Last 7 days"
  }
];

export function DashboardOverview() {
  return (
    <div className="mb-12">
      <h2 
        className="text-[#3a3735] mb-8"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
      >
        Dashboard Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-[#c8a882]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#f5f1ea] flex items-center justify-center text-[#c8a882]">
                {stat.icon}
              </div>
            </div>
            <p className="text-[#5a524b] text-sm mb-2">{stat.label}</p>
            <p 
              className="text-[#3a3735] mb-2"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
            >
              {stat.value}
            </p>
            <p className="text-[#c8a882] text-xs">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
