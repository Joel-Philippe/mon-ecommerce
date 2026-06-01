import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/utils/verifyFirebaseToken";
import { cookies } from "next/headers";
import { getAdminDb, admin } from "@/utils/firebaseAdmin";

const CART_COOKIE_NAME = 'guest_cart_id';

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

    const db = getAdminDb();
    const userId = decodedToken.uid;
    const userCartRef = db.collection("carts").doc(userId);
    const guestCartRef = db.collection("carts").doc(guestCartId);

    const [userCartSnap, guestCartSnap] = await Promise.all([
      userCartRef.get(),
      guestCartRef.get(),
    ]);

    if (!guestCartSnap.exists) {
      return NextResponse.json({ message: "Guest cart not found or already merged" }, { status: 200 });
    }

    const guestItems: CartItem[] = guestCartSnap.data()?.items || [];

    if (guestItems.length === 0) {
      await guestCartRef.delete();
      cookies().delete(CART_COOKIE_NAME);
      return NextResponse.json({ message: "Guest cart was empty. Nothing to merge." }, { status: 200 });
    }

    const userItems: CartItem[] = userCartSnap.exists ? userCartSnap.data()?.items || [] : [];
    const mergedItems: { [productId: string]: CartItem } = {};

    for (const item of userItems) {
      mergedItems[item.productId] = item;
    }

    for (const guestItem of guestItems) {
      if (mergedItems[guestItem.productId]) {
        mergedItems[guestItem.productId].quantity += guestItem.quantity;
      } else {
        mergedItems[guestItem.productId] = guestItem;
      }
    }

    const finalItems = Object.values(mergedItems);
    const batch = db.batch();

    batch.set(
      userCartRef,
      {
        items: finalItems,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    batch.delete(guestCartRef);

    await batch.commit();

    cookies().delete(CART_COOKIE_NAME);

    return NextResponse.json({ message: "Carts merged successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error merging carts:", error);
    return NextResponse.json({ message: "Error merging carts", error: error.message }, { status: 500 });
  }
}