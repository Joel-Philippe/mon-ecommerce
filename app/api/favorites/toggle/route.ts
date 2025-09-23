
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { initAdmin } from '@/utils/firebaseAdmin';
import { db } from '@/components/firebaseConfig'; // Assurez-vous que ce chemin est correct

export async function POST(request: Request) {
  
  const auth = getAuth();

  const { productId } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const idToken = request.headers.get('authorization')?.split('Bearer ')[1];

  if (!idToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    const currentFavorites = userData.favorites || [];

    if (currentFavorites.includes(productId)) {
      // Remove from favorites
      await updateDoc(userRef, {
        favorites: arrayRemove(productId)
      });
      return NextResponse.json({ message: 'Removed from favorites' });
    } else {
      // Add to favorites
      await updateDoc(userRef, {
        favorites: arrayUnion(productId)
      });
      return NextResponse.json({ message: 'Added to favorites' });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
