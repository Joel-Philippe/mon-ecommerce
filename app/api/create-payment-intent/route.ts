import Stripe from 'stripe';
import { getAdminDb, admin } from "@/utils/firebaseAdmin";

export async function POST(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { items, delivery } = await req.json();

  if (!Array.isArray(items)) {
    return new Response(JSON.stringify({ error: 'items is required and must be an array' }), { status: 400 });
  }

  try {
    const db = getAdminDb();

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: 'Stripe secret key is not configured' }), { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });

    await db.runTransaction(async (transaction) => {
      for (const item of items) {
        const productRef = db.collection("cards").doc(item._id);
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists) {
          throw new Error(`Product with ID ${item._id} not found`);
        }

        const productData = productSnap.data();

        if (!productData) {
          throw new Error(`Product data for ID ${item._id} not found`);
        }

        const availableStock = productData.stock - productData.stock_reduc;

        if (item.count > availableStock) {
          throw new Error(`Insufficient stock for ${item.title}`);
        }

        transaction.update(productRef, {
          stock_reduc: admin.firestore.FieldValue.increment(item.count),
        });
      }
    });

    const amount = items.reduce((total: number, item: any) => {
      const price = item.price_promo > 0 ? item.price_promo : item.price;
      return total + price * item.count;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      metadata: {
        items: JSON.stringify(items),
        ...(delivery ? { delivery: JSON.stringify(delivery) } : {}),
        stockReserved: 'true',
      },
      shipping: delivery ? {
        name: `${delivery.firstName} ${delivery.lastName}`,
        address: {
          line1: delivery.address,
          city: delivery.city,
          postal_code: delivery.postalCode,
          country: delivery.country || 'FR',
        },
      } : undefined,
      automatic_payment_methods: { enabled: true },
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
  } catch (err: any) {
    console.error('Stripe Payment Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Erreur lors de la création du paiement' }), { status: 500 });
  }
}