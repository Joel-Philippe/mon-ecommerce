'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  deleteUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useScrollSavingRouter } from '@/hooks/useScrollSavingRouter';
import { auth, db, getClientStorage } from '../components/firebaseConfig.ts';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, getDoc, setDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import Cookies from 'js-cookie';

const CART_COOKIE_NAME = 'guest_cart_id';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userFavorites: string[];
  signup: (email: string, password: string, displayName: string, photoFile: File | null) => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  updateProfilePhoto: (photoFile: File) => Promise<void>;
  reauthenticateUser: (password: string) => Promise<void>;
  acceptRequest: (request: any) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  toggleFavorite: (cardId: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const router = useScrollSavingRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserFavorites([]);
      return () => {}; // Return a no-op cleanup function
    }

    const userDocRef = doc(db, 'users', user.uid);
    console.log("AuthContext: Before onSnapshot - user:", user, "db:", db, "userDocRef:", userDocRef);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserFavorites(data?.favorites || []);
      } else {
        // Create user document if it doesn't exist
        setDoc(userDocRef, { favorites: [] }, { merge: true });
        setUserFavorites([]);
      }
    }, (error) => {
      console.error("Error listening to user favorites:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const mergeGuestCart = async (firebaseUser: User) => {
    const guestCartId = Cookies.get(CART_COOKIE_NAME);
    if (guestCartId && firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        await fetch('/api/cart/merge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ guestCartId }),
        });
        Cookies.remove(CART_COOKIE_NAME);
      } catch (error) {
        console.error("Failed to merge carts:", error);
      }
    }
  };

  const toggleFavorite = async (cardId: string): Promise<void> => {
    if (!user) throw new Error("Utilisateur non connecté");

    const token = await user.getIdToken();
    await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: cardId }),
    });


  };

  const signup = async (email: string, password: string, displayName: string, photoFile: File | null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      let photoURL = '';

      if (photoFile) {
        const clientStorage = getClientStorage();
        const storageRef = ref(clientStorage, `profileImages/${userCredential.user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(userCredential.user, {
        displayName,
        photoURL,
      });

      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser(auth.currentUser);
        await mergeGuestCart(userCredential.user);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error; // Re-throw the original error
    }
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await mergeGuestCart(userCredential.user);
    return userCredential;
  };

  const logout = () => {
    return signOut(auth).then(() => {
      setUser(null);
      router.push('/login');
    });
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateDisplayName = async (displayName: string) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        await auth.currentUser.reload();
        setUser(auth.currentUser);
      }
    } catch (error) {
      console.error('Error updating display name:', error);
      throw new Error('Erreur lors de la mise à jour du pseudo.');
    }
  };

  const updateProfilePhoto = async (photoFile: File) => {
    try {
      if (!auth.currentUser) throw new Error("Utilisateur non connecté");

      const clientStorage = getClientStorage();
      const storageRef = ref(clientStorage, `profileImages/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, photoFile);

      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });

      setUser(auth.currentUser);
      console.log('Photo de profil mise à jour avec succès:', photoURL);
    } catch (error: any) {
      console.error('Erreur réelle Firebase / Storage :', error);
      throw new Error(`Erreur lors de la mise à jour de la photo de profil : ${error.message || error}`);
    }
  };

  const reauthenticateUser = async (password: string) => {
    if (!auth.currentUser || !auth.currentUser.email) throw new Error("Utilisateur non connecté");
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const acceptRequest = async (request: { id: string }) => {
    try {
      const requestRef = doc(db, 'requests', request.id);
      await updateDoc(requestRef, { status: 'accepted' });
    } catch (error) {
      console.error('Error accepting request:', error);
      throw new Error('Erreur lors de l\'acceptation de la demande.');
    }
  };

  const deleteUserAccount = async () => {
    if (!auth.currentUser) throw new Error("Aucun utilisateur connecté");

    const uid = auth.currentUser.uid;

    try {
      await deleteDoc(doc(db, 'users', uid));

      const ordersSnapshot = await getDocs(query(collection(db, 'orders'), where('userId', '==', uid)));
      for (const docSnap of ordersSnapshot.docs) {
        await deleteDoc(doc(db, 'orders', docSnap.id));
      }

      const messagesSnapshot = await getDocs(query(collection(db, 'messages'), where('userId', '==', uid)));
      for (const docSnap of messagesSnapshot.docs) {
        await deleteDoc(doc(db, 'messages', docSnap.id));
      }

      const commentsSnapshot = await getDocs(query(collection(db, 'comments'), where('userId', '==', uid)));
      for (const docSnap of commentsSnapshot.docs) {
        await deleteDoc(doc(db, 'comments', docSnap.id));
      }

      const ratingsSnapshot = await getDocs(query(collection(db, 'ratings'), where('userId', '==', uid)));
      for (const docSnap of ratingsSnapshot.docs) {
        await deleteDoc(doc(db, 'ratings', docSnap.id));
      }

      await deleteUser(auth.currentUser);
    } catch (error) {
      console.error("Erreur lors de la suppression du compte : ", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await mergeGuestCart(userCredential.user);
      // Ensure user document exists
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, { 
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          favorites: [] 
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userFavorites,
      signup,
      login,
      logout,
      resetPassword,
      updateDisplayName,
      updateProfilePhoto,
      reauthenticateUser,
      acceptRequest,
      deleteUserAccount,
      toggleFavorite,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
