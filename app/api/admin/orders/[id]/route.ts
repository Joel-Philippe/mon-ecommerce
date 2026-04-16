
import { NextRequest, NextResponse } from 'next/server';
import { db, admin } from '@/utils/firebaseAdmin';
import { sendStatusUpdateEmail } from '@/utils/resendEmailService';

// ... (verifyAdmin function remains the same)

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
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const orderData = { id: orderDoc.id, ...orderDoc.data() };
    await orderRef.update({ 
      status: newStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Envoyer l'email de notification
    try {
      await sendStatusUpdateEmail(orderData, newStatus);
      console.log(`✅ Notification par email envoyée pour la commande ${id} (Statut: ${newStatus})`);
    } catch (emailError) {
      console.error(`❌ Échec de l'envoi de l'email pour la commande ${id}:`, emailError);
      // On ne fait pas échouer la requête si seul l'email échoue
    }

    return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
  } catch (err: any) {
    console.error(`Error updating order ${id}:`, err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
