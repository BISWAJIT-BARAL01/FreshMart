import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, DollarSign, Package, ArrowUpRight, ArrowUp } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { MOCK_SALES, MOCK_PRODUCE, getTranslation, toLocalDigits } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { language } = useLanguage();
  const { userProfile } = useAuth();
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="flex items-center gap-4 mb-4">
         <img src={userProfile?.photoURL || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-full border-2 border-green-200 object-cover" />
         <div>
            <h2 className="text-2xl font-display font-bold text-black">{t('welcome')} {userProfile?.name}</h2>
            <p className="text-gray-600 text-sm">Here is what's happening in your mandi today.</p>
         </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NeonCard accentColor="green" className="flex items-center justify-between bg-white border-green-100">
          <div>
            <p className="text-gray-500 text-sm font-display">{t('todayEarnings')}</p>
            <h3 className="text-2xl font-mono text-black font-bold mt-1">₹{toLocalDigits(4250, language)}</h3>
            <span className="text-neonViolet text-xs flex items-center mt-2">
              <ArrowUpRight size={14} className="mr-1" /> +{toLocalDigits(12, language)}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-neonViolet">
            <DollarSign size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="blue" className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-display">{t('totalSales')}</p>
            <h3 className="text-2xl font-mono text-black font-bold mt-1">{toLocalDigits(145, language)} kg</h3>
            <span className="text-electricBlue text-xs flex items-center mt-2">
              <Package size={14} className="mr-1" /> {toLocalDigits(24, language)} Orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-electricBlue">
            <TrendingUp size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="red" className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-display">{t('lowStock')}</p>
            <h3 className="text-2xl font-mono text-black font-bold mt-1">{toLocalDigits(2, language)} Items</h3>
            <span className="text-electricBlue text-xs flex items-center mt-2">
              <AlertCircle size={14} className="mr-1" /> Restock Now
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-electricBlue">
            <AlertCircle size={24} />
          </div>
        </NeonCard>

        <NeonCard accentColor="green" className="flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -mr-4 -mt-4"></div>
           <div>
            <p className="text-gray-500 text-sm font-display">{t('marketTrend')}</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-xl font-display text-black font-bold">
                {t('goodToSell')}
              </h3>
            </div>
            <span className="text-neonViolet text-xs flex items-center mt-2 font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
              <ArrowUp size={12} className="mr-1" /> {t('highDemand')}
            </span>
          </div>
        </NeonCard>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeonCard className="lg:col-span-2 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-display text-black">Revenue (₹)</h3>
            <select className="bg-gray-50 border border-gray-200 text-black text-sm rounded-lg p-2 outline-none">
              <option>{toLocalDigits(7, language)} Days</option>
              <option>{toLocalDigits(30, language)} Days</option>
            </select>
          </div>
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SALES}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => toLocalDigits(val, language)} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #2E7D32', borderRadius: '8px', color: '#000' }}
                  itemStyle={{ color: '#2E7D32' }}
                  formatter={(value) => [`₹${toLocalDigits(Number(value), language)}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </NeonCard>

        {/* Live Inventory Snapshot */}
        <NeonCard className="h-[400px] overflow-hidden flex flex-col">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-display text-black">{t('inventory')}</h3>
            <span className="text-xs text-electricBlue cursor-pointer hover:underline font-bold">See All</span>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {MOCK_PRODUCE.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-green-100">
                    <img src={item.image} alt={item.name_en} className="w-12 h-12 rounded-lg object-cover mr-4" />
                    <div className="flex-1">
                        <h4 className="text-black font-medium">
                          {language !== 'en' && item.name_local[language] ? item.name_local[language] : item.name_en}
                        </h4>
                        <p className="text-gray-500 text-xs">{toLocalDigits(item.stock, language)} {item.unit}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-neonViolet font-mono font-bold">₹{toLocalDigits(item.price, language)}</p>
                        <p className={`text-[10px] font-bold ${item.stock < 50 ? 'text-electricBlue' : 'text-neonViolet'}`}>
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