import React from 'react';
import { Moon, Sun, Monitor, Zap, User, Volume2, Globe } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../constants';
import { Language, AppSettings } from '../types';

interface SettingsProps {
    settings: AppSettings;
    updateSettings: (k: keyof AppSettings, v: any) => void;
    lang: Language;
}

const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, lang }) => {
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['en'];

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-display text-white mb-8">{t.settings}</h2>

            <div className="space-y-6">
                {/* Language Section */}
                <NeonCard className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="text-neonViolet" />
                        <h3 className="text-lg font-bold text-white">{t.language}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SUPPORTED_LANGUAGES.map((sl) => (
                            <button
                                key={sl.code}
                                onClick={() => updateSettings('language', sl.code)}
                                className={`p-2 rounded-lg text-sm border transition-all ${settings.language === sl.code ? 'bg-neonViolet text-white border-neonViolet' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                            >
                                {sl.label}
                            </button>
                        ))}
                    </div>
                </NeonCard>

                {/* Appearance */}
                <NeonCard className="space-y-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Moon className="text-electricBlue" />
                            <span className="text-white">{t.darkMode}</span>
                         </div>
                         <div className="flex bg-black/40 rounded-full p-1 border border-white/10">
                            <button onClick={() => updateSettings('theme', 'dark')} className={`p-2 rounded-full ${settings.theme === 'dark' ? 'bg-white/20 text-white' : 'text-white/40'}`}><Moon size={16}/></button>
                            <button onClick={() => updateSettings('theme', 'light')} className={`p-2 rounded-full ${settings.theme === 'light' ? 'bg-white/20 text-white' : 'text-white/40'}`}><Sun size={16}/></button>
                         </div>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Zap className="text-warnYellow" />
                            <span className="text-white">{t.reduceMotion}</span>
                         </div>
                         <button 
                            onClick={() => updateSettings('reduceMotion', !settings.reduceMotion)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.reduceMotion ? 'bg-safeGreen' : 'bg-white/10'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.reduceMotion ? 'left-7' : 'left-1'}`}></div>
                         </button>
                    </div>
                </NeonCard>
            </div>
        </div>
    );
};

export default Settings;