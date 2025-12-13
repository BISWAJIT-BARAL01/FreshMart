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

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; 
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setParsedData(null);
    };

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
        setParsedData({ item: '', quantity: 0, price: 0, unit: 'kg' });
        setIsEditing(true);
    }
    setIsProcessing(false);
  };

  const handleSave = () => {
      alert("Sale Recorded Successfully!");
      setParsedData(null);
      setTranscript('');
      setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-display text-black mb-2">{t.speakToSell}</h2>
      <p className="text-gray-500 mb-10 max-w-md">
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
              ? 'border-neonViolet bg-neonViolet text-white shadow-xl scale-110' 
              : 'border-green-100 bg-white text-neonViolet hover:border-maroon hover:text-maroon'}
          `}
        >
          {isProcessing ? (
             <div className="w-10 h-10 border-4 border-gray-300 border-t-neonViolet rounded-full animate-spin"></div>
          ) : isListening ? (
             <div className="flex gap-1 h-8 items-center">
                <div className="w-2 bg-white animate-pulse h-4"></div>
                <div className="w-2 bg-white animate-pulse h-8 animation-delay-75"></div>
                <div className="w-2 bg-white animate-pulse h-6 animation-delay-150"></div>
                <div className="w-2 bg-white animate-pulse h-8 animation-delay-75"></div>
                <div className="w-2 bg-white animate-pulse h-4"></div>
             </div>
          ) : (
            <Mic size={40} className="fill-current" />
          )}
        </button>
      </div>

      <div className="w-full max-w-lg min-h-[100px]">
        {transcript && !parsedData && (
          <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
             <p className="text-lg text-black">"{transcript}"</p>
          </div>
        )}
        
        {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-maroon text-sm font-bold">
                {error}
            </div>
        )}

        {parsedData && (
          <NeonCard accentColor="green" className="text-left relative border-green-200">
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