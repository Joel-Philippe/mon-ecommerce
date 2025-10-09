import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

const CART_COOKIE_NAME = 'guest_cart_id';

export async function GET(req: NextRequest) {
  let cartId = cookies().get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    cartId = uuidv4();
    cookies().set(CART_COOKIE_NAME, cartId, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax'
    });
  }

  return NextResponse.json({ cartId });
}
