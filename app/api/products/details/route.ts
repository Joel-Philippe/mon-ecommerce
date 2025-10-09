import { db } from "@/components/firebaseConfig";
import { collection, query, where, getDocs, documentId } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productIds } = await req.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ message: "Invalid or empty product IDs array" }, { status: 400 });
    }

    const productsRef = collection(db, "cards");
    const q = query(productsRef, where(documentId(), "in", productIds));
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ message: "Error fetching product details", error: error.message }, { status: 500 });
  }
}