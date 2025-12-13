export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu' | 'kn' | 'ml';

export interface ProduceItem {
  id: string;
  name_en: string;
  name_local: Record<string, string>;
  category: 'Fruit' | 'Vegetable';
  unit: 'kg' | 'piece' | 'dozen';
  price: number;
  stock: number;
  image: string;
}

export interface SaleRecord {
  id: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
  timestamp: Date;
  paymentMethod: 'CASH' | 'UPI';
}

export interface UserProfile {
  name: string;
  phone: string;
  language: Language;
  location: string;
  avatar: string;
  points: number;
  badges: string[];
}

export interface AppSettings {
  language: Language;
  theme: 'dark' | 'light';
  reduceMotion: boolean;
  notifications: boolean;
}

export enum AnalyticsSource {
  MONGO = 'MongoDB',
  FIREBASE = 'Firebase'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}