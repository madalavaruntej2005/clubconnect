// firebase.js — ClubConnect Firebase Configuration
// =====================================================
// IMPORTANT: Replace the config below with YOUR Firebase project config.
// How to get your config:
//   1. Go to https://console.firebase.google.com/
//   2. Create a project → Add Web App
//   3. Copy the firebaseConfig object and paste it here
//   4. Enable Authentication (Email/Password + Google) in the console
//   5. Enable Firestore Database in the console (start in test mode)
// =====================================================

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBW3WvWpDKmMXpvzAu0TC5zEOB-RQGtjxs",
    authDomain: "clubconnect-c1013.firebaseapp.com",
    projectId: "clubconnect-c1013",
    storageBucket: "clubconnect-c1013.firebasestorage.app",
    messagingSenderId: "1062210495020",
    appId: "1:1062210495020:web:29961868082a6f04d4e789"
};

// Firebase is configured with real credentials ✅
export const isFirebaseConfigured = true;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
