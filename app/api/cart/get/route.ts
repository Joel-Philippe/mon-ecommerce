import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";
import { getAdminDb } from "@/utils/firebaseAdmin";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cartId = await getCartId(req);

    if (!cartId) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const db = getAdminDb();
    const cartRef = db.collection("carts").doc(cartId);
    const cartSnap = await cartRef.get();

    ensureGuestCartCookie(cartId);

    if (cartSnap.exists) {
      return NextResponse.json(cartSnap.data(), { status: 200 });
    }

    return NextResponse.json({ items: [] }, { status: 200 });
  } catch (error: any) {
    console.error("Error getting cart:", error);
    return NextResponse.json({ message: "Error getting cart", error: error.message }, { status: 500 });
  }
}