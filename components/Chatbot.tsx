import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, AlertCircle, Volume2, StopCircle } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { mongoService } from '../services/mongoService';
import { ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Hook integration
  const { 
    isListening, 
    transcript, 
    interimTranscript, 
    startListening, 
    stopListening,
    error: voiceError
  } = useSpeechRecognition({
    silenceDuration: 3000, 
    onEnd: () => {
       // Optional: Auto-send could go here, but manual send is safer for chat
    }
  });

  // Sync voice transcript with input field cleanly
  useEffect(() => {
    if (transcript || interimTranscript) {
        // Only update if we have actual content to avoid jitter
        const cleanText = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();
        if (cleanText) setInput(cleanText);
    }
  }, [transcript, interimTranscript]);

  useEffect(() => {
      if (isOpen && user) {
          mongoService.getChatHistory(user.uid).then(history => {
              if (history && history.length > 0) setMessages(history);
          });
      }
  }, [isOpen, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0 && user) {
        mongoService.saveChatHistory(user.uid, messages);
    }
  }, [messages, user]);

  // Text to Speech Functionality
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to set voice based on language
      // This maps 'hi' -> 'hi-IN', 'en' -> 'en-IN' etc.
      const langCode = language === 'en' ? 'en-IN' : `${language}-IN`;
      utterance.lang = langCode;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (isListening) stopListening();

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
      const responseText = await getGeminiResponse(input, "User is asking about market prices or inventory.", language);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      // Optional: Auto-speak response
      // speakText(responseText); 
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-neonViolet text-white shadow-lg hover:bg-green-700 transition-all z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans">
          
          <div className="p-4 bg-neonViolet text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-200 animate-pulse"></div>
              <span className="font-display font-semibold tracking-wide">Kisan Sahayak</span>
            </div>
            <div className="flex items-center gap-3">
                 {isSpeaking && (
                    <button onClick={stopSpeaking} className="text-white hover:text-red-200 animate-pulse">
                        <StopCircle size={20} />
                    </button>
                 )}
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                    <X size={20} />
                </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <p className="text-xl mb-2">Namaste! 🙏</p>
                <p className="text-sm">Ask me about market prices, weather, or your sales.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm relative group ${
                  msg.role === 'user' 
                    ? 'bg-electricBlue text-white rounded-br-none' 
                    : 'bg-white text-black border border-gray-200 rounded-bl-none'
                }`}>
                  {msg.text}
                  
                  {/* TTS Button for AI messages */}
                  {msg.role === 'model' && (
                      <button 
                        onClick={() => speakText(msg.text)}
                        className="absolute -right-8 top-2 p-1 text-gray-400 hover:text-neonViolet opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Read Aloud"
                      >
                          <Volume2 size={16} />
                      </button>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {voiceError && (
              <div className="px-4 py-2 bg-red-50 text-maroon text-xs border-t border-red-100 flex items-center gap-2">
                  <AlertCircle size={12} /> {voiceError}
              </div>
          )}

          <div className="p-3 border-t border-gray-200 bg-white flex gap-2 items-end">
            <button 
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                  isListening 
                  ? 'bg-red-50 text-maroon animate-pulse border border-red-200 shadow-inner' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 flex items-center px-3 py-2 focus-within:ring-1 focus-within:ring-neonViolet/50 focus-within:border-neonViolet transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => { 
                      setInput(e.target.value);
                      if (isListening) stopListening();
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? "Listening..." : "Type or speak..."}
                  className="w-full bg-transparent border-none outline-none text-black placeholder-gray-400 text-sm"
                />
            </div>

            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-full text-white transition-all flex-shrink-0 ${
                  input.trim() 
                  ? 'bg-neonViolet hover:bg-green-700 shadow-md' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
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