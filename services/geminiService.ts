import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || 'dummy-key'; // In real app, from env
const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (
  prompt: string, 
  context: string = '',
  language: string = 'en'
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful AI assistant for an Indian farmer using the 'Kisan Smart Mart' app. 
    The user speaks ${language}. 
    Keep answers short, simple, and encouraging. 
    Context: ${context}.
    If asked about prices, give approximate market rates in INR.
    If asked about farming tips, give brief advice suitable for Indian climate.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    return response.text || "Sorry, I couldn't understand that. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Network error. Please check your connection.";
  }
};

export const parseVoiceSaleIntent = async (transcript: string): Promise<any> => {
   try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Extract sales data from the farmer's voice input. 
    Return strictly JSON. 
    Format: { "item": string, "quantity": number, "unit": string, "price": number }.
    If missing info, try to guess or return null for that field.
    Translate item names to English if they are in Hindi/local language.
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