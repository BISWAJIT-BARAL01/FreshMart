import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Package, ArrowUpRight, ArrowRight, ArrowUp } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { MOCK_SALES, MOCK_PRODUCE, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface DashboardProps {
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['en'];

  // Simplified Market Trend Logic for UI
  const marketTrend = 'good'; // 'good' | 'wait' | 'stable'

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NeonCard accentColor="purple" className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-display">{t.todayEarnings}</p>
            <h3 className="text-2xl font-mono text-white font-bold mt-1">₹4,250</h3>
            <span className="text-safeGreen text-xs flex items-center mt-2">
              <ArrowUpRight size={14} className="mr-1" /> +12%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-neonViolet/20 flex items-center justify-center text-neonViolet">
            <DollarSign size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="blue" className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-display">{t.totalSales}</p>
            <h3 className="text-2xl font-mono text-white font-bold mt-1">145 kg</h3>
            <span className="text-electricBlue text-xs flex items-center mt-2">
              <Package size={14} className="mr-1" /> 24 Orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-electricBlue/20 flex items-center justify-center text-electricBlue">
            <TrendingUp size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="red" className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-display">{t.lowStock}</p>
            <h3 className="text-2xl font-mono text-white font-bold mt-1">2 Items</h3>
            <span className="text-alertRed text-xs flex items-center mt-2">
              <AlertCircle size={14} className="mr-1" /> Restock Now
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-alertRed/20 flex items-center justify-center text-alertRed">
            <AlertCircle size={24} />
          </div>
        </NeonCard>

        {/* Improved Market Trend Card */}
        <NeonCard accentColor="green" className="flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-safeGreen/10 rounded-bl-full -mr-4 -mt-4"></div>
           <div>
            <p className="text-white/60 text-sm font-display">{t.marketTrend}</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-xl font-display text-white font-bold">
                {t.goodToSell}
              </h3>
            </div>
            <span className="text-safeGreen text-xs flex items-center mt-2 font-bold bg-safeGreen/10 px-2 py-1 rounded-full w-fit">
              <ArrowUp size={12} className="mr-1" /> High Demand
            </span>
          </div>
        </NeonCard>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeonCard className="lg:col-span-2 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display text-white">Revenue (₹)</h3>
            <select className="bg-white/10 border border-white/20 text-white text-sm rounded-lg p-2 outline-none">
              <option>7 Days</option>
              <option>30 Days</option>
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
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
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
            <h3 className="text-xl font-display text-white">{t.inventory}</h3>
            <span className="text-xs text-electricBlue cursor-pointer hover:underline">See All</span>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {MOCK_PRODUCE.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <img src={item.image} alt={item.name_en} className="w-12 h-12 rounded-lg object-cover mr-4" />
                    <div className="flex-1">
                        <h4 className="text-white font-medium">{item.name_en}</h4>
                        <p className="text-white/50 text-xs">{item.stock} {item.unit}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-mintCyan font-mono">₹{item.price}</p>
                        <p className={`text-[10px] font-bold ${item.stock < 50 ? 'text-alertRed' : 'text-safeGreen'}`}>
                            {item.stock < 50 ? 'Low' : 'OK'}
                        </p>
                    </div>
                </div>
            ))}
          </div>
        </NeonCard>
      </div>
    </div>
  );
};

export default Dashboard;