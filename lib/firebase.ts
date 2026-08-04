import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockKeyForForestGuardSystem12345",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "forestguard-iot.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "forestguard-iot",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "forestguard-iot.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456789",
};

let app: FirebaseApp;
let db: Firestore;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization error (using mock store fallback if needed):", error);
}

export { app, db };
