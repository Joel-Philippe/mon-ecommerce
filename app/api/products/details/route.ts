import { db } from "@/components/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productIds } = await req.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ message: "Invalid or empty productIds array" }, { status: 400 });
    }

    const productsRef = collection(db, "cards"); // Assuming your products are in a 'cards' collection
    const q = query(productsRef, where("__name__", "in", productIds)); // Query by document ID

    const querySnapshot = await getDocs(q);
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ _id: doc.id, ...doc.data() });
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ message: "Error fetching product details", error: error.message }, { status: 500 });
  }
}
