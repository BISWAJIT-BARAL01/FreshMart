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
    const systemInstruction = `Extract sales data from the farmer's voice input. Input language may be mixed.
    Return strictly JSON. 
    Format: { "item": string, "quantity": number, "unit": string, "price": number, "confidence": "high" | "low" }.
    Translate item names to English standardized names (e.g., 'Kanda' -> 'Onion').
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