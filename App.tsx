import React, { useState, Suspense } from 'react';
import { LayoutDashboard, Mic, Package, Settings as SettingsIcon, LogOut, Menu, X, Globe, BarChart, User } from 'lucide-react';
import Login from './components/Login';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SafeImage from './components/ui/SafeImage';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Static Imports to prevent "Failed to fetch dynamically imported module" errors
import Dashboard from './components/Dashboard';
import SpeakToSell from './components/SpeakToSell';
import Inventory from './components/Inventory';
import Settings from './components/Settings'; 
import Profile from './components/Profile';
import PricePredictor from './components/PricePredictor';
import ThreeHero from './components/ThreeHero';
import Chatbot from './components/Chatbot';

type View = 'dashboard' | 'speak' | 'inventory' | 'profile' | 'predictor';

// Loading Component
const PageLoader = () => (
  <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-neonViolet animate-fade-in">
    <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-neonViolet border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-sm font-display font-medium text-gray-500 animate-pulse">Loading Application...</p>
  </div>
);

// Inner App handles the logged-in state UI
const AuthenticatedApp: React.FC = () => {
  const { user, loading, userProfile, logout } = useAuth();
  const { reduceMotion, theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If loading, show splash
  if (loading) return <PageLoader />;

  // If not user, show Login
  if (!user) return <Login />;

  // Updated Logo URL to local file
  const LOGO_URL = "/logoFM.jpeg";

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ComponentType<any>; label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-neonViolet/10 text-neonViolet border border-neonViolet/20 font-bold' 
          : 'text-gray-600 hover:text-neonViolet hover:bg-neonViolet/5'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-white text-black selection:bg-neonViolet/30 transition-colors duration-300`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
             <SafeImage src={LOGO_URL} alt="FreshMart" className="w-10 h-10 object-contain" />
             <span className="font-display font-bold text-lg text-black">FreshMart</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-black">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className="flex relative">
          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 h-screen w-[280px] bg-[#F1F8E9] border-r border-green-100 p-6 z-40 transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
               <SafeImage src={LOGO_URL} alt="FreshMart" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="font-display font-bold text-xl tracking-wide text-black">FreshMart</h1>
                <p className="text-xs text-maroon uppercase tracking-widest font-bold">Farmer First</p>
              </div>
            </div>

            <nav className="space-y-2">
              <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem view="speak" icon={Mic} label="Speak to Sell" />
              <NavItem view="inventory" icon={Package} label="Inventory" />
              <div className="h-px bg-green-200 my-4 mx-2"></div>
              <NavItem view="predictor" icon={BarChart} label="Price Predictor" />
              <NavItem view="profile" icon={User} label="My Profile" />
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
               <div onClick={() => setCurrentView('profile')} className="p-4 bg-white rounded-xl border border-green-100 mb-4 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                      <SafeImage src={userProfile?.photoURL || ''} alt="Profile" className="w-10 h-10 rounded-full border border-green-200" fallbackIcon={<User className="text-gray-400" />} />
                      <div className="overflow-hidden">
                          <p className="text-sm font-bold text-black truncate">{userProfile?.name || 'Farmer'}</p>
                          <p className="text-xs text-gray-500 truncate">{userProfile?.location || 'India'}</p>
                      </div>
                  </div>
               </div>
               <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-maroon hover:text-red-700 text-sm py-2 font-medium">
                  <LogOut size={16} /> Sign Out
               </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full min-h-screen relative overflow-hidden bg-white">
             {/* Background Elements */}
             {!reduceMotion && (
               <ErrorBoundary>
                   <ThreeHero />
               </ErrorBoundary>
             )}

             <div className="relative z-10 flex flex-col min-h-screen">
                {/* Top Bar (Desktop) */}
                <header className="hidden lg:flex justify-between items-center p-8 pb-0">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-black capitalize">
                         {currentView.replace('-', ' ')}
                      </h2>
                      <p className="text-gray-500 text-sm">FreshMart - Your Digital Mandi</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-black hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Globe size={16} className="text-neonViolet" />
                            {language === 'en' ? 'English' : 'हिंदी'}
                        </button>
                    </div>
                </header>

                {/* View Renderer */}
                <div className="mt-6 flex-1">
                  <ErrorBoundary>
                    {currentView === 'dashboard' && <Dashboard />}
                    {currentView === 'speak' && <SpeakToSell lang={language} />}
                    {currentView === 'inventory' && <Inventory />}
                    {currentView === 'profile' && <Profile />}
                    {currentView === 'predictor' && <PricePredictor lang={language} />}
                  </ErrorBoundary>
                </div>
             </div>
          </main>
        </div>
        
        <ErrorBoundary>
          <Chatbot />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

// Root App wrapping providers
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;