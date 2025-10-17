import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { db } from '@/components/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Define the structure of an item sent from the client
interface CartItem {
  _id: string; // Product ID
  count: number;
}

import { Card } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Invalid cart items' }, { status: 400 });
    }

    const line_items = await Promise.all(items.map(async (item: CartItem) => {
      const productRef = doc(db, 'cards', item._id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        // This error will be caught by the outer try-catch block
        throw new Error(`Product with ID ${item._id} not found.`);
      }

      const product = productSnap.data() as Card;
      const availableStock = (product.stock || 0) - (product.stock_reduc || 0);

      if (availableStock < item.count) {
        throw new Error(`Stock insuffisant pour le produit "${product.title}". Demandé: ${item.count}, Disponible: ${availableStock}`);
      }
      // Sanitize and parse prices, handling comma as decimal separator
      const promoPrice = product.price_promo ? parseFloat(product.price_promo.replace(',', '.')) : 0;
      const regularPrice = product.price ? parseFloat(product.price.replace(',', '.')) : 0;

      // Use promo price if it's valid and greater than zero
      const priceToUse = (promoPrice > 0) ? promoPrice : regularPrice;

      if (isNaN(priceToUse) || priceToUse <= 0) {
        throw new Error(`Invalid or zero price for product with ID ${item._id}.`);
      }

      const amountInCents = Math.round(priceToUse * 100);

      if (amountInCents <= 0) {
        // Stripe requires a positive integer
        throw new Error(`Amount for product ${item._id} must be greater than zero.`);
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.title,
            images: product.images && product.images.length > 0 ? [product.images[0]] : [],
            metadata: {
              productId: item._id,
            },
          },
          unit_amount: amountInCents,
        },
        quantity: item.count,
      };
    }));

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`, // Redirect to home on cancellation
      shipping_address_collection: {
        allowed_countries: ['FR', 'US', 'CA', 'GB', 'DE', 'BE', 'CH', 'LU', 'ES', 'IT', 'PT'],
      },
      billing_address_collection: 'required',
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Error creating Checkout Session:", error);
    return NextResponse.json({ message: 'Error creating Checkout Session', error: error.message }, { status: 500 });
  }
}