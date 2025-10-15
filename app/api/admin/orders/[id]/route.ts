
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, status } = await verifyAdmin(req);
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  const { id } = params;
  const { status: newStatus } = await req.json();

  if (!newStatus) {
    return NextResponse.json({ message: 'Missing status' }, { status: 400 });
  }

  try {
    const orderRef = db.collection('orders').doc(id);
    await orderRef.update({ status: newStatus });

    return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
  } catch (err: any) {
    console.error(`Error updating order ${id}:`, err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
