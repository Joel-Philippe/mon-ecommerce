import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";
import { getAdminDb, admin } from "@/utils/firebaseAdmin";

export async function DELETE(req: NextRequest) {
  try {
    const cartId = await getCartId(req);

    if (!cartId) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const db = getAdminDb();
    const cartRef = db.collection("carts").doc(cartId);
    const cartSnap = await cartRef.get();

    ensureGuestCartCookie(cartId);

    if (cartSnap.exists) {
      await cartRef.update({
        items: [],
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ message: "Cart cleared successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return NextResponse.json({ message: "Error clearing cart", error: error.message }, { status: 500 });
  }
}