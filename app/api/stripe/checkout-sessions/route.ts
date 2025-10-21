import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { db } from '@/components/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { verifyFirebaseToken } from '@/utils/server-only-verifyFirebaseToken'; // Import the token verification utility

// Define the structure of an item sent from the client
interface CartItem {
  _id: string; // Product ID
  count: number;
}

import { Card } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    const authorization = req.headers.get('Authorization');
    let isAuthenticated = false;

    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.split('Bearer ')[1];
      const decodedToken = await verifyFirebaseToken(token);
      if (decodedToken) {
        isAuthenticated = true;
      }
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Invalid cart items' }, { status: 400 });
    }

    const line_items = await Promise.all(items.map(async (item: CartItem) => {
      const productRef = doc(db, 'cards', item._id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error(`Product with ID ${item._id} not found.`);
      }

      const product = productSnap.data() as Card;
      const availableStock = (product.stock || 0) - (product.stock_reduc || 0);

      if (availableStock < item.count) {
        throw new Error(`Stock insuffisant pour le produit "${product.title}". Demandé: ${item.count}, Disponible: ${availableStock}`);
      }
      
      const promoPrice = product.price_promo ? parseFloat(product.price_promo.replace(',', '.')) : 0;
      const regularPrice = product.price ? parseFloat(product.price.replace(',', '.')) : 0;

      // Apply promo price only if user is authenticated and promo price is valid
      const priceToUse = isAuthenticated && promoPrice > 0 ? promoPrice : regularPrice;

      if (isNaN(priceToUse) || priceToUse <= 0) {
        throw new Error(`Invalid or zero price for product with ID ${item._id}.`);
      }

      const amountInCents = Math.round(priceToUse * 100);

      if (amountInCents <= 0) {
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

    const sessionOptions: any = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_creation: 'if_required',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'US', 'CA', 'GB', 'DE', 'BE', 'CH', 'LU', 'ES', 'IT', 'PT'],
      },
    };

    if (isAuthenticated) {
      sessionOptions.billing_address_collection = 'required';
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Error creating Checkout Session:", error);
    return NextResponse.json({ message: 'Error creating Checkout Session', error: error.message }, { status: 500 });
  }
}