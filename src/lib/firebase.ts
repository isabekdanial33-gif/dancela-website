// Firebase v12 SDK - Real Firebase Integration for Dancela
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as _signInWithPopup,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signOut as _signOut,
  onAuthStateChanged as _onAuthStateChanged,
  RecaptchaVerifier as _RecaptchaVerifier,
  signInWithPhoneNumber as _signInWithPhoneNumber,
  PhoneAuthProvider as _PhoneAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  doc as _doc,
  setDoc as _setDoc,
  getDoc as _getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Firebase config from the real project credentials provided by the developer
const firebaseConfig = {
  apiKey: "AIzaSyD7aJ5jb3ZpLVOl2DWXzUcIaDrPuuKEBXo",
  authDomain: "dancela-messenger.firebaseapp.com",
  databaseURL: "https://dancela-messenger-default-rtdb.firebaseio.com",
  projectId: "dancela-messenger",
  storageBucket: "dancela-messenger.firebasestorage.app",
  messagingSenderId: "376383770466",
  appId: "1:376383770466:web:6a7e3e7814d327c25b663b",
  measurementId: "G-KMBY5ZWR5W"
};

// Initialize Firebase (guard against double-init in HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Firestore
export const db = getFirestore(app);

// Realtime Database
export const rtdb = getDatabase(app);

// Re-export auth methods
export const signInWithPopup = _signInWithPopup;
export const signInWithEmailAndPassword = _signInWithEmailAndPassword;
export const createUserWithEmailAndPassword = _createUserWithEmailAndPassword;
export const signOut = _signOut;
export const onAuthStateChanged = _onAuthStateChanged;
export const RecaptchaVerifier = _RecaptchaVerifier;
export const signInWithPhoneNumber = _signInWithPhoneNumber;
export const PhoneAuthProvider = _PhoneAuthProvider;

// Firestore helpers
export const doc = _doc;
export const setDoc = _setDoc;
export const getDoc = _getDoc;
