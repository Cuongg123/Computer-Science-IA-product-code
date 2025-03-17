import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, where, setDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

// Defining the context type for notifications
interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  scheduleNotification: (notification: Omit<Notification, 'id' | 'read'>) => Promise<void>;
}
// Creating the NotificationContext to manage notifications
const NotificationContext = createContext<NotificationContextType | null>(null);
// Custom hook to access the NotificationContext value
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
// NotificationProvider component to provide notifications context to the app
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    // Reference to the user's notifications collection
    const notificationsRef = collection(db, `users/${currentUser.uid}/notifications`);
    const unreadQuery = query(notificationsRef, where('read', '==', false));
    // Setting up a real-time listener for unread notifications
    const unsubscribe = onSnapshot(unreadQuery, (snapshot) => {
      const notificationData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Notification[];

      setNotifications(notificationData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);
  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const notificationRef = doc(db, `users/${currentUser.uid}/notifications/${id}`);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
 // Mark all unread notifications as read
  const markAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      const promises = notifications
        .filter(n => !n.read)
        .map(n => markAsRead(n.id));
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
 // Schedule a new notification in the Firestore database
  const scheduleNotification = async (notification: Omit<Notification, 'id' | 'read'>) => {
    if (!currentUser) return;
    
    try {
      const notificationsRef = collection(db, `users/${currentUser.uid}/notifications`);
      const newDocRef = doc(notificationsRef);
      await setDoc(newDocRef, {
        ...notification,
        read: false,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        markAsRead, 
        markAllAsRead, 
        loading,
        scheduleNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}; 