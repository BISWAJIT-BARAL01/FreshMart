import React, { useState, useRef } from 'react';
import { User, MapPin, Phone, Award, Edit3, Save, Camera, LogOut, Globe, Moon, Sun, Zap } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { getTranslation, SUPPORTED_LANGUAGES, toLocalDigits } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Profile: React.FC = () => {
    const { userProfile, updateProfileData, logout } = useAuth();
    const { theme, toggleTheme, reduceMotion, toggleReduceMotion } = useTheme();
    const { language, setLanguage } = useLanguage();
    
    const [isEditing, setIsEditing] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Local state for editing form
    const [formData, setFormData] = useState({
        name: userProfile?.name || '',
        location: userProfile?.location || '',
        upiId: userProfile?.upiId || ''
    });

    const handleSave = async () => {
        setIsEditing(false);
        await updateProfileData(formData);
    };

    const compressImage = (img: HTMLImageElement, quality: number, maxWidth: number): string => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxWidth) {
                width *= maxWidth / height;
                height = maxWidth;
            }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', quality);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !userProfile) return;

        setLoadingImage(true);
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            
            img.onload = async () => {
                try {
                    // Client-Side Compression Logic
                    // Target: < 300KB
                    const MAX_SIZE_BYTES = 300 * 1024;
                    const MAX_DIMENSION = 800;
                    
                    let quality = 0.9;
                    let dataUrl = compressImage(img, quality, MAX_DIMENSION);
                    
                    // Reduce quality until size is under limit
                    while (dataUrl.length * 0.75 > MAX_SIZE_BYTES && quality > 0.1) {
                        quality -= 0.1;
                        dataUrl = compressImage(img, quality, MAX_DIMENSION);
                    }

                    // Update Profile Data with Base64 String (Simulation for PHP API)
                    await updateProfileData({ photoURL: dataUrl });
                    
                    alert("Profile picture updated successfully!");
                } catch (err) {
                    console.error("Upload failed", err);
                    alert("Failed to upload image. Please try again.");
                } finally {
                    setLoadingImage(false);
                }
            };
        };
    };

    if (!userProfile) return <div className="text-black text-center p-10">Loading Profile...</div>;

    const t = (key: string) => getTranslation(language, key);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-24">
             {/* Header Section */}
             <div className="relative mb-12">
                 <div className="h-48 w-full bg-gradient-to-r from-neonViolet to-green-300 rounded-2xl opacity-10"></div>
                 
                 <div className="absolute -bottom-12 left-6 md:left-10 flex flex-col md:flex-row items-end gap-6">
                    {/* Profile DP */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                            <img src={userProfile.photoURL} className={`w-full h-full object-cover transition-opacity ${loadingImage ? 'opacity-50' : 'opacity-100'}`} alt="Profile" />
                            {loadingImage && <div className="absolute inset-0 flex items-center justify-center text-black"><span className="animate-spin">⌛</span></div>}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-2 right-2 p-2 bg-maroon rounded-full text-white shadow-lg hover:scale-110 transition-transform"
                        >
                            <Camera size={20} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    </div>

                    <div className="mb-4 flex-1">
                        {isEditing ? (
                            <input className="bg-white text-black text-3xl font-bold rounded p-2 w-full max-w-md border border-gray-300 shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        ) : (
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-black">{userProfile.name}</h1>
                        )}
                        <p className="text-gray-600 flex items-center gap-2 mt-1 font-medium">
                            <MapPin size={16} className="text-neonViolet"/> 
                            {isEditing ? (
                                <input className="bg-white text-black text-sm rounded p-1 border border-gray-300" value={formData.location} placeholder="Set Location" onChange={e => setFormData({...formData, location: e.target.value})} />
                            ) : (
                                userProfile.location || 'Location not set'
                            )}
                        </p>
                    </div>
                 </div>

                 <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-4 bg-white hover:bg-gray-50 text-black px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 border border-gray-200 font-medium"
                 >
                    {isEditing ? <><Save size={16}/> {t('save')}</> : <><Edit3 size={16}/> {t('editProfile')}</>}
                 </button>
             </div>

             <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Left Column: Stats & Badges */}
                 <div className="lg:col-span-1 space-y-6">
                    <NeonCard className="space-y-4 text-center">
                        <div className="flex justify-center mb-2">
                             <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                <Award size={32} />
                             </div>
                        </div>
                        <h3 className="text-black font-bold text-xl">Level {toLocalDigits(5, language)} Farmer</h3>
                        <div className="bg-green-50 rounded-lg p-3">
                            <span className="text-3xl font-bold text-neonViolet">{toLocalDigits(userProfile.points, language)}</span>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Karma Points</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                             <span className="px-2 py-1 rounded bg-green-100 text-neonViolet text-xs border border-green-200 font-bold">Early Adopter</span>
                             <span className="px-2 py-1 rounded bg-red-50 text-maroon text-xs border border-red-100 font-bold">Verified</span>
                        </div>
                    </NeonCard>
                    
                    {/* Read-only Contact Info */}
                    <NeonCard className="space-y-3">
                         <h4 className="text-gray-500 text-sm font-bold uppercase mb-2">Contact Info</h4>
                         <div className="flex items-center gap-3 text-black font-medium">
                             <Phone size={18} className="text-neonViolet" />
                             <span>{toLocalDigits(userProfile.phone || userProfile.email || 'No contact info', language)}</span>
                         </div>
                         <div className="flex items-center gap-3 text-black font-medium">
                             <span className="text-maroon font-bold text-lg">UPI</span>
                             {isEditing ? (
                                <input className="bg-white border border-gray-300 rounded p-1 text-sm flex-1" value={formData.upiId} placeholder="user@upi" onChange={e => setFormData({...formData, upiId: e.target.value})} />
                             ) : (
                                <span className="text-sm">{userProfile.upiId || 'Add UPI ID'}</span>
                             )}
                         </div>
                    </NeonCard>
                 </div>

                 {/* Right Column: Settings */}
                 <div className="lg:col-span-2 space-y-6">
                    <NeonCard>
                        <h3 className="text-xl font-bold text-black mb-6 border-b border-gray-100 pb-4">{t('settings')}</h3>
                        
                        <div className="space-y-6">
                            {/* Motion Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Zap className="text-maroon" />
                                    <div>
                                        <p className="text-black font-medium">{t('reduceMotion')}</p>
                                        <p className="text-xs text-gray-500">{reduceMotion ? 'Reduced' : 'Normal'}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleReduceMotion}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${reduceMotion ? 'bg-neonViolet' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${reduceMotion ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>

                            {/* Language Selector */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Globe className="text-neonViolet" />
                                    <p className="text-black font-medium">{t('language')}</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {SUPPORTED_LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code)}
                                            className={`p-2 rounded-lg text-sm border transition-all ${
                                                language === lang.code 
                                                ? 'bg-neonViolet text-white border-neonViolet shadow-md' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black'
                                            }`}
                                        >
                                            <span className="block font-bold">{lang.nativeName}</span>
                                            <span className="text-xs opacity-90">{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </NeonCard>

                    <button 
                        onClick={logout}
                        className="w-full py-4 rounded-xl bg-red-50 border border-red-100 text-maroon font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                    >
                        <LogOut size={20} /> {t('logout')}
                    </button>
                 </div>
             </div>
        </div>
    );
};

export default Profile;
