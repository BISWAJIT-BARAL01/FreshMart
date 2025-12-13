import { ChatMessage } from '../types';

/**
 * Service to interact with the Node.js/Express + MongoDB Backend.
 * Uses a hybrid approach: tries to fetch from the server, 
 * falls back to LocalStorage if server is offline (for demo/offline usage).
 */

const API_BASE_URL = 'http://localhost:5000/api';

export const mongoService = {
  // Store Chat History
  async saveChatHistory(userId: string, messages: ChatMessage[]) {
    try {
        await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, messages })
        });
    } catch (e) {
        // Fallback
        console.warn("Server offline, saving to local storage");
        localStorage.setItem(`mongo_chat_${userId}`, JSON.stringify(messages));
    }
  },

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/chat/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        return await res.json();
    } catch (e) {
        // Fallback
        console.warn("Server offline, reading from local storage");
        const local = localStorage.getItem(`mongo_chat_${userId}`);
        return local ? JSON.parse(local) : [];
    }
  },

  // Store Market Price Trends
  async logMarketPrice(itemId: string, price: number, location: string) {
    try {
        await fetch(`${API_BASE_URL}/analytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'PRICE',
                itemId,
                price,
                location
            })
        });
    } catch (e) {
        console.warn("Server offline, skipping analytics log");
    }
  },

  // Store General Analytics Events
  async logEvent(eventName: string, data: any) {
    try {
        await fetch(`${API_BASE_URL}/analytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type: 'EVENT',
                name: eventName,
                data
            })
        });
    } catch (e) {
        console.warn("Server offline, skipping event log");
    }
  }
};