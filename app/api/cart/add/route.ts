import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";
import { getAdminDb, admin } from "@/utils/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json({ message: "Invalid product ID or quantity" }, { status: 400 });
    }

    const cartId = await getCartId(req);

    if (!cartId) {
      return NextResponse.json({ message: "Could not determine cart ID" }, { status: 500 });
    }

    const db = getAdminDb();
    const cartRef = db.collection("carts").doc(cartId);
    const productRef = db.collection("cards").doc(productId);

    await db.runTransaction(async (transaction) => {
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists) {
        throw new Error("Product not found");
      }

      const productData = productSnap.data();

      if (!productData) {
        throw new Error("Product data not found");
      }

      const availableStock = productData.stock - productData.stock_reduc;

      const cartSnap = await transaction.get(cartRef);
      const cartData = cartSnap.exists ? cartSnap.data() : { items: [] };
      const items = cartData?.items || [];
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

      const now = admin.firestore.FieldValue.serverTimestamp();

      if (cartSnap.exists) {
        transaction.update(cartRef, { items, updatedAt: now });
      } else {
        transaction.set(cartRef, {
          items,
          createdAt: now,
          updatedAt: now,
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