import { NextResponse } from 'next/server';
import { db, admin } from '@/utils/firebaseAdmin';

export async function GET() {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL;
    // Note: Dans un cas réel, on vérifierait le token ici. 
    // Pour ce setup exceptionnel, nous allons procéder directement.

    const cardsCol = db.collection('cards');
    
    // 1. Suppression de tous les produits existants
    const snapshot = await cardsCol.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // 2. Préparation des nouveaux produits Supermarché
    const newProducts = [
      {
        title: "Œufs frais (x12)",
        subtitle: "Origine France - Plein air",
        categorie: "Produits Frais",
        price: "3.50",
        stock: 50,
        stock_reduc: 0,
        images: ["/images/oeufs.jpg"], // Utilisez vos placeholders ou images réelles
        description: "Boîte de 12 œufs frais de catégorie A.",
        time: new Date(Date.now() + 86400000 * 7).toISOString(), // Expire dans 7 jours
        deliveryTime: "24h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Rayon Frais",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Tomates Grappe",
        subtitle: "Le kilo",
        categorie: "Fruits & Légumes",
        price: "2.90",
        stock: 100,
        stock_reduc: 0,
        images: ["/images/tomates.jpg"],
        description: "Tomates grappes juteuses et savoureuses.",
        time: new Date(Date.now() + 86400000 * 5).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Primeur",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Pâtes Spaghetti n°5",
        subtitle: "Sachet de 500g",
        categorie: "Épicerie",
        price: "1.20",
        stock: 200,
        stock_reduc: 0,
        images: ["/images/pates.jpg"],
        description: "Pâtes de qualité supérieure à la semoule de blé dur.",
        time: new Date(Date.now() + 86400000 * 30).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Sardines à l'huile d'olive",
        subtitle: "La boîte de 125g",
        categorie: "Conserves",
        price: "1.85",
        stock: 150,
        stock_reduc: 0,
        images: ["/images/sardines.jpg"],
        description: "Sardines préparées à l'ancienne, riches en Oméga 3.",
        time: new Date(Date.now() + 86400000 * 60).toISOString(),
        deliveryTime: "48h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Mayonnaise Onctueuse",
        subtitle: "Bocal de 250ml",
        categorie: "Épicerie",
        price: "2.10",
        stock: 80,
        stock_reduc: 0,
        images: ["/images/mayo.jpg"],
        description: "Mayonnaise aux œufs de poules élevées en plein air.",
        time: new Date(Date.now() + 86400000 * 15).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Sauce Tomate Basilic",
        subtitle: "Pot de 400g",
        categorie: "Conserves",
        price: "1.95",
        stock: 120,
        stock_reduc: 0,
        images: ["/images/sauce-tomate.jpg"],
        description: "Sauce cuisinée à la tomate et au basilic frais.",
        time: new Date(Date.now() + 86400000 * 20).toISOString(),
        deliveryTime: "48h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      }
    ];

    // 3. Insertion des nouveaux produits
    for (const prod of newProducts) {
      await cardsCol.add({
        ...prod,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Catalogue Family Market initialisé. Anciens produits supprimés, nouveaux produits ajoutés.' 
    });
  } catch (error: any) {
    console.error('Erreur Setup Market:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
