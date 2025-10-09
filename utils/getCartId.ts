import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const CART_COOKIE_NAME = 'guest_cart_id';

export async function getCartId(req?: NextRequest): Promise<string | null> {
  // Server-side call (from Route Handler)
  if (req) {
    const authorization = req.headers.get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.split('Bearer ')[1];
      const { verifyFirebaseToken } = await import('./server-only-verifyFirebaseToken');
      const decodedToken = await verifyFirebaseToken(token);
      if (decodedToken) {
        return decodedToken.uid; // User is authenticated, use UID as cart ID
      }
    }

    // If not authenticated, try to get from cookies (server-side)
    const { cookies } = await import('next/headers');
    return cookies().get(CART_COOKIE_NAME)?.value || null;
  } else {
    // Client-side call (from Client Component)
    // Make an API call to get the cart ID from the server
    try {
      const response = await fetch('/api/cart/get-id');
      if (response.ok) {
        const data = await response.json();
        return data.cartId || null;
      } else {
        console.error("Failed to fetch cart ID from API");
        return null;
      }
    } catch (error) {
      console.error("Error fetching cart ID from API:", error);
      return null;
    }
  }
}

export function ensureGuestCartCookie(existingCartId: string | null, res?: any) {
  // This function is primarily for server-side usage in Route Handlers
  // If called from client, it won't do anything as cookies() is server-only
  if (res) {
    const { cookies } = require('next/headers');
    const cookieStore = cookies();
    if (!cookieStore.get(CART_COOKIE_NAME)?.value && existingCartId) {
        cookieStore.set(CART_COOKIE_NAME, existingCartId, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
            sameSite: 'lax'
        });
    }
  }
}