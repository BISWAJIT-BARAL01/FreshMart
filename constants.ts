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

// Optimized images for Indian produce
export const MOCK_PRODUCE: ProduceItem[] = [
  {
    id: '1',
    name_en: 'Alphonso Mango',
    name_local: { hi: 'हापुस आम', mr: 'हापूस आंबा' },
    category: 'Fruit',
    unit: 'dozen',
    price: 800,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80'
  },
  {
    id: '2',
    name_en: 'Red Onion',
    name_local: { hi: 'लाल प्याज', mr: 'लाल कांदा' },
    category: 'Vegetable',
    unit: 'kg',
    price: 35,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80'
  },
  {
    id: '3',
    name_en: 'Tomato',
    name_local: { hi: 'टमाटर', mr: 'टोमॅटो' },
    category: 'Vegetable',
    unit: 'kg',
    price: 25,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80'
  },
  {
    id: '4',
    name_en: 'Spinach',
    name_local: { hi: 'पालक', mr: 'पालक' },
    category: 'Vegetable',
    unit: 'piece',
    price: 15,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80'
  },
  {
    id: '5',
    name_en: 'Banana',
    name_local: { hi: 'केला', mr: 'केळी' },
    category: 'Fruit',
    unit: 'dozen',
    price: 60,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&q=80'
  },
  {
    id: '6',
    name_en: 'Potato',
    name_local: { hi: 'आलू', mr: 'बटाटा' },
    category: 'Vegetable',
    unit: 'kg',
    price: 20,
    stock: 300,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80'
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

// Simplified translations for farmers
export const TRANSLATIONS = {
  en: {
    appName: 'FreshMart',
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    speakToSell: 'Speak to Sell',
    pricePredictor: 'Price Predictor',
    profile: 'My Profile',
    settings: 'Settings',
    totalSales: 'Total Sales',
    lowStock: 'Low Stock',
    todayEarnings: 'Today\'s Earnings',
    marketTrend: 'Today\'s Market',
    goodToSell: 'Good to Sell',
    priceRising: 'Price Rising (Wait)',
    stable: 'Stable',
    voiceCommand: 'Tap mic & say "Sold 2kg Onion for 70 rupees"',
    listening: 'Listening...',
    processing: 'Processing...',
    welcome: 'Welcome,',
    farmer: 'Farmer',
    save: 'Save Changes',
    cancel: 'Cancel',
    language: 'Language',
    darkMode: 'Dark Mode',
    reduceMotion: 'Reduce Motion',
    editProfile: 'Edit Profile',
    predictedPrice: 'Suggested Price',
    confidence: 'Confidence',
    reason: 'Reason',
    highDemand: 'High Demand today',
    lowStockReason: 'Stock is low',
    marketUp: 'Market is up',
  },
  hi: {
    appName: 'FreshMart',
    dashboard: 'डैशबोर्ड',
    inventory: 'स्टॉक',
    speakToSell: 'बोलकर बेचें',
    pricePredictor: 'भाव अनुमान',
    profile: 'मेरी प्रोफाइल',
    settings: 'सेटिंग्स',
    totalSales: 'कुल बिक्री',
    lowStock: 'कम स्टॉक',
    todayEarnings: 'आज की कमाई',
    marketTrend: 'आज का बाज़ार',
    goodToSell: 'बेचने के लिए अच्छा',
    priceRising: 'भाव बढ़ रहे हैं (रुकें)',
    stable: 'स्थिर',
    voiceCommand: 'माइक दबाएं और कहें "2 किलो प्याज 70 रुपये में बेचा"',
    listening: 'सुन रहा हूँ...',
    processing: 'समझ रहा हूँ...',
    welcome: 'स्वागत है,',
    farmer: 'किसान भाई',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    reduceMotion: 'मोशन कम करें',
    editProfile: 'प्रोफाइल बदलें',
    predictedPrice: 'सुझाया गया भाव',
    confidence: 'भरोसा',
    reason: 'कारण',
    highDemand: 'आज मांग ज्यादा है',
    lowStockReason: 'स्टॉक कम है',
    marketUp: 'बाज़ार तेज़ है',
  }
};