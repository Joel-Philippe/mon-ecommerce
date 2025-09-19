import { db } from "@/components/firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";

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

    const cartRef = doc(db, "carts", cartId);
    const cartSnap = await getDoc(cartRef);

    ensureGuestCartCookie(cartId);

    if (!cartSnap.exists()) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const cartData = cartSnap.data();
    let items = cartData.items || [];
    const initialLength = items.length;

    items = items.filter((item: any) => item.productId !== productId);

    if (items.length < initialLength) {
      await updateDoc(cartRef, { items, updatedAt: serverTimestamp() });
      return NextResponse.json({ message: "Item removed from cart successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json({ message: "Error removing item from cart", error: error.message }, { status: 500 });
  }
}
