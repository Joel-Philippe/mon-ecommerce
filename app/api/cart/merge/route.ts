
import { db } from "@/components/firebaseConfig";
import { doc, getDoc, writeBatch, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/utils/verifyFirebaseToken";
import { cookies } from "next/headers";

const CART_COOKIE_NAME = 'guest_cart_id';

// Define the structure of a cart item
interface CartItem {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { guestCartId } = await req.json();
    const authorization = req.headers.get('Authorization');

    if (!guestCartId) {
      return NextResponse.json({ message: "Guest cart ID is required" }, { status: 400 });
    }

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ message: "Authorization header is missing or invalid" }, { status: 401 });
    }

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await verifyFirebaseToken(token);

    if (!decodedToken) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const userCartRef = doc(db, "carts", userId);
    const guestCartRef = doc(db, "carts", guestCartId);

    const [userCartSnap, guestCartSnap] = await Promise.all([getDoc(userCartRef), getDoc(guestCartRef)]);

    if (!guestCartSnap.exists()) {
      // If guest cart doesn't exist, there's nothing to merge.
      return NextResponse.json({ message: "Guest cart not found or already merged" }, { status: 200 });
    }

    const guestItems: CartItem[] = guestCartSnap.data()?.items || [];
    if (guestItems.length === 0) {
        // Guest cart is empty, just delete it.
        await deleteDoc(guestCartRef);
        cookies().delete(CART_COOKIE_NAME);
        return NextResponse.json({ message: "Guest cart was empty. Nothing to merge." }, { status: 200 });
    }

    const userItems: CartItem[] = userCartSnap.exists() ? userCartSnap.data()?.items || [] : [];

    // Merge logic
    const mergedItems: { [productId: string]: CartItem } = {};

    // Add user's items to the map
    for (const item of userItems) {
      mergedItems[item.productId] = item;
    }

    // Merge guest's items
    for (const guestItem of guestItems) {
      if (mergedItems[guestItem.productId]) {
        // If item exists, sum quantities
        mergedItems[guestItem.productId].quantity += guestItem.quantity;
      } else {
        // Otherwise, add the new item
        mergedItems[guestItem.productId] = guestItem;
      }
    }

    const finalItems = Object.values(mergedItems);

    // Use a batch write to update user cart and delete guest cart atomically
    const batch = writeBatch(db);
    batch.set(userCartRef, { items: finalItems, updatedAt: new Date() }, { merge: true });
    batch.delete(guestCartRef);

    await batch.commit();

    // Clear the guest cart cookie
    cookies().delete(CART_COOKIE_NAME);

    return NextResponse.json({ message: "Carts merged successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Error merging carts:", error);
    return NextResponse.json({ message: "Error merging carts", error: error.message }, { status: 500 });
  }
}
