import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:placeholder",
};

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

function getClientApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase client app can only be used in the browser.");
  }

  if (cachedApp) {
    return cachedApp;
  }

  cachedApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return cachedApp;
}

export function getClientAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(getClientApp());
  }

  return cachedAuth;
}

export function getClientDb(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getClientApp());
  }

  return cachedDb;
}

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getClientAuth() as any)[prop];
  },
});

export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getClientDb() as any)[prop];
  },
});

export const getClientStorage = (): FirebaseStorage => {
  return getStorage(getClientApp());
};
