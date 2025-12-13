import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getGeminiResponse(input, "User is asking about market prices or inventory.");
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice not supported in this browser.");
      return;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Could default to hi-IN based on preference
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-neonViolet text-white shadow-[0_0_20px_rgba(154,77,255,0.6)] hover:scale-110 transition-all z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[500px] bg-deepPurple/95 backdrop-blur-xl border border-neonViolet/30 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-neonViolet/20 border-b border-neonViolet/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="font-display font-semibold text-white">Kisan Sahayak</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-white/50 mt-10">
                <p>Namaste! 🙏</p>
                <p className="text-sm">Ask me about market prices, weather, or your sales.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-electricBlue/20 border border-electricBlue/30 text-white rounded-br-none' 
                    : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
            <button 
              onClick={startListening}
              className={`p-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'} transition-colors`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30"
            />
            <button 
              onClick={handleSend}
              className="p-3 rounded-full bg-neonViolet/80 hover:bg-neonViolet text-white transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;