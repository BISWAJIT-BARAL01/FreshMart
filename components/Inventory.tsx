import React from 'react';
import NeonCard from './ui/NeonCard';
import { MOCK_PRODUCE } from '../constants';
import { Plus } from 'lucide-react';

const Inventory: React.FC = () => {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display text-white">Inventory Stock</h2>
        <button className="flex items-center gap-2 bg-neonViolet px-4 py-2 rounded-lg text-white font-medium hover:bg-neonViolet/80 transition-all">
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCE.map((item) => (
          <NeonCard key={item.id} accentColor="purple" className="group relative overflow-hidden">
            <div className="aspect-square mb-4 overflow-hidden rounded-lg">
              <img 
                src={item.image} 
                alt={item.name_en} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                loading="lazy"
              />
            </div>
            
            <h3 className="text-lg font-bold text-white">{item.name_en}</h3>
            <p className="text-white/50 text-sm mb-3 font-display">
                {item.name_local['hi'] || ''} / {item.name_local['mr'] || ''}
            </p>

            <div className="flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <p className="text-xs text-white/40">Stock</p>
                <p className={`font-mono font-bold ${item.stock < 50 ? 'text-red-400' : 'text-white'}`}>
                  {item.stock} {item.unit}
                </p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-white/40">Price</p>
                 <p className="font-mono text-mintCyan font-bold">₹{item.price}</p>
              </div>
            </div>
            
            {/* Quick Edit Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button className="bg-electricBlue text-black px-4 py-2 rounded-full text-sm font-bold w-32">Update Stock</button>
                <button className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full text-sm w-32">Edit Price</button>
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );
};

export default Inventory;