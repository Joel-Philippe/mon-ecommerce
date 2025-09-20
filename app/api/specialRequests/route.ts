import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

interface ProductWithDeliveryTime {
  title: string;
  deliveryTime: string;
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Formatage des sauts de ligne
};

if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
  });
}

const db = getFirestore();

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const { email, productTitle, deliveryTime } = await req.json(); // Ajout du champ deliveryTime dans la requête

  try {
    const docRef = await db.collection('specialRequests').add({
      email,
      productTitle,
      deliveryTime: deliveryTime || 'Non défini', // Ajout du champ deliveryTime
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ message: 'Special request submitted successfully', id: docRef.id }), { status: 200 });
  } catch (error) {
    console.error('Error submitting special request:', error);
    return new Response(JSON.stringify({ message: 'Error submitting special request', error }), { status: 500 });
  }
}

export async function GET(req: Request) {
  if (req.method !== 'GET') {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const url = new URL(req.url);
  const productTitle = url.searchParams.get('productTitle');

  try {
    // Rechercher les acheteurs des produits correspondants avec leur temps de livraison
    const purchasesSnapshot = await db.collection('userCarts')
      .where('items', 'array-contains', { title: productTitle })
      .get();

    const buyers = new Set();
    const productsWithDeliveryTime: ProductWithDeliveryTime[] = [];

    purchasesSnapshot.forEach(doc => {
      const data = doc.data();
      const userEmail = data.userEmail;

      // Parcourir les items pour extraire le temps de livraison
      data.items.forEach((item: { title: string; deliveryTime?: string }) => {
        if (item.title === productTitle) {
          buyers.add(userEmail);
          productsWithDeliveryTime.push({
            title: item.title,
            deliveryTime: item.deliveryTime || 'Non défini', // Récupérer le temps de livraison s'il existe
          });
        }
      });
    });

    return new Response(JSON.stringify({
      buyers: Array.from(buyers),
      productsWithDeliveryTime, // Renvoie des produits avec le temps de livraison
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching buyers or products:', error);
    return new Response(JSON.stringify({ message: 'Error fetching buyers or products', error }), { status: 500 });
  }
}
