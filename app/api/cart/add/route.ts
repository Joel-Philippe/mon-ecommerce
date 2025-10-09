import { db } from "@/components/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, runTransaction } from "firebase/firestore";
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
      return NextResponse.json({ message: "Could not determine cart ID" }, { status: 500 });
    }

    const cartRef = doc(db, "carts", cartId);
    const productRef = doc(db, "cards", productId);

    await runTransaction(db, async (transaction) => {
      const productSnap = await transaction.get(productRef);
      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      const productData = productSnap.data();
      const availableStock = productData.stock - productData.stock_reduc;

      const cartSnap = await transaction.get(cartRef);
      const cartData = cartSnap.exists() ? cartSnap.data() : { items: [] };
      const items = cartData.items || [];
      const existingItemIndex = items.findIndex((item: any) => item.productId === productId);

      let newQuantity = quantity;
      if (existingItemIndex > -1) {
        newQuantity += items[existingItemIndex].quantity;
      }

      if (newQuantity > availableStock) {
        throw new Error("Insufficient stock");
      }

      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity = newQuantity;
      } else {
        items.push({ productId, quantity });
      }

      if (cartSnap.exists()) {
        transaction.update(cartRef, { items, updatedAt: serverTimestamp() });
      } else {
        transaction.set(cartRef, {
          items,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    });

    ensureGuestCartCookie(cartId);

    return NextResponse.json({ message: "Item added to cart successfully", cartId }, { status: 200 });
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ message: error.message || "Error adding item to cart" }, { status: 500 });
  }
}