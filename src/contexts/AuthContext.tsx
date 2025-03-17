import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  UserCredential,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from '@firebase/auth';
import { auth, googleProvider } from '../firebase';
// Defining the context type for authentication
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}
// Creating the AuthContext to hold authentication data
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// Custom hook to access the AuthContext value
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register a new user with email and password
  const register = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login an existing user with email and password
  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
// Login with Google using the Google Auth provider
  const loginWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };
  // Logout the current user
  const logout = () => {
    return firebaseSignOut(auth);
  };
 // Update the user's profile (display name and/or photo)
  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!currentUser) throw new Error('No user logged in');
    return updateProfile(currentUser, data);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 