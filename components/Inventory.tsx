import React from 'react';
import NeonCard from './ui/NeonCard';
import SafeImage from './ui/SafeImage';
import { MOCK_PRODUCE, toLocalDigits } from '../constants';
import { Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Inventory: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display text-black">Inventory Stock</h2>
        <button className="flex items-center gap-2 bg-neonViolet px-4 py-2 rounded-lg text-white font-medium hover:bg-green-700 transition-all shadow-md">
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCE.map((item) => (
          <NeonCard key={item.id} accentColor="green" className="group relative overflow-hidden border border-gray-200 hover:border-green-300">
            <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
              <SafeImage 
                src={item.image} 
                alt={item.name_en} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            
            <h3 className="text-lg font-bold text-black">
                {language !== 'en' && item.name_local[language] ? item.name_local[language] : item.name_en}
            </h3>
            <p className="text-gray-500 text-sm mb-3 font-display">
                {language === 'en' ? (item.name_local['hi'] || '') : item.name_en}
            </p>

            <div className="flex justify-between items-end border-t border-gray-100 pt-3">
              <div>
                <p className="text-xs text-gray-400">Stock</p>
                <p className={`font-mono font-bold ${item.stock < 50 ? 'text-electricBlue' : 'text-black'}`}>
                  {toLocalDigits(item.stock, language)} {item.unit}
                </p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-gray-400">Price</p>
                 <p className="font-mono text-neonViolet font-bold">₹{toLocalDigits(item.price, language)}</p>
              </div>
            </div>
            
            {/* Quick Edit Overlay */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button className="bg-electricBlue text-white px-4 py-2 rounded-full text-sm font-bold w-32 shadow-lg">Update Stock</button>
                <button className="bg-white text-black border border-gray-200 px-4 py-2 rounded-full text-sm w-32 shadow-sm">Edit Price</button>
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );
};

export default Inventory;