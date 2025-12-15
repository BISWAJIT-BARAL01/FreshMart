import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface UseSpeechRecognitionProps {
  onResult?: (text: string) => void;
  onEnd?: () => void;
  silenceDuration?: number; // Time in ms to wait before auto-stopping
}

export const useSpeechRecognition = ({ 
  onResult, 
  onEnd, 
  silenceDuration = 2500 
}: UseSpeechRecognitionProps = {}) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  // Initialize Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Browser does not support voice recognition.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configuration for robustness
    recognition.continuous = true; // Keep listening even after pauses
    recognition.interimResults = true; // Show text while speaking
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Force Auto Fix: Sync Language Dialect
  useEffect(() => {
    if (recognitionRef.current) {
        // Precise Regional Mapping for Indian Context
        const langMap: Record<string, string> = {
            'en': 'en-IN', // Indian English
            'hi': 'hi-IN', // Hindi
            'mr': 'mr-IN', // Marathi
            'bn': 'bn-IN', // Bengali
            'gu': 'gu-IN', // Gujarati
            'ta': 'ta-IN', // Tamil
            'te': 'te-IN', // Telugu
            'kn': 'kn-IN', // Kannada
            'ml': 'ml-IN', // Malayalam
            'pa': 'pa-IN', // Punjabi
            'or': 'or-IN'  // Odia
        };
        const targetLang = langMap[language] || 'en-IN';
        console.log(`Setting Speech Recognition Language to: ${targetLang}`);
        recognitionRef.current.lang = targetLang;
    }
  }, [language]);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        console.log("Silence detected. Stopping recognition.");
        recognitionRef.current.stop();
        // State update handled in onend
      }
    }, silenceDuration);
  }, [isListening, silenceDuration]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn("Recognition already started, continuing...");
    }

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      resetSilenceTimer();
    };

    recognitionRef.current.onresult = (event: any) => {
      resetSilenceTimer(); // User is speaking, reset silence timer

      let finalTx = '';
      let interimTx = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTx += event.results[i][0].transcript;
        } else {
          interimTx += event.results[i][0].transcript;
        }
      }

      if (finalTx) {
        setTranscript(prev => {
            const newTx = (prev + ' ' + finalTx).trim();
            if (onResult) onResult(newTx);
            return newTx;
        });
      }
      setInterimTranscript(interimTx);
    };

    recognitionRef.current.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        return; // Ignore
      }
      console.error("Speech Error:", event.error);
      
      let msg = "Microphone error. Please retry.";
      if (event.error === 'network') msg = "Network Error: Check internet connection.";
      if (event.error === 'not-allowed') msg = "Microphone blocked. Check permissions.";
      if (event.error === 'language-not-supported') msg = "Language not supported by browser.";

      setError(msg);
      // We don't stop strictly on error unless it's fatal, 
      // but usually the browser stops itself.
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
       if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
       setIsListening(false);
       if (onEnd) onEnd();
    };

  }, [onResult, onEnd, resetSilenceTimer]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error
  };
};