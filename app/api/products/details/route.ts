import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, admin } from "@/utils/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { productIds } = await req.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ message: "Invalid or empty product IDs array" }, { status: 400 });
    }

    const db = getAdminDb();
    const productsRef = db.collection("cards");
    const querySnapshot = await productsRef
      .where(admin.firestore.FieldPath.documentId(), "in", productIds)
      .get();

    const products = querySnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ message: "Error fetching product details", error: error.message }, { status: 500 });
  }
}