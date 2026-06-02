import Stripe from 'stripe';
import { getAdminDb, admin } from '@/utils/firebaseAdmin';

interface MetadataItem {
  id: string;
  title: string;
  count: number;
  price: number;
  price_promo?: number;
}

async function releaseReservedStock(metadataItems: MetadataItem[]): Promise<void> {
  try {
    const db = getAdminDb();

    await db.runTransaction(async (transaction) => {
      for (const item of metadataItems) {
        if (!item.id) continue;

        const productRef = db.collection('cards').doc(item.id);
        const productSnap = await transaction.get(productRef);

        if (productSnap.exists) {
          transaction.update(productRef, {
            stock_reduc: admin.firestore.FieldValue.increment(-item.count),
          });

          console.log(`🔄 Stock libéré pour ${item.title}: ${item.count} unité(s)`);
        }
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la libération du stock:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return new Response(JSON.stringify({
        error: 'Stripe secret key is not configured',
        code: 'STRIPE_SECRET_KEY_MISSING',
      }), { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });

    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(JSON.stringify({
        error: 'Session ID manquant',
        code: 'MISSING_SESSION_ID',
      }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return new Response(JSON.stringify({
        error: 'Session non trouvée',
        code: 'SESSION_NOT_FOUND',
      }), { status: 404 });
    }

    if (session.metadata?.stockReserved !== 'true') {
      return new Response(JSON.stringify({
        message: 'Aucun stock à libérer pour cette session',
        released: false,
      }), { status: 200 });
    }

    const metadataItems = JSON.parse(session.metadata?.items as string || '[]') as MetadataItem[];

    if (metadataItems.length === 0) {
      return new Response(JSON.stringify({
        message: 'Aucun produit à traiter',
        released: false,
      }), { status: 200 });
    }

    await releaseReservedStock(metadataItems);

    console.log(`✅ Stock libéré avec succès pour la session: ${sessionId}`);

    return new Response(JSON.stringify({
      message: 'Stock libéré avec succès',
      released: true,
      itemsCount: metadataItems.length,
    }), { status: 200 });
  } catch (error: any) {
    console.error('❌ Erreur lors de la libération du stock:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR',
    }), { status: 500 });
  }
}