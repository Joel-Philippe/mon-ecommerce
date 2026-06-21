import { getAdminDb, admin } from '@/utils/firebaseAdmin';
import { sendOrderConfirmationEmail } from '@/utils/resendEmailService';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }

  const { email, items, displayName, photoURL } = await req.json();

  try {
    const db = getAdminDb();
    const docRef = await db.collection('orders').add({
      customer_email: email,
      userDisplayName: displayName || "Anonyme",
      userPhotoURL: photoURL || "",
      items,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'paid',
    });

    try {
      await sendOrderConfirmationEmail({
        id: docRef.id,
        customer_email: email,
        userDisplayName: displayName,
        items,
      });
      console.log(`✅ Email de confirmation envoyé pour la commande ${docRef.id}`);
    } catch (emailError) {
      console.error('❌ Échec de l\'envoi de l\'email de confirmation:', emailError);
    }

    return new Response(JSON.stringify({ message: 'Purchase completed', orderId: docRef.id }), { status: 200 });
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return new Response(JSON.stringify({ message: `Error processing purchase: ${error.message}` }), { status: 500 });
  }
}