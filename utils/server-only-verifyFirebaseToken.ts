// utils/server-only-verifyFirebaseToken.ts
'use server';
import { admin } from './firebaseAdmin';

export async function verifyFirebaseToken(token: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // contient uid, email, etc.
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
