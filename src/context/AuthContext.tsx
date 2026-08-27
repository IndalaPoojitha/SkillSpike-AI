import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../services/firebaseService';
import { DEMO_USER } from '../data/demoData';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    pass: string;
    college: string;
    branch: string;
    year: string;
    targetRole: string;
    targetCompany?: string;
    dsaLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    studyHoursPerDay?: number;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginDemoUser: () => void;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(() => {
    return localStorage.getItem('skillspike_ai_is_demo') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isDemoUser) {
      setUserProfile(DEMO_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        let profile = await getUserProfile(user.uid);
        if (!profile) {
          profile = {
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            college: "Vignan's Institute of Information Technology",
            branch: 'Information Technology',
            year: '2nd Year',
            targetRole: 'Software Developer',
            targetCompany: 'Amazon',
            dsaLevel: 'Beginner',
            studyHoursPerDay: 2,
            skills: ['Java', 'C++', 'SQL', 'Git'],
            avatarUrl: user.photoURL || undefined,
            createdAt: new Date().toISOString(),
            currentStreak: 1,
            lastActiveDate: new Date().toISOString(),
          };
          await saveUserProfile(profile);
        }
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoUser]);

  const login = async (email: string, pass: string) => {
    setIsDemoUser(false);
    localStorage.removeItem('skillspike_ai_is_demo');
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await getUserProfile(userCredential.user.uid);
    if (profile) setUserProfile(profile);
  };

  const register = async (data: {
    name: string;
    email: string;
    pass: string;
    college: string;
    branch: string;
    year: string;
    targetRole: string;
    targetCompany?: string;
    dsaLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    studyHoursPerDay?: number;
  }) => {
    setIsDemoUser(false);
    localStorage.removeItem('skillspike_ai_is_demo');
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pass);
    await updateFirebaseProfile(userCredential.user, { displayName: data.name });

    const newProfile: UserProfile = {
      uid: userCredential.user.uid,
      name: data.name,
      email: data.email,
      college: data.college || "Vignan's Institute of Information Technology",
      branch: data.branch || 'Information Technology',
      year: data.year || '2nd Year',
      targetRole: data.targetRole || 'Software Developer',
      targetCompany: data.targetCompany || 'Amazon',
      dsaLevel: data.dsaLevel || 'Beginner',
      studyHoursPerDay: data.studyHoursPerDay || 2,
      skills: ['Java', 'C++', 'Basic DSA', 'SQL', 'Git'],
      createdAt: new Date().toISOString(),
      currentStreak: 1,
      lastActiveDate: new Date().toISOString(),
    };

    await saveUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const loginWithGoogle = async () => {
    setIsDemoUser(false);
    localStorage.removeItem('skillspike_ai_is_demo');
    const userCredential = await signInWithPopup(auth, googleProvider);
    let profile = await getUserProfile(userCredential.user.uid);
    if (!profile) {
      profile = {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || 'Student',
        email: userCredential.user.email || '',
        college: "Vignan's Institute of Information Technology",
        branch: 'Information Technology',
        year: '2nd Year',
        targetRole: 'Software Developer',
        targetCompany: 'Amazon',
        dsaLevel: 'Beginner',
        studyHoursPerDay: 2,
        skills: ['Java', 'C++', 'SQL', 'Git'],
        avatarUrl: userCredential.user.photoURL || undefined,
        createdAt: new Date().toISOString(),
        currentStreak: 1,
        lastActiveDate: new Date().toISOString(),
      };
      await saveUserProfile(profile);
    }
    setUserProfile(profile);
  };

  const loginDemoUser = () => {
    setIsDemoUser(true);
    localStorage.setItem('skillspike_ai_is_demo', 'true');
    setUserProfile(DEMO_USER);
  };

  const logout = async () => {
    setIsDemoUser(false);
    localStorage.removeItem('skillspike_ai_is_demo');
    await signOut(auth);
    setUserProfile(null);
    setCurrentUser(null);
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    await saveUserProfile(updated);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isDemoUser,
    login,
    register,
    loginWithGoogle,
    loginDemoUser,
    logout,
    updateProfileData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
