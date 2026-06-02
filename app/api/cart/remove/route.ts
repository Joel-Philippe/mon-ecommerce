import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";
import { getAdminDb, admin } from "@/utils/firebaseAdmin";

export async function DELETE(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const cartId = await getCartId(req);

    if (!cartId) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const db = getAdminDb();
    const cartRef = db.collection("carts").doc(cartId);
    const cartSnap = await cartRef.get();

    ensureGuestCartCookie(cartId);

    if (!cartSnap.exists) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const cartData = cartSnap.data();
    let items = cartData?.items || [];
    const initialLength = items.length;

    items = items.filter((item: any) => item.productId !== productId);

    if (items.length < initialLength) {
      await cartRef.update({
        items,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ message: "Item removed from cart successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
  } catch (error: any) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json({ message: "Error removing item from cart", error: error.message }, { status: 500 });
  }
}
