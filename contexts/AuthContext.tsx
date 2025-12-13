import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  login: (type: 'phone' | 'email', credentials: any) => Promise<void>;
  loginWithoutFirebase: () => Promise<void>; // Kept for compatibility if used elsewhere
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session (Simulating persistent PHP session)
    const storedUser = localStorage.getItem('freshmart_user');
    const storedProfile = localStorage.getItem('freshmart_profile');

    if (storedUser && storedProfile) {
        setUser(JSON.parse(storedUser));
        setUserProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const login = async (type: 'phone' | 'email', credentials: any) => {
      setLoading(true);
      
      // Simulate API Call to PHP Backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        uid: 'user_' + Date.now(),
        displayName: type === 'email' ? credentials.email.split('@')[0] : 'Farmer User',
        email: type === 'email' ? credentials.email : undefined,
        phoneNumber: type === 'phone' ? credentials.phone : undefined,
        photoURL: 'https://images.unsplash.com/photo-1627916607164-7b5267330d8c?w=400&q=80',
      };

      const mockProfile: UserProfile = {
        uid: mockUser.uid,
        name: mockUser.displayName || 'Farmer',
        language: 'en',
        themePreference: 'light',
        location: 'Nashik, Maharashtra',
        points: 0,
        badges: [],
        createdAt: new Date().toISOString(),
        photoURL: mockUser.photoURL,
        upiId: 'farmer@upi'
      };

      setUser(mockUser);
      setUserProfile(mockProfile);
      
      localStorage.setItem('freshmart_user', JSON.stringify(mockUser));
      localStorage.setItem('freshmart_profile', JSON.stringify(mockProfile));
      
      setLoading(false);
  };

  const loginWithoutFirebase = async () => {
      await login('email', { email: 'demo@freshmart.com' });
  };

  const logout = async () => {
    localStorage.removeItem('freshmart_user');
    localStorage.removeItem('freshmart_profile');
    setUser(null);
    setUserProfile(null);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    localStorage.setItem('freshmart_profile', JSON.stringify(updated));
    // In real app, make API call to PHP here
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout, updateProfileData, login, loginWithoutFirebase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
