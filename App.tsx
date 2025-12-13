import React, { useState } from 'react';
import { LayoutDashboard, Mic, Package, Settings, LogOut, Menu, X, Globe, BarChart } from 'lucide-react';
import ThreeHero from './components/ThreeHero';
import Dashboard from './components/Dashboard';
import SpeakToSell from './components/SpeakToSell';
import Inventory from './components/Inventory';
import Chatbot from './components/Chatbot';

type View = 'dashboard' | 'speak' | 'inventory' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
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

  return (
    <div className="min-h-screen bg-midnightBlack text-white selection:bg-neonViolet/30">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-midnightBlack/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-neonViolet to-electricBlue rounded-lg flex items-center justify-center font-bold text-white">K</div>
           <span className="font-display font-bold text-lg">KisanSmart</span>
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
            <div className="w-10 h-10 bg-gradient-to-tr from-neonViolet to-electricBlue rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-neonViolet/20">K</div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-wide">KisanSmart</h1>
              <p className="text-xs text-white/40 uppercase tracking-widest">Fresh Mart</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="speak" icon={Mic} label="Speak to Sell" />
            <NavItem view="inventory" icon={Package} label="Inventory" />
            <div className="h-px bg-white/10 my-4 mx-2"></div>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <BarChart size={20} />
                <span>Price Predictor</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Settings size={20} />
                <span>Settings</span>
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
             <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <img src="https://picsum.photos/seed/farmer/100/100" alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
                    <div>
                        <p className="text-sm font-bold text-white">Rajesh Kumar</p>
                        <p className="text-xs text-white/40">Pune, MH</p>
                    </div>
                </div>
                <button className="w-full py-2 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 transition-colors">
                    View Profile
                </button>
             </div>
             <button className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm py-2">
                <LogOut size={16} /> Sign Out
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-h-screen relative">
           {/* Background Elements */}
           <ThreeHero />

           <div className="relative z-10">
              {/* Top Bar */}
              <header className="hidden lg:flex justify-between items-center p-8 pb-0">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">
                        {currentView === 'dashboard' && 'Overview'}
                        {currentView === 'speak' && 'Voice Sales'}
                        {currentView === 'inventory' && 'Manage Stock'}
                    </h2>
                    <p className="text-white/40 text-sm">Welcome back to your digital mandi.</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-white/10 transition-colors"
                      >
                          <Globe size={16} />
                          {lang === 'en' ? 'English' : 'हिंदी'}
                      </button>
                  </div>
              </header>

              {/* View Renderer */}
              <div className="mt-6">
                 {currentView === 'dashboard' && <Dashboard />}
                 {currentView === 'speak' && <SpeakToSell />}
                 {currentView === 'inventory' && <Inventory />}
              </div>
           </div>
        </main>
      </div>
      
      <Chatbot />
    </div>
  );
};

export default App;