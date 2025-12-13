import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Package } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { MOCK_SALES, MOCK_PRODUCE } from '../constants';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NeonCard accentColor="purple" className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-display">Today's Earnings</p>
            <h3 className="text-2xl font-mono text-white font-bold mt-1">₹4,250</h3>
            <span className="text-mintCyan text-xs flex items-center mt-2">
              <TrendingUp size={12} className="mr-1" /> +12% from yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-neonViolet/20 flex items-center justify-center text-neonViolet">
            <DollarSign size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="blue" className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-display">Total Sales (Kg)</p>
            <h3 className="text-2xl font-mono text-white font-bold mt-1">145 kg</h3>
            <span className="text-electricBlue text-xs flex items-center mt-2">
              <Package size={12} className="mr-1" /> 24 Transactions
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-electricBlue/20 flex items-center justify-center text-electricBlue">
            <TrendingUp size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="red" className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-display">Low Stock Alerts</p>
            <h3 className="text-2xl font-mono text-white font-bold mt-1">2 Items</h3>
            <span className="text-red-400 text-xs flex items-center mt-2">
              Restock needed soon
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <AlertCircle size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="green" className="flex items-center justify-between">
           <div>
            <p className="text-white/60 text-sm font-display">Market Trend</p>
            <h3 className="text-2xl font-mono text-white font-bold mt-1">Bullish</h3>
            <span className="text-mintCyan text-xs flex items-center mt-2">
              Onion prices up 15%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-mintCyan/20 flex items-center justify-center text-mintCyan">
            <TrendingUp size={24} />
          </div>
        </NeonCard>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeonCard className="lg:col-span-2 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display text-white">Weekly Revenue</h3>
            <select className="bg-white/10 border border-white/20 text-white text-sm rounded-lg p-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9A4DFF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9A4DFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A0B2E', border: '1px solid #9A4DFF', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#9A4DFF" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </NeonCard>

        {/* Live Inventory Snapshot */}
        <NeonCard className="h-[400px] overflow-hidden flex flex-col">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-display text-white">Stock Snapshot</h3>
            <span className="text-xs text-electricBlue cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {MOCK_PRODUCE.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <img src={item.image} alt={item.name_en} className="w-12 h-12 rounded-lg object-cover mr-4" />
                    <div className="flex-1">
                        <h4 className="text-white font-medium">{item.name_en}</h4>
                        <p className="text-white/50 text-xs">{item.stock} {item.unit} left</p>
                    </div>
                    <div className="text-right">
                        <p className="text-mintCyan font-mono">₹{item.price}</p>
                        <p className={`text-[10px] ${item.stock < 50 ? 'text-red-400' : 'text-green-400'}`}>
                            {item.stock < 50 ? 'Low Stock' : 'In Stock'}
                        </p>
                    </div>
                </div>
            ))}
          </div>
        </NeonCard>
      </div>

      <div className="text-center text-white/30 text-xs mt-8 pb-4">
        Data powered by MongoDB (Historical) & Firebase (Realtime)
      </div>
    </div>
  );
};

export default Dashboard;