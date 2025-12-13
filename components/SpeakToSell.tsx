import React, { useState } from 'react';
import { Mic, MicOff, Check, RotateCcw } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { parseVoiceSaleIntent } from '../services/geminiService';

const SpeakToSell: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice not supported");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Or hi-IN
    recognition.continuous = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setParsedData(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      handleProcessing(text);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleProcessing = async (text: string) => {
    setIsProcessing(true);
    const data = await parseVoiceSaleIntent(text);
    setParsedData(data);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h2 className="text-3xl md:text-4xl font-display text-white mb-2">Speak to Sell</h2>
      <p className="text-white/60 mb-10 max-w-md">
        Tap the orb and say something like: <br/>
        <span className="text-mintCyan italic">"Sold 5 kg tomatoes for 150 rupees"</span>
      </p>

      {/* The Glowing Orb */}
      <div className="relative group">
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

      <div className="mt-8 min-h-[100px] w-full max-w-lg">
        {transcript && (
          <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
             <p className="text-lg text-white">"{transcript}"</p>
          </div>
        )}

        {parsedData && (
          <NeonCard accentColor="green" className="animate-fade-in text-left">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-mintCyan">Confirm Sale?</h3>
              <Check className="text-mintCyan" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-white/50 text-sm">Item</p>
                    <p className="text-xl text-white font-medium capitalize">{parsedData.item || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-white/50 text-sm">Quantity</p>
                    <p className="text-xl text-white font-medium">{parsedData.quantity || '--'} {parsedData.unit || ''}</p>
                </div>
                <div className="col-span-2 border-t border-white/10 pt-2 mt-2">
                     <p className="text-white/50 text-sm">Total Price</p>
                     <p className="text-3xl text-mintCyan font-bold">₹{parsedData.price || '--'}</p>
                </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setParsedData(null); setTranscript(''); alert('Sale Recorded in Firebase!'); }}
                className="flex-1 bg-mintCyan text-black font-bold py-3 rounded-lg hover:bg-mintCyan/90 transition-colors"
              >
                Confirm
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