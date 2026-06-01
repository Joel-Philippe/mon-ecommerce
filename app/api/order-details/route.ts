import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (req.method !== 'GET') {
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

    const url = new URL(req.url);
    const session_id = url.searchParams.get('session_id');

    if (!session_id || typeof session_id !== 'string') {
      return new Response(JSON.stringify({
        error: 'Session ID manquant ou invalide',
        code: 'INVALID_SESSION_ID',
      }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return new Response(JSON.stringify({
        error: 'Session non trouvée',
        code: 'SESSION_NOT_FOUND',
      }), { status: 404 });
    }

    const orderDetails = {
      sessionId: session.id,
      customer_email: session.customer_email,
      totalPaid: ((session.amount_total || 0) / 100).toFixed(2),
      currency: session.currency?.toUpperCase() || 'EUR',
      payment_status: session.payment_status,
      displayName: session.metadata?.displayName || 'Client',
      created: new Date(session.created * 1000).toLocaleString('fr-FR'),
    };

    return new Response(JSON.stringify(orderDetails), { status: 200 });
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des détails:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR',
    }), { status: 500 });
  }
}
