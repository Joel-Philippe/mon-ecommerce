import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { admin } from '@/utils/firebaseAdmin'; // Using admin SDK for server-side operations
const db = admin.firestore();
import Stripe from 'stripe';

// This is your Stripe CLI webhook secret for testing.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function createOrderInFirestore(session: Stripe.PaymentIntent) {
    if (!session.metadata?.customer_email || !session.metadata?.line_items) {
        console.error('Missing metadata for order creation', session.id);
        return;
    }

    const lineItemsFromMetadata = JSON.parse(session.metadata.line_items);
    const enrichedItems = [];

    // Enrich items with details from Firestore
    for (const item of lineItemsFromMetadata) {
        const productRef = db.collection('cards').doc(item.productId);
        const productSnap = await productRef.get();

        if (productSnap.exists) {
            const productData = productSnap.data();
            enrichedItems.push({
                ...item,
                title: productData?.title || 'Article sans nom', // Add title from product data
            });
        } else {
            enrichedItems.push({
                ...item,
                title: 'Article supprimé',
            });
        }
    }

    const orderData = {
        stripePaymentIntentId: session.id,
        amount: session.amount, // This is in cents
        receiverEmail: session.metadata.customer_email,
        items: enrichedItems, // Array of { productId, quantity, price, title }
        status: 'paid',
        createdAt: new Date(),
    };

    try {
        const orderRef = await db.collection('orders').add(orderData);
        console.log(`Order ${orderRef.id} created successfully for Payment Intent ${session.id}`);
    } catch (error) {
        console.error('Error creating order in Firestore:', error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;

  try {
    if (!sig) {
        throw new Error('Missing stripe-signature header');
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      try {
        await createOrderInFirestore(paymentIntent);
      } catch (error) {
        console.error('Failed to handle payment_intent.succeeded', error);
        return NextResponse.json({ error: 'Failed to create order in database.' }, { status: 500 });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}