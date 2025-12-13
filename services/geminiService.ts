import { GoogleGenAI } from "@google/genai";

// Securely access API Key
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (
  prompt: string, 
  context: string = '',
  language: string = 'en'
): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful AI assistant for 'FreshMart', an app for Indian farmers. 
    The user speaks language code: ${language}.
    
    CRITICAL: The user might speak in "Hinglish" (Hindi mixed with English) or local dialects. 
    Always interpret the *intent* of the query, even if the grammar is broken.
    
    Keep answers EXTREMELY short (max 2 sentences), simple, and encouraging. 
    Avoid technical jargon.
    Context: ${context}.
    If asked about prices, give approximate market rates in INR based on general Indian mandi trends.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    return response.text || "Sorry, I didn't catch that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Network issue. Please check internet.";
  }
};

export const parseVoiceSaleIntent = async (transcript: string): Promise<any> => {
   if (!apiKey) return null;
   
   try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an intelligent parser for an Indian farmer's produce app.
    The user will speak a sentence describing a sale. 
    The input might be in English, Hindi, or "Hinglish" (e.g., "Mera 50 kilo kanda bik gaya 20 rupay mein").
    
    Your Task:
    1. Correct any phonetic transcription errors (e.g., "Kanda" -> Onion, "Batata" -> Potato).
    2. Extract the following fields strictly as JSON:
       - "item": string (English name of the produce)
       - "quantity": number
       - "unit": string (default to 'kg' if not specified, handle 'dozen', 'quintal', 'peti')
       - "price": number (Total price. If rate is given, calculate total. e.g. 10kg at 5/kg = 50)
    
    Return ONLY JSON. No markdown.
    Format: { "item": string, "quantity": number, "unit": string, "price": number }.
    If specific fields are missing, set them to null.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: transcript,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Intent Error:", error);
    return null;
  }
}