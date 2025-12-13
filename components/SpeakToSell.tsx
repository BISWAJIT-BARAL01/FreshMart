import React, { useState } from 'react';
import { Mic, MicOff, Check, RotateCcw, Edit2, Save } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { parseVoiceSaleIntent } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface SpeakToSellProps {
  lang: Language;
}

const SpeakToSell: React.FC<SpeakToSellProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['en'];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = () => {
    setError(null);
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice not supported");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; // Better support for Hinglish if en-IN
    recognition.continuous = false; // Changed to false for better one-shot command stability
    recognition.interimResults = true; // Show what is being heard
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setParsedData(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setTranscript(finalTranscript);
          setIsListening(false);
          handleProcessing(finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
          setTranscript(interimTranscript);
        }
      }
    };

    recognition.onerror = (e: any) => {
      setIsListening(false);
      setError("Didn't catch that. Try again.");
    };
    recognition.onend = () => {
       if(isListening) setIsListening(false);
    };

    recognition.start();
  };

  const handleProcessing = async (text: string) => {
    setIsProcessing(true);
    const data = await parseVoiceSaleIntent(text);
    if (data && (data.item || data.price)) {
        setParsedData(data);
    } else {
        setError("Could not understand the sale details. Please try again or edit manually.");
        // Fallback to manual entry with empty data
        setParsedData({ item: '', quantity: 0, price: 0, unit: 'kg' });
        setIsEditing(true);
    }
    setIsProcessing(false);
  };

  const handleSave = () => {
      // Mock Save to DB
      alert("Sale Recorded Successfully!");
      setParsedData(null);
      setTranscript('');
      setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-display text-white mb-2">{t.speakToSell}</h2>
      <p className="text-white/60 mb-10 max-w-md">
        {t.voiceCommand}
      </p>

      {/* The Glowing Orb */}
      <div className="relative group mb-8">
        <div className={`absolute inset-0 bg-neonViolet rounded-full blur-3xl opacity-20 transition-opacity duration-500 ${isListening ? 'opacity-60 scale-150' : ''}`}></div>
        <button
          onClick={startListening}
          disabled={isProcessing}
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center border-4 
            transition-all duration-300
            ${isListening 
              ? 'border-neonViolet bg-neonViolet/20 shadow-[0_0_50px_rgba(154,77,255,0.5)] scale-110' 
              : 'border-white/20 bg-white/5 hover:border-electricBlue hover:shadow-[0_0_30px_rgba(0,163,255,0.3)]'}
          `}
        >
          {isProcessing ? (
             <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : isListening ? (
             <div className="flex gap-1 h-8 items-center">
                <div className="w-2 bg-white animate-pulse h-4"></div>
                <div className="w-2 bg-white animate-pulse h-8 animation-delay-75"></div>
                <div className="w-2 bg-white animate-pulse h-6 animation-delay-150"></div>
                <div className="w-2 bg-white animate-pulse h-8 animation-delay-75"></div>
                <div className="w-2 bg-white animate-pulse h-4"></div>
             </div>
          ) : (
            <Mic size={40} className="text-white" />
          )}
        </button>
      </div>

      <div className="w-full max-w-lg min-h-[100px]">
        {transcript && !parsedData && (
          <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
             <p className="text-lg text-white">"{transcript}"</p>
          </div>
        )}
        
        {error && (
            <div className="mb-6 p-3 rounded-lg bg-alertRed/10 border border-alertRed/30 text-alertRed text-sm">
                {error}
            </div>
        )}

        {parsedData && (
          <NeonCard accentColor="green" className="text-left relative">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-mintCyan">Confirm Sale</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="text-white/60 hover:text-white"><Edit2 size={18}/></button>}
             </div>
             
             <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-white/50 text-xs block mb-1">Item</label>
                    {isEditing ? (
                        <input className="bg-white/10 text-white rounded p-1 w-full" value={parsedData.item} onChange={e => setParsedData({...parsedData, item: e.target.value})} />
                    ) : (
                        <p className="text-xl text-white font-medium capitalize">{parsedData.item || 'Unknown'}</p>
                    )}
                </div>
                <div>
                     <label className="text-white/50 text-xs block mb-1">Quantity</label>
                    {isEditing ? (
                        <div className="flex gap-2">
                             <input type="number" className="bg-white/10 text-white rounded p-1 w-20" value={parsedData.quantity} onChange={e => setParsedData({...parsedData, quantity: Number(e.target.value)})} />
                             <select className="bg-white/10 text-white rounded p-1" value={parsedData.unit} onChange={e => setParsedData({...parsedData, unit: e.target.value})}>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="piece">pc</option>
                                <option value="dozen">doz</option>
                             </select>
                        </div>
                    ) : (
                        <p className="text-xl text-white font-medium">{parsedData.quantity} {parsedData.unit}</p>
                    )}
                </div>
                <div className="col-span-2 mt-2">
                     <label className="text-white/50 text-xs block mb-1">Total Price (₹)</label>
                    {isEditing ? (
                         <input type="number" className="bg-white/10 text-mintCyan font-bold text-2xl rounded p-1 w-full" value={parsedData.price} onChange={e => setParsedData({...parsedData, price: Number(e.target.value)})} />
                    ) : (
                        <p className="text-3xl text-mintCyan font-bold">₹{parsedData.price}</p>
                    )}
                </div>
             </div>

             <div className="flex gap-3">
               <button 
                 onClick={handleSave}
                 className="flex-1 bg-mintCyan text-black font-bold py-3 rounded-lg hover:bg-mintCyan/90 transition-colors flex justify-center items-center gap-2"
               >
                 <Check size={18} /> Confirm
               </button>
               <button 
                 onClick={() => { setParsedData(null); startListening(); }}
                 className="p-3 rounded-lg border border-white/20 text-white hover:bg-white/10"
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