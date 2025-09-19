import Stripe from 'stripe';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

interface MetadataItem {
  id: string;
  title: string;
  count: number;
  price: number;
  price_promo?: number;
}

// Fonction pour libérer le stock réservé
async function releaseReservedStock(metadataItems: MetadataItem[]): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      for (const item of metadataItems) {
        if (!item.id) continue;

        const productRef = doc(db, 'cards', item.id);
        const productSnap = await transaction.get(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          const currentStockReduc = Number(productData.stock_reduc || 0);
          const newStockReduc = Math.max(0, currentStockReduc - item.count);
          
          transaction.update(productRef, {
            stock_reduc: newStockReduc
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
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(JSON.stringify({ 
        error: 'Session ID manquant',
        code: 'MISSING_SESSION_ID'
      }), { status: 400 });
    }

    // Récupérer les détails de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return new Response(JSON.stringify({ 
        error: 'Session non trouvée',
        code: 'SESSION_NOT_FOUND'
      }), { status: 404 });
    }

    // Vérifier si le stock était réservé
    if (session.metadata?.stockReserved !== 'true') {
      return new Response(JSON.stringify({ 
        message: 'Aucun stock à libérer pour cette session',
        released: false
      }), { status: 200 });
    }

    // Récupérer les items de la session
    const metadataItems = JSON.parse(session.metadata?.items as string || '[]') as MetadataItem[];

    if (metadataItems.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'Aucun produit à traiter',
        released: false
      }), { status: 200 });
    }

    // Libérer le stock réservé
    await releaseReservedStock(metadataItems);

    console.log(`✅ Stock libéré avec succès pour la session: ${sessionId}`);

    return new Response(JSON.stringify({ 
      message: 'Stock libéré avec succès',
      released: true,
      itemsCount: metadataItems.length
    }), { status: 200 });

  } catch (error: any) {
    console.error('❌ Erreur lors de la libération du stock:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    }), { status: 500 });
  }
}
