import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { API_BASE_URL } from '../constants';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  login: (type: 'phone' | 'email', credentials: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithoutFirebase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // PLACEHOLDER: Replace with your actual Google Client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  useEffect(() => {
    // Check local storage for session (Simulating persistent PHP session)
    try {
        const storedUser = localStorage.getItem('freshmart_user');
        const storedProfile = localStorage.getItem('freshmart_profile');

        if (storedUser && storedProfile) {
            setUser(JSON.parse(storedUser));
            setUserProfile(JSON.parse(storedProfile));
        }
    } catch (e) {
        console.error("Session storage error", e);
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    
    // Fix: Wait for Google Script if not ready
    const waitForGoogle = () => {
        return new Promise<boolean>((resolve) => {
            if (window.google && window.google.accounts) return resolve(true);
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (window.google && window.google.accounts) {
                    clearInterval(interval);
                    resolve(true);
                }
                if (attempts > 20) { // Wait max 2 seconds
                    clearInterval(interval);
                    resolve(false);
                }
            }, 100);
        });
    }

    const isScriptReady = await waitForGoogle();
    
    if (!isScriptReady) {
        alert("Google Sign-In script failed to load. Please check your internet connection.");
        setLoading(false);
        return;
    }

    try {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: async (tokenResponse: any) => {
                if (tokenResponse.access_token) {
                    // Fetch User Info using the access token
                    try {
                        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                        });
                        const googleUser = await userInfoResponse.json();

                        // Map Google User to App User Profile
                        const mockUser = {
                            uid: 'google_' + googleUser.sub,
                            displayName: googleUser.name,
                            email: googleUser.email,
                            photoURL: googleUser.picture,
                        };

                        const newProfile: UserProfile = {
                            uid: mockUser.uid,
                            name: mockUser.displayName || 'Google User',
                            language: 'en',
                            themePreference: 'light',
                            location: 'India',
                            points: 0,
                            badges: ['Verified'],
                            createdAt: new Date().toISOString(),
                            photoURL: mockUser.photoURL,
                            upiId: googleUser.email // Defaulting UPI ID to email for now
                        };

                        // 1. Update State
                        setUser(mockUser);
                        setUserProfile(newProfile);

                        // 2. Persist Locally (Simulate Session)
                        localStorage.setItem('freshmart_user', JSON.stringify(mockUser));
                        localStorage.setItem('freshmart_profile', JSON.stringify(newProfile));
                        
                        // 3. (Optional) Send to PHP Backend here
                        // await fetch(`${API_BASE_URL}/auth/google`, { method: 'POST', body: JSON.stringify({ token: tokenResponse.access_token }) });

                    } catch (fetchError) {
                        console.error("Error fetching Google User Info:", fetchError);
                        alert("Failed to get user details from Google.");
                    }
                }
                setLoading(false);
            },
            error_callback: (err: any) => {
                // Don't log "popup_closed" as an error, it's a user action
                if (err.type === 'popup_closed') {
                     console.warn("Google Login cancelled (Popup closed).");
                } else {
                     console.error("Google Auth Error:", err);
                }
                
                setLoading(false);
                
                // Heuristic: If we are using the placeholder ID, user likely encountered an error in the popup 
                // (like 'origin mismatch' or 'invalid_client') and closed it. 
                // We fallback to demo login to let them proceed.
                if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
                    // Short delay to allow popup to fully close visually
                    setTimeout(() => {
                        // FORCE AUTO FIX: Automatically use demo login if config is missing
                        alert("Dev Mode: Google Client ID not configured. Using Demo Account.");
                        login('email', { email: 'demo-google@freshmart.com' });
                    }, 500);
                } else if (err.type === 'popup_closed') {
                    // User manually closed the popup and not in demo mode
                    // No action needed
                } else {
                    alert("Google Login failed. Please try again.");
                }
            }
        });

        // Trigger the popup
        client.requestAccessToken();

    } catch (e) {
        console.error("Google Login Exception:", e);
        // Fallback for Demo purposes if Client ID is invalid
        setLoading(false);
        setTimeout(() => {
             alert("Google Integration Error: Invalid Client ID. Logging in as Demo User.");
             login('email', { email: 'demo-google@freshmart.com' });
        }, 500);
    }
  };

  const login = async (type: 'phone' | 'email', credentials: any) => {
      setLoading(true);
      
      // --- ADMIN INTERCEPTION RULE ---
      if (type === 'email' && credentials.email === 'admin123@gmail.com') {
          console.log("Admin Login Detected. Redirecting to Admin Dashboard...");
          alert("Admin Access Granted. Redirecting to CMS...");
          window.location.href = '/admin/dashboard'; 
          setLoading(false);
          return;
      }
      // --------------------------------

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate Network Delay

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
    
    // Optimistic Update
    setUserProfile(updated);
    localStorage.setItem('freshmart_profile', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout, updateProfileData, login, loginWithGoogle, loginWithoutFirebase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};