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

  // Update Language dynamically
  useEffect(() => {
    if (recognitionRef.current) {
        // Map app languages to specific speech locales
        // 'en-IN' is excellent for Hinglish (Hindi mixed with English)
        const langMap: Record<string, string> = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'mr': 'mr-IN',
            'bn': 'bn-IN',
            'gu': 'gu-IN', 
            'ta': 'ta-IN',
            'te': 'te-IN',
            'kn': 'kn-IN',
            'ml': 'ml-IN',
            'pa': 'pa-IN',
            'or': 'or-IN'
        };
        recognitionRef.current.lang = langMap[language] || 'en-IN';
    }
  }, [language]);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        if (onEnd) onEnd();
      }
    }, silenceDuration);
  }, [onEnd, silenceDuration]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (e) {
      // If already started, just reset
      console.warn("Recognition already started");
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
            const newTx = prev + ' ' + finalTx;
            if (onResult) onResult(newTx.trim());
            return newTx.trim();
        });
      }
      setInterimTranscript(interimTx);
    };

    recognitionRef.current.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Ignore simple no-speech errors, just wait
        return; 
      }
      console.error("Speech Error:", event.error);
      setIsListening(false);
      setError("Microphone error. Please retry.");
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    recognitionRef.current.onend = () => {
       // Only update state if we didn't manually stop it logic inside silence timer handles logic
       if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
       setIsListening(false);
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