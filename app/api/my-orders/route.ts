
import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import { verifyFirebaseToken } from '@/utils/verifyFirebaseToken';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    const decodedToken = await verifyFirebaseToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = decodedToken.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'Email not found in token' }, { status: 400 });
    }

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('customer_email', '==', userEmail));

    const querySnapshot = await getDocs(q);
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    // Sort orders by creation date, newest first
    orders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    return NextResponse.json(orders, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
