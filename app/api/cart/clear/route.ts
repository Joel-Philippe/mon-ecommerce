import { db } from "@/components/firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";

export async function DELETE(req: NextRequest) {
  try {
    const cartId = await getCartId(req);

    if (!cartId) {
      // If there's no cartId, there's nothing to clear.
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const cartRef = doc(db, "carts", cartId);
    const cartSnap = await getDoc(cartRef);

    ensureGuestCartCookie(cartId);

    if (cartSnap.exists()) {
        // Set items to an empty array to clear the cart
        await updateDoc(cartRef, { items: [], updatedAt: serverTimestamp() });
    }
    // If the cart doesn't exist, it's already "cleared", so we can return success.

    return NextResponse.json({ message: "Cart cleared successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return NextResponse.json({ message: "Error clearing cart", error: error.message }, { status: 500 });
  }
}
