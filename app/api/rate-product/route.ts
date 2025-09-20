import { db } from '@/components/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { verifyFirebaseToken } from '@/utils/verifyFirebaseToken';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), { status: 405 });
  }

  const { rating, comment = '', productId } = await req.json();
  const authHeader = req.headers.get('authorization');

  // Log de débogage
  console.log('POST /api/rate-product body:', { rating, comment, productId });
  console.log('Authorization header:', authHeader);

  // Validation de productId
  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return new Response(JSON.stringify({ success: false, message: 'ProductId invalide.' }), { status: 400 });
  }

  // Validation de rating
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return new Response(JSON.stringify({ success: false, message: 'Rating invalide. Il doit être un nombre entre 1 et 5.' }), { status: 400 });
  }

  // Validation du header Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized: No or malformed token' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decodedUser = await verifyFirebaseToken(token);

  if (!decodedUser) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized: Invalid token' }), { status: 401 });
  }

  const userId = decodedUser.uid;

  try {
    const cardRef = doc(db, 'cards', productId);
    const cardSnap = await getDoc(cardRef);

    if (!cardSnap.exists()) {
      return new Response(JSON.stringify({ success: false, message: 'Produit introuvable.' }), { status: 404 });
    }

    const cardData = cardSnap.data();
    const existingReviews = cardData?.reviews || [];

    const alreadyVoted = existingReviews.some((r: any) => r.userId === userId);
    if (alreadyVoted) {
      return new Response(JSON.stringify({ success: false, message: 'Vous avez déjà noté ce produit.' }), { status: 400 });
    }

    const newReview = {
      userId,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    const updatedReviews = [...existingReviews, newReview];
    const newAverage =
      updatedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / updatedReviews.length;

    await updateDoc(cardRef, {
      reviews: updatedReviews,
      stars: parseFloat(newAverage.toFixed(1)),
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Vote enregistré.',
      newAverage,
      reviews: updatedReviews,
    }), { status: 200 });
  } catch (error: any) {
    console.error('Erreur serveur dans /api/rate-product:', error);
    return new Response(JSON.stringify({ success: false, message: error.message || 'Erreur interne.' }), { status: 500 });
  }
}
