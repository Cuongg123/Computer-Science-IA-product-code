import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Firebase configuration object with environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Only connect to emulators if explicitly enabled
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  const { connectAuthEmulator } = require('firebase/auth');// Connecting Auth emulator
  const { connectFirestoreEmulator } = require('firebase/firestore');
  // Parsing emulator host and port for Firestore and connecting
  connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL);
  const [host, port] = import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST.split(':');
  connectFirestoreEmulator(db, host, Number(port));
}

export { app, auth, db }; 