import React, { useState, Suspense } from 'react';
import { LayoutDashboard, Mic, Package, Settings as SettingsIcon, LogOut, Menu, X, Globe, BarChart, User } from 'lucide-react';
import ThreeHero from './components/ThreeHero';
import Chatbot from './components/Chatbot';
import { AppSettings, Language } from './types';

// Lazy Load Components for Performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const SpeakToSell = React.lazy(() => import('./components/SpeakToSell'));
const Inventory = React.lazy(() => import('./components/Inventory'));
const Settings = React.lazy(() => import('./components/Settings'));
const Profile = React.lazy(() => import('./components/Profile'));
const PricePredictor = React.lazy(() => import('./components/PricePredictor'));

type View = 'dashboard' | 'speak' | 'inventory' | 'settings' | 'profile' | 'predictor';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({
      language: 'en',
      theme: 'dark',
      reduceMotion: false,
      notifications: true
  });

  const updateSettings = (key: keyof AppSettings, value: any) => {
      setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ComponentType<any>; label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-neonViolet/20 text-neonViolet border border-neonViolet/30 shadow-[0_0_15px_rgba(154,77,255,0.2)]' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const LoadingFallback = () => (
      <div className="w-full h-[50vh] flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
  );

  return (
    <div className={`min-h-screen bg-midnightBlack text-white selection:bg-neonViolet/30 ${appSettings.theme}`}>
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-midnightBlack/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-neonViolet to-electricBlue rounded-lg flex items-center justify-center font-bold text-white">F</div>
           <span className="font-display font-bold text-lg">FreshMart</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex relative">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 h-screen w-[280px] bg-[#0A0514] border-r border-white/5 p-6 z-40 transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-neonViolet to-electricBlue rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-neonViolet/20">F</div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-wide">FreshMart</h1>
              <p className="text-xs text-white/40 uppercase tracking-widest">Farmer First</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="speak" icon={Mic} label="Speak to Sell" />
            <NavItem view="inventory" icon={Package} label="Inventory" />
            <div className="h-px bg-white/10 my-4 mx-2"></div>
            <NavItem view="predictor" icon={BarChart} label="Price Predictor" />
            <NavItem view="profile" icon={User} label="My Profile" />
            <NavItem view="settings" icon={SettingsIcon} label="Settings" />
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
             <div onClick={() => setCurrentView('profile')} className="p-4 bg-white/5 rounded-xl border border-white/5 mb-4 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">Rajesh Kumar</p>
                        <p className="text-xs text-white/40 truncate">Pune, MH</p>
                    </div>
                </div>
             </div>
             <button className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm py-2">
                <LogOut size={16} /> Sign Out
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-h-screen relative overflow-hidden">
           {/* Background Elements */}
           {!appSettings.reduceMotion && <ThreeHero />}

           <div className="relative z-10 flex flex-col min-h-screen">
              {/* Top Bar (Desktop) */}
              <header className="hidden lg:flex justify-between items-center p-8 pb-0">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white capitalize">
                       {currentView.replace('-', ' ')}
                    </h2>
                    <p className="text-white/40 text-sm">FreshMart - Your Digital Mandi</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <button 
                        onClick={() => updateSettings('language', appSettings.language === 'en' ? 'hi' : 'en')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-colors"
                      >
                          <Globe size={16} />
                          {appSettings.language === 'en' ? 'English' : 'हिंदी'}
                      </button>
                  </div>
              </header>

              {/* View Renderer */}
              <div className="mt-6 flex-1">
                 <Suspense fallback={<LoadingFallback />}>
                    {currentView === 'dashboard' && <Dashboard lang={appSettings.language} />}
                    {currentView === 'speak' && <SpeakToSell lang={appSettings.language} />}
                    {currentView === 'inventory' && <Inventory />}
                    {currentView === 'settings' && <Settings settings={appSettings} updateSettings={updateSettings} lang={appSettings.language} />}
                    {currentView === 'profile' && <Profile lang={appSettings.language} />}
                    {currentView === 'predictor' && <PricePredictor lang={appSettings.language} />}
                 </Suspense>
              </div>
           </div>
        </main>
      </div>
      
      <Chatbot />
    </div>
  );
};

export default App;