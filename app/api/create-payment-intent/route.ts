import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { items, delivery } = await req.json();

  // ✅ Validation : s'assurer que items est un tableau
  if (!Array.isArray(items)) {
    return new Response(JSON.stringify({ error: '`items` is required and must be an array' }), { status: 400 });
  }

  try {
    // ✅ Calcul du montant total
    const amount = items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        items: JSON.stringify(items),
        ...(delivery ? { delivery: JSON.stringify(delivery) } : {})
      },
      automatic_payment_methods: { enabled: true }
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
  } catch (err) {
    console.error('Stripe Payment Error:', err); // ✅ debug dans le terminal
    return new Response(JSON.stringify({ error: 'Erreur lors de la création du paiement' }), { status: 500 });
  }
}
