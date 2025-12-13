import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../constants';
import { Phone, Mail, ArrowRight, Loader, User, Facebook, Apple, Lock, AlertCircle } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { useAuth } from '../contexts/AuthContext';
import SafeImage from './ui/SafeImage';

const Login: React.FC = () => {
  const { language } = useLanguage();
  const { login, loginWithGoogle } = useAuth();
  
  // UI State
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Inputs
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP State (Simulated)
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Local Logo URL
  const LOGO_URL = "/logoFM.jpeg";

  const handlePhoneSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      
      if (!otpSent) {
          if (phone.length < 10) {
              setError("Please enter a valid phone number");
              return;
          }
          setLoading(true);
          setTimeout(() => {
              setOtpSent(true);
              setLoading(false);
          }, 1000);
      } else {
          if (otp !== '123456') {
              setError("Invalid OTP. Try 123456");
              return;
          }
          setLoading(true);
          try {
              await login('phone', { phone });
          } catch (e) {
              setError("Login Failed");
              setLoading(false);
          }
      }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        await login('email', { email });
    } catch (err: any) {
        setError("Login Failed");
        setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
      setLoading(true);
      try {
          await login('email', { email: 'guest@freshmart.com' });
      } catch (err) {
          setError("Guest Login Failed");
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white relative overflow-hidden font-sans">
      
      {/* Background & Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#2E7D32_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-neonViolet/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-electricBlue/10 rounded-full blur-[80px]"></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
           <SafeImage src={LOGO_URL} className="w-32 h-32 mx-auto mb-4 object-contain drop-shadow-lg" alt="FreshMart Logo" />
           <h1 className="text-5xl font-display font-bold text-black mb-2 tracking-tight">
             {getTranslation(language, 'appName')}
           </h1>
           <p className="text-maroon font-bold font-mono text-sm tracking-widest uppercase">
             {getTranslation(language, 'signInDesc')}
           </p>
        </div>

        {/* Card */}
        <NeonCard className="bg-white border-gray-200 shadow-xl">
           
           {/* Method Switcher */}
           <div className="flex gap-2 mb-8 p-1.5 bg-gray-100 rounded-xl border border-gray-200">
              <button 
                onClick={() => { setMethod('phone'); setError(''); setOtpSent(false); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${method === 'phone' ? 'bg-neonViolet text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
              >
                {getTranslation(language, 'phoneLabel')}
              </button>
              <button 
                onClick={() => { setMethod('email'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${method === 'email' ? 'bg-electricBlue text-white shadow-md' : 'text-gray-500 hover:text-black'}`}
              >
                {getTranslation(language, 'emailLabel')}
              </button>
           </div>

           {/* Dynamic Form */}
           <form onSubmit={method === 'phone' ? handlePhoneSubmit : handleEmailLogin} className="space-y-5">
              
              {/* Error Display */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-maroon text-sm border border-maroon/20 flex items-start gap-2 animate-shake">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {method === 'phone' && (
                  <div className="space-y-4">
                      {!otpSent ? (
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3.5 text-neonViolet" size={18} />
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-black focus:border-neonViolet focus:ring-1 focus:ring-neonViolet/50 outline-none transition-all placeholder-gray-400 font-mono"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>
                        </div>
                      ) : (
                        <div className="space-y-2 animate-fade-in">
                             <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Enter OTP (Use 123456)</label>
                                <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-neonViolet font-bold hover:underline">Change Number</button>
                             </div>
                             <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-neonViolet" size={18} />
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-black focus:border-neonViolet focus:ring-1 focus:ring-neonViolet/50 outline-none transition-all placeholder-gray-400 font-mono tracking-widest text-lg"
                                    placeholder="123456"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                      )}
                  </div>
              )}

              {method === 'email' && (
                <>
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-electricBlue" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-black focus:border-electricBlue focus:ring-1 focus:ring-electricBlue/50 outline-none transition-all placeholder-gray-400 font-mono"
                                placeholder="farmer@freshmart.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-electricBlue" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-black focus:border-electricBlue focus:ring-1 focus:ring-electricBlue/50 outline-none transition-all font-mono"
                                required
                            />
                        </div>
                    </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-white ${method === 'email' ? 'bg-electricBlue hover:bg-maroon' : 'bg-neonViolet hover:bg-green-700'}`}
              >
                {loading ? (
                    <Loader className="animate-spin" />
                ) : (
                    <>
                       {method === 'email' ? getTranslation(language, 'signIn') : (otpSent ? getTranslation(language, 'verifyOtp') : getTranslation(language, 'sendOtp'))} 
                       <ArrowRight size={20} />
                    </>
                )}
              </button>
           </form>

           {/* Divider */}
           <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative bg-white px-4 text-[10px] uppercase tracking-widest text-gray-400">Social Access</span>
           </div>

           {/* Social Buttons Grid */}
           <div className="grid grid-cols-4 gap-3">
                <button 
                    onClick={loginWithGoogle}
                    disabled={loading}
                    className="flex items-center justify-center py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all hover:border-gray-300"
                    title="Sign in with Google"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </button>
                <button 
                    onClick={() => login('email', { email: 'facebook-user@freshmart.com' })}
                    disabled={loading}
                    className="flex items-center justify-center py-3 rounded-xl bg-gray-50 hover:bg-[#1877F2]/10 border border-gray-200 hover:border-[#1877F2] transition-all text-gray-600 hover:text-[#1877F2]"
                    title="Facebook"
                >
                    <Facebook size={20} className="fill-current" />
                </button>
                <button 
                    onClick={() => login('email', { email: 'apple-user@freshmart.com' })}
                    disabled={loading}
                    className="flex items-center justify-center py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-black transition-all text-gray-600 hover:text-black"
                    title="Apple"
                >
                    <Apple size={20} className="fill-current" />
                </button>
                 <button 
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="flex items-center justify-center py-3 rounded-xl bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-600 transition-all text-gray-600 hover:text-green-600"
                    title="Guest / Anonymous"
                >
                    <User size={20} />
                </button>
           </div>
           
           <p className="text-[10px] text-center text-gray-400 mt-8 font-mono">
             SECURE ACCESS • v2.5.0 • MUMBAI SERVER
           </p>
        </NeonCard>
      </div>
    </div>
  );
};

export default Login;