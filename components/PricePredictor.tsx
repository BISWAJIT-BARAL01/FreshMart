import React, { useState } from 'react';
import NeonCard from './ui/NeonCard';
import { MOCK_PRODUCE, TRANSLATIONS } from '../constants';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Language } from '../types';

interface PricePredictorProps {
    lang: Language;
}

const PricePredictor: React.FC<PricePredictorProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['en'];
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const getPrediction = (item: any) => {
        // Mock logic for realistic feel
        const isLowStock = item.stock < 50;
        const demandFactor = item.category === 'Vegetable' ? 1.1 : 1.05; // Veggies fluctuating more
        const predictedPrice = Math.round(item.price * demandFactor + (isLowStock ? 5 : 0));
        
        return {
            price: predictedPrice,
            confidence: isLowStock ? 'High' : 'Medium',
            reason: isLowStock ? t.lowStockReason : t.highDemand,
            trend: 'up'
        };
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in">
             <h2 className="text-2xl font-display text-white mb-6">{t.pricePredictor}</h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List */}
                <div className="space-y-4">
                    {MOCK_PRODUCE.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedItem(item.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedItem === item.id ? 'bg-neonViolet/20 border-neonViolet' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                            <div className="flex items-center gap-4">
                                <img src={item.image} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                                <div>
                                    <h4 className="text-white font-bold">{item.name_en}</h4>
                                    <p className="text-white/40 text-xs">Current: ₹{item.price}</p>
                                </div>
                            </div>
                            <ArrowUpRightIcon trend="up" />
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                <div>
                    {selectedItem ? (
                        <PredictionCard item={MOCK_PRODUCE.find(i => i.id === selectedItem)!} t={t} logic={getPrediction} />
                    ) : (
                        <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl min-h-[300px]">
                            <p className="text-white/30">Select an item to see prediction</p>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

const PredictionCard = ({ item, t, logic }: any) => {
    const data = logic(item);
    return (
        <NeonCard accentColor="blue" className="h-full flex flex-col justify-center text-center p-8">
            <img src={item.image} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-white/10" />
            <h3 className="text-3xl text-white font-display mb-2">{item.name_en}</h3>
            
            <div className="my-6">
                <p className="text-white/50 text-sm uppercase tracking-widest mb-2">{t.predictedPrice}</p>
                <div className="text-5xl font-mono text-electricBlue font-bold flex justify-center items-center gap-2">
                    ₹{data.price}
                    <span className="text-lg bg-electricBlue/20 px-2 py-1 rounded text-electricBlue">
                        {data.price > item.price ? '+' : ''}{Math.round(((data.price - item.price)/item.price)*100)}%
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div>
                    <p className="text-white/50 text-xs">{t.confidence}</p>
                    <div className="flex justify-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${data.confidence === 'High' ? 'bg-safeGreen' : 'bg-white/20'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${data.confidence === 'High' || data.confidence === 'Medium' ? 'bg-safeGreen' : 'bg-white/20'}`}></div>
                        <div className="w-2 h-2 rounded-full bg-safeGreen"></div>
                    </div>
                </div>
                <div>
                     <p className="text-white/50 text-xs">{t.reason}</p>
                     <p className="text-white font-medium text-sm mt-1">{data.reason}</p>
                </div>
            </div>
        </NeonCard>
    )
}

const ArrowUpRightIcon = ({trend}: {trend: string}) => {
    if(trend === 'up') return <ArrowUp size={20} className="text-safeGreen" />
    if(trend === 'down') return <ArrowDown size={20} className="text-alertRed" />
    return <Minus size={20} className="text-warnYellow" />
}

export default PricePredictor;