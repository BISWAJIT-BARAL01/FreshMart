import React, { useState } from 'react';
import { User, MapPin, Phone, Award, Edit3, Save } from 'lucide-react';
import NeonCard from './ui/NeonCard';
import { TRANSLATIONS } from '../constants';
import { Language, UserProfile } from '../types';

interface ProfileProps {
    lang: Language;
}

const Profile: React.FC<ProfileProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['en'];
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        location: 'Pune, Maharashtra',
        language: 'hi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        points: 1250,
        badges: ['Early Adopter', 'Top Seller', 'Eco-Friendly']
    });

    const handleSave = () => {
        setIsEditing(false);
        // Persist logic would go here
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
             <div className="relative mb-12">
                 <div className="h-48 w-full bg-gradient-to-r from-deepPurple to-neonViolet rounded-2xl opacity-50"></div>
                 <div className="absolute -bottom-10 left-8 flex items-end gap-6">
                    <img src={profile.avatar} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#00010F] object-cover" />
                    <div className="mb-4">
                        {isEditing ? (
                            <input className="bg-black/50 text-white text-2xl font-bold rounded p-1" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                        ) : (
                            <h1 className="text-3xl font-display font-bold text-white">{profile.name}</h1>
                        )}
                        <p className="text-white/60 flex items-center gap-2"><MapPin size={14}/> {profile.location}</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-md flex items-center gap-2"
                 >
                    {isEditing ? <><Save size={16}/> {t.save}</> : <><Edit3 size={16}/> {t.editProfile}</>}
                 </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                 <NeonCard className="md:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-white/40 text-sm block mb-1">Phone Number</label>
                            <p className="text-white text-lg font-mono">{profile.phone}</p>
                        </div>
                        <div>
                            <label className="text-white/40 text-sm block mb-1">Primary Mandi</label>
                            <p className="text-white text-lg">Pune APMC</p>
                        </div>
                    </div>
                 </NeonCard>

                 <NeonCard className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Award className="text-warnYellow"/> Achievements</h3>
                    <div className="text-center py-4 bg-white/5 rounded-xl">
                        <span className="text-4xl font-bold text-mintCyan">{profile.points}</span>
                        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Karma Points</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.badges.map(badge => (
                            <span key={badge} className="text-xs bg-neonViolet/20 text-neonViolet px-2 py-1 rounded-full border border-neonViolet/20">
                                {badge}
                            </span>
                        ))}
                    </div>
                 </NeonCard>
             </div>
        </div>
    );
};

export default Profile;