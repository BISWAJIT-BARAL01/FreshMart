import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Check, RotateCcw, Edit2, Save, Activity } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { parseVoiceSaleIntent } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface SpeakToSellProps {
  lang: Language;
}

const SpeakToSell: React.FC<SpeakToSellProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['en'];
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Use Custom Hook
  const { 
    isListening, 
    transcript, 
    interimTranscript, 
    startListening, 
    stopListening,
    error: voiceError 
  } = useSpeechRecognition({
    silenceDuration: 2000, // Wait 2 seconds of silence before auto-processing
    onEnd: () => {
      // Trigger processing automatically when silence is detected
      if (transcript.length > 2) {
        handleProcessing(transcript);
      }
    }
  });

  const handleProcessing = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    setParseError(null);
    
    // Pass current language to AI for better regional parsing
    const data = await parseVoiceSaleIntent(text, lang);
    
    if (data && (data.item || data.price)) {
        setParsedData(data);
    } else {
        setParseError("Could not understand. Please try again or edit manually.");
        setParsedData({ item: '', quantity: 0, price: 0, unit: 'kg' });
        setIsEditing(true);
    }
    setIsProcessing(false);
  };

  const handleSave = () => {
      // Here you would push to backend
      alert(`Sale Recorded: ${parsedData.quantity}${parsedData.unit} ${parsedData.item} for ₹${parsedData.price}`);
      setParsedData(null);
      setIsEditing(false);
  };

  const toggleListening = () => {
      if (isListening) {
          stopListening();
          if (transcript) handleProcessing(transcript);
      } else {
          setParsedData(null);
          startListening();
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-display text-black mb-2">{t.speakToSell}</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        {t.voiceCommand}
      </p>

      {/* The Glowing Mic Orb */}
      <div className="relative group mb-8">
        <div className={`absolute inset-0 bg-neonViolet rounded-full blur-3xl opacity-20 transition-opacity duration-500 ${isListening ? 'opacity-60 scale-150' : ''}`}></div>
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center border-4 
            transition-all duration-300 shadow-2xl z-10
            ${isListening 
              ? 'border-neonViolet bg-neonViolet text-white scale-110' 
              : 'border-green-100 bg-white text-neonViolet hover:border-maroon hover:text-maroon'}
          `}
        >
          {isProcessing ? (
             <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : isListening ? (
             <div className="flex gap-1 h-10 items-center justify-center">
                 {/* Audio Wave Animation */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 bg-white rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}></div>
                ))}
             </div>
          ) : (
            <Mic size={40} className="fill-current" />
          )}
        </button>
      </div>

      <div className="w-full max-w-lg min-h-[120px]">
        {/* Real-time Transcript Feedback */}
        {(transcript || interimTranscript) && !parsedData && (
          <div className="mb-6 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm relative overflow-hidden">
             {isListening && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neonViolet to-green-300 animate-pulse"></div>}
             <p className="text-lg text-gray-500 font-medium">
                 {transcript} <span className="text-black">{interimTranscript}</span>
             </p>
             {isListening && <p className="text-xs text-neonViolet mt-2 font-bold animate-pulse">Listening & Filtering Noise...</p>}
          </div>
        )}
        
        {/* Error Messages */}
        {(voiceError || parseError) && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-maroon text-sm font-bold flex items-center justify-center gap-2">
                <Activity size={16}/> {voiceError || parseError}
            </div>
        )}

        {/* Parsed Result Card */}
        {parsedData && (
          <NeonCard accentColor="green" className="text-left relative border-green-200 animate-slide-up">
             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-neonViolet">Confirm Sale</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-black"><Edit2 size={18}/></button>}
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-gray-400 text-xs block mb-1">Item</label>
                    {isEditing ? (
                        <input className="bg-gray-50 border border-gray-200 text-black rounded p-2 w-full" value={parsedData.item} onChange={e => setParsedData({...parsedData, item: e.target.value})} />
                    ) : (
                        <p className="text-xl text-black font-medium capitalize">{parsedData.item || 'Unknown'}</p>
                    )}
                </div>
                <div>
                     <label className="text-gray-400 text-xs block mb-1">Quantity</label>
                    {isEditing ? (
                        <div className="flex gap-2">
                             <input type="number" className="bg-gray-50 border border-gray-200 text-black rounded p-2 w-20" value={parsedData.quantity} onChange={e => setParsedData({...parsedData, quantity: Number(e.target.value)})} />
                             <select className="bg-gray-50 border border-gray-200 text-black rounded p-2" value={parsedData.unit} onChange={e => setParsedData({...parsedData, unit: e.target.value})}>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="piece">pc</option>
                                <option value="dozen">doz</option>
                             </select>
                        </div>
                    ) : (
                        <p className="text-xl text-black font-medium">{parsedData.quantity} {parsedData.unit}</p>
                    )}
                </div>
                <div className="col-span-2 mt-2">
                     <label className="text-gray-400 text-xs block mb-1">Total Price (₹)</label>
                    {isEditing ? (
                         <input type="number" className="bg-green-50 text-neonViolet font-bold text-2xl rounded p-2 w-full border border-green-200" value={parsedData.price} onChange={e => setParsedData({...parsedData, price: Number(e.target.value)})} />
                    ) : (
                        <p className="text-3xl text-neonViolet font-bold">₹{parsedData.price}</p>
                    )}
                </div>
             </div>

             <div className="flex gap-3">
               <button 
                 onClick={handleSave}
                 className="flex-1 bg-neonViolet text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center gap-2 shadow-md"
               >
                 <Check size={18} /> Confirm
               </button>
               <button 
                 onClick={() => { setParsedData(null); startListening(); }}
                 className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-black"
               >
                 <RotateCcw size={20} />
               </button>
             </div>
          </NeonCard>
        )}
      </div>
    </div>
  );
};

export default SpeakToSell;