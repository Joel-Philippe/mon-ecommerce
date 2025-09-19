import { db } from "@/components/firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";

export async function PUT(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ message: "Invalid product ID or quantity" }, { status: 400 });
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
    const existingItemIndex = items.findIndex((item: any) => item.productId === productId);

    if (existingItemIndex > -1) {
      if (quantity === 0) {
        // Remove item if quantity is 0
        items.splice(existingItemIndex, 1);
      } else {
        // Update quantity
        items[existingItemIndex].quantity = quantity;
      }
      await updateDoc(cartRef, { items, updatedAt: serverTimestamp() });
      return NextResponse.json({ message: "Cart updated successfully" }, { status: 200 });
    } else {
      // If the item does not exist, we cannot update it.
      // Depending on desired behavior, you could add it, but for an update route, this is appropriate.
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ message: "Error updating cart", error: error.message }, { status: 500 });
  }
}
