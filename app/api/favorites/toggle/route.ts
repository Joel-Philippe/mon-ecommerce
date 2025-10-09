
import { NextResponse } from 'next/server';
import { admin } from '@/utils/firebaseAdmin';

export async function POST(request: Request) {
  const { productId } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const idToken = request.headers.get('authorization')?.split('Bearer ')[1];

  if (!idToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const firestore = admin.firestore();

    const userRef = firestore.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data()!;
    const currentFavorites = userData.favorites || [];

    if (currentFavorites.includes(productId)) {
      // Remove from favorites
      await userRef.update({
        favorites: admin.firestore.FieldValue.arrayRemove(productId)
      });
      return NextResponse.json({ message: 'Removed from favorites' });
    } else {
      // Add to favorites
      await userRef.update({
        favorites: admin.firestore.FieldValue.arrayUnion(productId)
      });
      return NextResponse.json({ message: 'Added to favorites' });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
