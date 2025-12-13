export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu' | 'kn' | 'ml' | 'pa' | 'or';

export type Theme = 'light' | 'dark';

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
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  photoURL: string;
  language: Language;
  themePreference: Theme;
  location: string;
  points: number;
  badges: string[];
  upiId?: string;
  createdAt: string;
}

export interface AppSettings {
  language: Language;
  theme: Theme;
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