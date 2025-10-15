import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/utils/firebaseAdmin';

// Fonction pour vérifier le token et les droits d'admin
async function verifyAdmin(req: NextRequest) {
  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const adminEmail = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL;

    if (decodedToken.email !== adminEmail) {
      return { error: 'Forbidden', status: 403 };
    }
    return { user: decodedToken };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { error: 'Unauthorized', status: 401 };
  }
}

export async function GET(req: NextRequest) {
  const { error, status } = await verifyAdmin(req);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  try {
    const ordersRef = db.collection('orders').orderBy('createdAt', 'desc');
    const snapshot = await ordersRef.get();

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convertir le timestamp Firestore en chaîne de caractères ISO
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}