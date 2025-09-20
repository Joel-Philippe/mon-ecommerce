import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/utils/resendEmailService';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    // Basic validation
    if (!orderData || !orderData.customerEmail) {
      return NextResponse.json({ message: 'Données de commande invalides' }, { status: 400 });
    }

    const result = await sendOrderConfirmationEmail(orderData);

    if (result.success) {
      return NextResponse.json({ message: 'Email de confirmation envoyé avec succès', messageId: result.messageId });
    } else {
      return NextResponse.json({ message: 'Erreur lors de l\'envoi de l\'email', error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erreur API:', error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
}