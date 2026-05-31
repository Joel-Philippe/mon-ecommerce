// utils/firebaseAdmin.ts
// utils/firebaseAdmin.ts
import * as admin from 'firebase-admin';

let db: ReturnType<typeof admin.firestore> | undefined;

export { admin };

export function hasFirebaseAdminConfig() {
    return !!process.env.FIREBASE_PROJECT_ID && !!process.env.FIREBASE_CLIENT_EMAIL && !!process.env.FIREBASE_PRIVATE_KEY;
}

export function getAdminApp() {
    if (!admin.apps.length) {
        if (!hasFirebaseAdminConfig()) {
            throw new Error('Firebase Admin configuration is incomplete. Please check your environment variables.');
        }
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    return admin.app();
}

export function getAdminDb() {
    getAdminApp(); // Ensure that the app is initialized
    if (!db) {
        db = admin.firestore();
    }
    return db;
}