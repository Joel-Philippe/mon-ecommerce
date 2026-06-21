import { NextRequest, NextResponse } from "next/server";
import { getCartId, ensureGuestCartCookie } from "@/utils/getCartId";
import { getAdminDb, admin } from "@/utils/firebaseAdmin";

export async function PUT(req: NextRequest) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== "number" || quantity < 0) {
      return NextResponse.json({ message: "Invalid product ID or quantity" }, { status: 400 });
    }

    const cartId = await getCartId(req);

    if (!cartId) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
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

      if (quantity > availableStock) {
        console.error("--- INSUFFICIENT STOCK ERROR ---", {
          productId,
          requestedQuantity: quantity,
          availableStock,
          totalStock: productData.stock,
          reducedStock: productData.stock_reduc,
        });
        throw new Error("Insufficient stock");
      }

      const cartSnap = await transaction.get(cartRef);

      if (!cartSnap.exists) {
        throw new Error("Cart not found");
      }

      const cartData = cartSnap.data();
      const items = cartData?.items || [];
      const existingItemIndex = items.findIndex((item: any) => item.productId === productId);

      if (existingItemIndex > -1) {
        if (quantity === 0) {
          items.splice(existingItemIndex, 1);
        } else {
          items[existingItemIndex].quantity = quantity;
        }

        transaction.update(cartRef, {
          items,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else if (quantity > 0) {
        items.push({ productId, quantity });

        transaction.update(cartRef, {
          items,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });

    ensureGuestCartCookie(cartId);

    return NextResponse.json({ message: "Cart updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ message: error.message || "Error updating cart" }, { status: 500 });
  }
}