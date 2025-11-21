import { MessageSquare, TrendingUp, Eye, Users, BarChart3 } from 'lucide-react';

const messages = [
  {
    id: 1,
    subject: "Shipping inquiry for Ferrari 250 GTO",
    preview: "Hello, I would like to know more about the shipping options...",
    date: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    subject: "Payment confirmation needed",
    preview: "Your payment has been received. Please confirm delivery address...",
    date: "1 day ago",
    unread: true
  },
  {
    id: 3,
    subject: "Listing approval - Patek Philippe",
    preview: "Your listing has been approved and is now live on the marketplace...",
    date: "3 days ago",
    unread: false
  }
];

export function MessagesAndAnalytics() {
  return (
    <div className="space-y-12">
      {/* Messages & Support */}
      <div>
        <h2 
          className="text-[#3a3735] mb-8"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
        >
          Messages & Support
        </h2>

        <div className="bg-white shadow-md border border-[#e8dfd0]">
          <div className="p-6 border-b border-[#e8dfd0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#c8a882]" strokeWidth={1.5} />
              <h3 className="text-[#3a3735]">Admin Support Inbox</h3>
              <span className="px-3 py-1 bg-[#c8a882] text-[#3a3735] text-xs tracking-wider">
                2 Unread
              </span>
            </div>
            <button className="bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] px-4 py-2 text-sm transition-colors">
              New Ticket
            </button>
          </div>

          <div className="divide-y divide-[#e8dfd0]">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`p-6 hover:bg-[#faf8f4] transition-colors cursor-pointer ${
                  message.unread ? 'bg-[#f5f1ea]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`text-[#3a3735] ${message.unread ? '' : 'opacity-75'}`}>
                    {message.subject}
                  </h4>
                  <span className="text-[#5a524b] text-sm">{message.date}</span>
                </div>
                <p className={`text-[#5a524b] text-sm ${message.unread ? '' : 'opacity-75'}`}>
                  {message.preview}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics & Insights */}
      <div>
        <h2 
          className="text-[#3a3735] mb-8"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
        >
          Analytics & Insights
        </h2>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 shadow-md border border-[#e8dfd0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f5f1ea] flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#c8a882]" strokeWidth={1.5} />
              </div>
              <p className="text-[#5a524b] text-sm">Total Views</p>
            </div>
            <p 
              className="text-[#3a3735] mb-2"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
            >
              12,847
            </p>
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
              <span>+23% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 shadow-md border border-[#e8dfd0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f5f1ea] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#c8a882]" strokeWidth={1.5} />
              </div>
              <p className="text-[#5a524b] text-sm">Unique Visitors</p>
            </div>
            <p 
              className="text-[#3a3735] mb-2"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
            >
              3,542
            </p>
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
              <span>+18% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 shadow-md border border-[#e8dfd0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f5f1ea] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#c8a882]" strokeWidth={1.5} />
              </div>
              <p className="text-[#5a524b] text-sm">Conversion Rate</p>
            </div>
            <p 
              className="text-[#3a3735] mb-2"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}
            >
              8.4%
            </p>
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
              <span>+2.1% from last month</span>
            </div>
          </div>
        </div>

        {/* Views Over Time Graph Placeholder */}
        <div className="bg-white p-8 shadow-md border border-[#e8dfd0] mb-6">
          <h3 
            className="text-[#3a3735] mb-6"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}
          >
            Views Over Time
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 62, 58, 71, 83, 76, 92, 88, 95, 103, 98, 112].map((height, index) => (
              <div 
                key={index}
                className="flex-1 bg-gradient-to-t from-[#c8a882] to-[#c8a882]/60 hover:from-[#3a3735] hover:to-[#5a524b] transition-all cursor-pointer"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-[#5a524b]">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Best Performing Categories */}
        <div className="bg-white p-8 shadow-md border border-[#e8dfd0]">
          <h3 
            className="text-[#3a3735] mb-6"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}
          >
            Best Performing Categories
          </h3>
          <div className="space-y-4">
            {[
              { category: 'Watches & Timepieces', sales: 8, revenue: 342500, percentage: 85 },
              { category: 'Fine Art', sales: 3, revenue: 892000, percentage: 72 },
              { category: 'Jewelry & Gems', sales: 12, revenue: 186400, percentage: 68 },
              { category: 'Furniture & Design', sales: 5, revenue: 48200, percentage: 45 }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#3a3735]">{item.category}</span>
                      <span className="text-[#5a524b] text-sm">{item.sales} sales</span>
                    </div>
                    <div className="w-full bg-[#e8dfd0] h-2">
                      <div 
                        className="bg-[#c8a882] h-2 transition-all"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-[#c8a882] ml-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
