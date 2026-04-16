import { db } from '@/components/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendOrderConfirmationEmail } from '@/utils/resendEmailService';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }

  const { email, items, displayName, photoURL } = await req.json();

  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      customer_email: email,
      userDisplayName: displayName || "Anonyme",
      userPhotoURL: photoURL || "",
      items,
      createdAt: serverTimestamp(),
      status: 'paid',
    });

    // Utiliser le service centralisé pour l'envoi d'email
    try {
      await sendOrderConfirmationEmail({
        id: docRef.id,
        customer_email: email,
        userDisplayName: displayName,
        items: items
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