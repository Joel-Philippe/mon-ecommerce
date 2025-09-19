import { db } from "@/components/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cartId = await getCartId(req);

    if (!cartId) {
      // No cart ID means it's a new guest with nothing in their cart yet.
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const cartRef = doc(db, "carts", cartId);
    const cartSnap = await getDoc(cartRef);

    // Ensure the guest cookie is set in the response if a guest cart was used
    ensureGuestCartCookie(cartId);

    if (cartSnap.exists()) {
      return NextResponse.json(cartSnap.data(), { status: 200 });
    } else {
      return NextResponse.json({ items: [] }, { status: 200 }); // Cart ID exists but no cart found
    }
  } catch (error: any) {
    console.error("Error getting cart:", error);
    return NextResponse.json({ message: "Error getting cart", error: error.message }, { status: 500 });
  }
}
