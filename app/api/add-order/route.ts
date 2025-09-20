import { db } from "@/components/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export interface OrderItem {
  _id: string;
  title: string;
  count: number;
  price: number | string;
  price_promo?: number | string;
  deliveryTime?: string;
}

export interface OrderData {
  customer_email: string;
  displayName?: string;
  deliveryInfo: {
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    contactNumber: string;
  };
  items: OrderItem[];
  paymentIntentId: string;
  userId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { 
        customer_email, 
        displayName, 
        deliveryInfo, 
        items, 
        paymentIntentId, 
        userId 
    } = await req.json() as OrderData;

    if (!customer_email || !deliveryInfo || !items || !Array.isArray(items) || items.length === 0 || !paymentIntentId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const orderData: any = {
      customer_email,
      displayName: displayName || "Client",
      deliveryInfo,
      items,
      paymentIntentId,
      status: 'paid', // Add an initial status
      createdAt: serverTimestamp(),
    };

    if (userId) {
      orderData.userId = userId;
    }

    const docRef = await addDoc(collection(db, "orders"), orderData);
    return NextResponse.json({
      message: "Order recorded successfully",
      orderId: docRef.id,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error recording order:", error);
    return NextResponse.json({ message: "Error recording order", error: error.message }, { status: 500 });
  }
}
