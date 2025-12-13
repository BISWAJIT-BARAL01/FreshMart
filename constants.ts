import { ProduceItem, Language } from './types';

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
];

export const MOCK_PRODUCE: ProduceItem[] = [
  {
    id: '1',
    name_en: 'Alphonso Mango',
    name_local: { hi: 'हापुस आम', mr: 'हापूस आंबा' },
    category: 'Fruit',
    unit: 'dozen',
    price: 800,
    stock: 45,
    image: 'https://picsum.photos/seed/mango/300/300'
  },
  {
    id: '2',
    name_en: 'Red Onion',
    name_local: { hi: 'लाल प्याज', mr: 'लाल कांदा' },
    category: 'Vegetable',
    unit: 'kg',
    price: 35,
    stock: 200,
    image: 'https://picsum.photos/seed/onion/300/300'
  },
  {
    id: '3',
    name_en: 'Tomato',
    name_local: { hi: 'टमाटर', mr: 'टोमॅटो' },
    category: 'Vegetable',
    unit: 'kg',
    price: 25,
    stock: 120,
    image: 'https://picsum.photos/seed/tomato/300/300'
  },
  {
    id: '4',
    name_en: 'Spinach',
    name_local: { hi: 'पालक', mr: 'पालक' },
    category: 'Vegetable',
    unit: 'piece',
    price: 15,
    stock: 50,
    image: 'https://picsum.photos/seed/spinach/300/300'
  },
  {
    id: '5',
    name_en: 'Banana',
    name_local: { hi: 'केला', mr: 'केळी' },
    category: 'Fruit',
    unit: 'dozen',
    price: 60,
    stock: 80,
    image: 'https://picsum.photos/seed/banana/300/300'
  }
];

export const MOCK_SALES = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 3800 },
  { day: 'Wed', sales: 5100 },
  { day: 'Thu', sales: 4800 },
  { day: 'Fri', sales: 6500 },
  { day: 'Sat', sales: 8200 },
  { day: 'Sun', sales: 7900 },
];

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    speakToSell: 'Speak to Sell',
    priceEstimator: 'Price Estimator',
    totalSales: 'Total Sales',
    lowStock: 'Low Stock Alerts',
    todayEarnings: 'Today\'s Earnings',
    weeklyTrend: 'Weekly Trend',
    voiceCommand: 'Tap microphone and say "Sold 2kg Onion for 70 rupees"',
    listening: 'Listening...',
    processing: 'Processing...',
    welcome: 'Welcome back,',
    farmer: 'Kisan Bhai',
    signIn: 'Sign In',
    otpSent: 'OTP Sent to',
    adminPanel: 'Admin Panel',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    inventory: 'स्टॉक',
    speakToSell: 'बोलकर बेचें',
    priceEstimator: 'मूल्य अनुमान',
    totalSales: 'कुल बिक्री',
    lowStock: 'कम स्टॉक चेतावनी',
    todayEarnings: 'आज की कमाई',
    weeklyTrend: 'साप्ताहिक रुझान',
    voiceCommand: 'माइक दबाएं और कहें "2 किलो प्याज 70 रुपये में बेचा"',
    listening: 'सुन रहा हूँ...',
    processing: 'प्रक्रिया जारी है...',
    welcome: 'स्वागत है,',
    farmer: 'किसान भाई',
    signIn: 'साइन इन करें',
    otpSent: 'OTP भेजा गया',
    adminPanel: 'एडमिन पैनल',
  }
  // Simplified for demo, in real app load JSONs
};