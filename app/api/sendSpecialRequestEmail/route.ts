import { NextRequest } from 'next/server';
import { clientConfig } from '@/config/client.config';
import { sendGenericEmail } from '@/utils/resendEmailService';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { email, displayName, selectedProducts } = await req.json();

    const productList = selectedProducts.map((product: { title: string; price: string | number }) => `${product.title} - ${product.price}€`).join('\n');

    try {
      const result = await sendGenericEmail({
        to: email,
        subject: 'Synthèse de votre demande spéciale',
        message: `Bonjour ${displayName},\n\nVoici les détails de votre demande spéciale :\n${productList},\n\nVous recevrez une confirmation dans votre compte ${clientConfig.brandName}, dans la rubrique 'Message' lorsque votre demande sera acceptée. \n\nA bientôt !`,
      });

      if (!result.success) {
        return new Response(JSON.stringify({ message: 'Erreur lors de l\'envoi de l\'email', error: result.error }), { status: 500 });
      }

      return new Response(JSON.stringify({ message: 'Email envoyé avec succès', messageId: result.messageId }), { status: 200 });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return new Response(JSON.stringify({ message: 'Erreur lors de l\'envoi de l\'email', error }), { status: 500 });
    }
  } else {
    return new Response(`Méthode ${req.method} non autorisée`, { status: 405 });
  }
}
