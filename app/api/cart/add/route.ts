import { db } from "@/components/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ message: "Invalid product ID or quantity" }, { status: 400 });
    }

    const cartId = await getCartId(req);

    if (!cartId) {
      // This case should ideally not happen if getCartId always returns a new UUID for guests
      return NextResponse.json({ message: "Could not determine cart ID" }, { status: 500 });
    }

    const cartRef = doc(db, "carts", cartId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      // Cart exists, update it
      const cartData = cartSnap.data();
      const items = cartData.items || [];
      const existingItemIndex = items.findIndex((item: any) => item.productId === productId);

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        items[existingItemIndex].quantity += quantity;
      } else {
        // New item, add to array
        items.push({ productId, quantity });
      }
      await updateDoc(cartRef, { items, updatedAt: serverTimestamp() });
    } else {
      // Cart does not exist, create it
      await setDoc(cartRef, {
        items: [{ productId, quantity }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Ensure the guest cookie is set in the response if a guest cart was used
    ensureGuestCartCookie(cartId);

    return NextResponse.json({ message: "Item added to cart successfully", cartId }, { status: 200 });
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ message: "Error adding item to cart", error: error.message }, { status: 500 });
  }
}
