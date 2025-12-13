import React, { useState } from 'react';
import NeonCard from './ui/NeonCard';
import { MOCK_PRODUCE, TRANSLATIONS, toLocalDigits } from '../constants';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Language } from '../types';

interface PricePredictorProps {
    lang: Language;
}

const PricePredictor: React.FC<PricePredictorProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['en'];
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const getPrediction = (item: any) => {
        const isLowStock = item.stock < 50;
        const demandFactor = item.category === 'Vegetable' ? 1.1 : 1.05; 
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
             <h2 className="text-2xl font-display text-black mb-6">{t.pricePredictor}</h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List */}
                <div className="space-y-4">
                    {MOCK_PRODUCE.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedItem(item.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedItem === item.id ? 'bg-green-50 border-neonViolet' : 'bg-white border-gray-200 hover:border-green-300'}`}
                        >
                            <div className="flex items-center gap-4">
                                <img src={item.image} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                                <div>
                                    <h4 className="text-black font-bold">
                                         {lang !== 'en' && item.name_local[lang] ? item.name_local[lang] : item.name_en}
                                    </h4>
                                    <p className="text-gray-500 text-xs">Current: ₹{toLocalDigits(item.price, lang)}</p>
                                </div>
                            </div>
                            <ArrowUpRightIcon trend="up" />
                        </div>
                    ))}
                </div>

                {/* Detail View */}
                <div>
                    {selectedItem ? (
                        <PredictionCard item={MOCK_PRODUCE.find(i => i.id === selectedItem)!} t={t} logic={getPrediction} lang={lang} />
                    ) : (
                        <div className="h-full flex items-center justify-center border border-dashed border-gray-300 rounded-xl min-h-[300px] bg-gray-50">
                            <p className="text-gray-400">Select an item to see prediction</p>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

const PredictionCard = ({ item, t, logic, lang }: any) => {
    const data = logic(item);
    const itemName = lang !== 'en' && item.name_local[lang] ? item.name_local[lang] : item.name_en;

    return (
        <NeonCard accentColor="blue" className="h-full flex flex-col justify-center text-center p-8 bg-white border border-gray-200">
            <img src={item.image} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-green-50 shadow-md" />
            <h3 className="text-3xl text-black font-display mb-2">{itemName}</h3>
            
            <div className="my-6">
                <p className="text-maroon text-sm uppercase tracking-widest mb-2 font-bold">{t.predictedPrice}</p>
                <div className="text-5xl font-mono text-neonViolet font-bold flex justify-center items-center gap-2">
                    ₹{toLocalDigits(data.price, lang)}
                    <span className="text-lg bg-green-100 px-2 py-1 rounded text-green-800">
                        {data.price > item.price ? '+' : ''}{toLocalDigits(Math.round(((data.price - item.price)/item.price)*100), lang)}%
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase">{t.confidence}</p>
                    <div className="flex justify-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${data.confidence === 'High' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${data.confidence === 'High' || data.confidence === 'Medium' ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                </div>
                <div>
                     <p className="text-gray-400 text-xs font-bold uppercase">{t.reason}</p>
                     <p className="text-black font-medium text-sm mt-1">{data.reason}</p>
                </div>
            </div>
        </NeonCard>
    )
}

const ArrowUpRightIcon = ({trend}: {trend: string}) => {
    if(trend === 'up') return <ArrowUp size={20} className="text-neonViolet" />
    if(trend === 'down') return <ArrowDown size={20} className="text-maroon" />
    return <Minus size={20} className="text-yellow-500" />
}

export default PricePredictor;