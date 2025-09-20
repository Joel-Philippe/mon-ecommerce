
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyFirebaseToken } from './verifyFirebaseToken';
import { v4 as uuidv4 } from 'uuid';

const CART_COOKIE_NAME = 'guest_cart_id';

/**
 * Retrieves the cart ID for the current user.
 * If the user is authenticated, it returns their Firebase UID.
 * If the user is a guest, it retrieves or creates a guest cart ID from cookies.
 * @param req The NextRequest object.
 * @returns The user's cart ID (either UID or guest ID).
 */
export async function getCartId(req: NextRequest): Promise<string | null> {
  const authorization = req.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await verifyFirebaseToken(token);
    if (decodedToken) {
      return decodedToken.uid; // User is authenticated, use UID as cart ID
    }
  }

  // User is not authenticated, use or create a guest cart ID
  let cartId = cookies().get(CART_COOKIE_NAME)?.value;
  if (!cartId) {
    cartId = uuidv4();
    // Note: Setting cookies here might not be reliable in all edge cases.
    // It's better to set it in the response if a new one is created.
    // For now, we'll assume this works for simplicity, but we'll handle setting it in the response from the route.
  }
  return cartId;
}

/**
 * Ensures a guest cart ID is set in the cookies if one doesn't exist.
 * This should be called in the response path of an API route.
 * @param existingCartId The cart ID that was used for the operation.
 */
export function ensureGuestCartCookie(existingCartId: string | null) {
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
