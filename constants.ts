
import { ProduceItem, Language } from './types';

// Pointing to relative path for PHP API
export const API_BASE_URL = '/api';

export const SUPPORTED_LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
];

// Helper to convert English numbers to Local Digits
const DIGIT_MAPS: Record<string, string[]> = {
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  gu: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'],
  ta: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'],
  te: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'], // Fallback or specific
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
  ml: ['൦', '൧', '൨', '൩', '൪', '൫', '൬', '௭', '൮', '൯'],
  pa: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'],
  or: ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'],
};

export const toLocalDigits = (num: number | string, lang: string): string => {
  const str = num.toString();
  const digits = DIGIT_MAPS[lang];
  if (!digits || lang === 'en') return str;

  return str.replace(/[0-9]/g, (d) => digits[parseInt(d)]);
};

export const MOCK_PRODUCE: ProduceItem[] = [
  {
    id: '1',
    name_en: 'Alphonso Mango',
    name_local: { hi: 'हापुस आम', mr: 'हापूस आंबा', bn: 'আলফোনসো আম', gu: 'હાફૂસ કેરી' },
    category: 'Fruit',
    unit: 'dozen',
    price: 800,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80'
  },
  {
    id: '2',
    name_en: 'Red Onion',
    name_local: { hi: 'लाल प्याज', mr: 'लाल कांदा', bn: 'লাল পেঁয়াজ', gu: 'લાલ ડુંગળી' },
    category: 'Vegetable',
    unit: 'kg',
    price: 35,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80'
  },
  {
    id: '3',
    name_en: 'Tomato',
    name_local: { hi: 'टमाटर', mr: 'टोमॅटो', bn: 'টমেটো', gu: 'ટામેટા' },
    category: 'Vegetable',
    unit: 'kg',
    price: 25,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80'
  },
  {
    id: '4',
    name_en: 'Spinach',
    name_local: { hi: 'पालक', mr: 'पालक', bn: 'শাক', gu: 'પાલક' },
    category: 'Vegetable',
    unit: 'piece',
    price: 15,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80'
  },
  {
    id: '5',
    name_en: 'Banana',
    name_local: { hi: 'केला', mr: 'केळी', bn: 'কলা', gu: 'કેળા' },
    category: 'Fruit',
    unit: 'dozen',
    price: 60,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&q=80'
  },
  {
    id: '6',
    name_en: 'Potato',
    name_local: { hi: 'आलू', mr: 'बटाटा', bn: 'আলু', gu: 'બટાકા' },
    category: 'Vegetable',
    unit: 'kg',
    price: 20,
    stock: 500,
    image: 'https://images.unsplash.com/photo-1518977676651-71f6480aeef9?w=300&q=80'
  },
  {
    id: '7',
    name_en: 'Cauliflower',
    name_local: { hi: 'गोभी', mr: 'फ्लॉवर', bn: 'ফুলকপি', gu: 'ફૂલકોબી' },
    category: 'Vegetable',
    unit: 'piece',
    price: 40,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3d05?w=300&q=80'
  },
  {
    id: '8',
    name_en: 'Brinjal',
    name_local: { hi: 'बैंगन', mr: 'वांगी', bn: 'বেগুন', gu: 'રીંગણ' },
    category: 'Vegetable',
    unit: 'kg',
    price: 45,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1623428187969-522d2f50c463?w=300&q=80'
  },
  {
    id: '9',
    name_en: 'Apple (Kashmir)',
    name_local: { hi: 'सेब', mr: 'सफरचंद', bn: 'আপেল', gu: 'સફરજન' },
    category: 'Fruit',
    unit: 'kg',
    price: 150,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80'
  },
  {
    id: '10',
    name_en: 'Green Chilli',
    name_local: { hi: 'हरी मिर्च', mr: 'हिरवी मिरची', bn: 'কাঁচা মরিচ', gu: 'લીલા મરચા' },
    category: 'Vegetable',
    unit: 'kg',
    price: 80,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1601648764658-ad77e37b5c3e?w=300&q=80'
  },
  {
    id: '11',
    name_en: 'Ginger',
    name_local: { hi: 'अदरक', mr: 'आले', bn: 'আদা', gu: 'આદુ' },
    category: 'Vegetable',
    unit: 'kg',
    price: 120,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80'
  },
  {
    id: '12',
    name_en: 'Orange',
    name_local: { hi: 'संतरा', mr: 'संत्री', bn: 'কমলা', gu: 'નારંગી' },
    category: 'Fruit',
    unit: 'dozen',
    price: 100,
    stock: 70,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&q=80'
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

// Fallback is English
export const TRANSLATIONS: Record<string, any> = {
  en: {
    appName: 'FreshMart',
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    speakToSell: 'Speak to Sell',
    pricePredictor: 'Price Predictor',
    profile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout',
    signIn: 'Sign In',
    signInDesc: 'Access your digital mandi',
    phoneLabel: 'Phone Number',
    emailLabel: 'Email Address',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify OTP',
    totalSales: 'Total Sales',
    lowStock: 'Low Stock',
    todayEarnings: 'Today\'s Earnings',
    marketTrend: 'Today\'s Market',
    goodToSell: 'Good to Sell',
    voiceCommand: 'Tap mic & say "Sold 2kg Onion for 70 rupees"',
    welcome: 'Welcome,',
    save: 'Save Changes',
    cancel: 'Cancel',
    language: 'Language',
    darkMode: 'Dark Mode',
    reduceMotion: 'Reduce Motion',
    editProfile: 'Edit Profile',
    predictedPrice: 'Suggested Price',
    confidence: 'Confidence',
    reason: 'Reason',
    highDemand: 'High Demand',
    lowStockReason: 'Stock is low',
    location: 'Location',
    upiId: 'UPI ID',
    currency: '₹'
  },
  hi: {
    appName: 'फ्रेशमार्ट',
    dashboard: 'डैशबोर्ड',
    inventory: 'स्टॉक',
    speakToSell: 'बोलकर बेचें',
    pricePredictor: 'भाव अनुमान',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    signIn: 'साइन इन करें',
    signInDesc: 'अपनी डिजिटल मंडी में प्रवेश करें',
    phoneLabel: 'फोन नंबर',
    emailLabel: 'ईमेल पता',
    sendOtp: 'OTP भेजें',
    verifyOtp: 'OTP सत्यापित करें',
    totalSales: 'कुल बिक्री',
    lowStock: 'कम स्टॉक',
    todayEarnings: 'आज की कमाई',
    marketTrend: 'आज का बाज़ार',
    goodToSell: 'बेचने के लिए अच्छा',
    voiceCommand: 'माइक दबाएं और कहें "2 किलो प्याज 70 रुपये में बेचा"',
    welcome: 'स्वागत है,',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    reduceMotion: 'मोशन कम करें',
    editProfile: 'प्रोफाइल बदलें',
    predictedPrice: 'सुझाया गया भाव',
    confidence: 'भरोसा',
    reason: 'कारण',
    highDemand: 'मांग ज्यादा है',
    lowStockReason: 'स्टॉक कम है',
    location: 'स्थान',
    upiId: 'UPI आईडी',
    currency: '₹'
  },
  mr: {
    appName: 'फ्रेशमार्ट',
    dashboard: 'डॅशबोर्ड',
    inventory: 'स्टॉक',
    speakToSell: 'बोलून विक्री करा',
    pricePredictor: 'भाव अंदाज',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्ज',
    logout: 'लॉग आऊट',
    signIn: 'साइन इन करा',
    signInDesc: 'आपल्या डिजिटल मंडीमध्ये प्रवेश करा',
    phoneLabel: 'फोन नंबर',
    emailLabel: 'ईमेल पत्ता',
    sendOtp: 'OTP पाठवा',
    verifyOtp: 'OTP सत्यापित करा',
    totalSales: 'एकूण विक्री',
    lowStock: 'कमी स्टॉक',
    todayEarnings: 'आजची कमाई',
    marketTrend: 'आजचा बाजार',
    goodToSell: 'विकण्यासाठी चांगले',
    voiceCommand: 'माइक दाबा आणि म्हणा "२ किलो कांदा ७० रुपयांना विकला"',
    welcome: 'स्वागत आहे,',
    save: 'सेव्ह करा',
    cancel: 'रद्द करा',
    language: 'भाषा',
    darkMode: 'डार्क मोड',
    reduceMotion: 'मोशन कमी करा',
    editProfile: 'प्रोफाइल बदला',
    predictedPrice: 'सुचवलेला भाव',
    confidence: 'आत्मविश्वास',
    reason: 'कारण',
    highDemand: 'मागणी जास्त आहे',
    lowStockReason: 'स्टॉक कमी आहे',
    location: 'स्थान',
    upiId: 'UPI आयडी',
    currency: '₹'
  }
};

// Helper to get text safely
export const getTranslation = (lang: string, key: string) => {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  return dict[key] || TRANSLATIONS['en'][key] || key;
};