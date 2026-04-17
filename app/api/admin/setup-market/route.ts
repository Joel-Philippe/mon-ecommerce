import { NextResponse } from 'next/server';
import { db, admin } from '@/utils/firebaseAdmin';

export async function GET() {
  try {
    const cardsCol = db.collection('cards');
    
    // 1. Nettoyage complet
    const snapshot = await cardsCol.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // 2. Catalogue de TEST avec images ULTRA-FIABLES (Pexels/Unsplash)
    const marketProducts = [
      {
        title: "Lait Frais Bio",
        subtitle: "Bouteille 1L",
        categorie: "Produits Frais",
        categorieImage: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#4A90E2",
        price: "1.95",
        stock: 50,
        stock_reduc: 0,
        images: ["https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Lait frais issu de l'agriculture biologique.",
        time: new Date(Date.now() + 86400000 * 5).toISOString(),
        deliveryTime: "24h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Ferme Bio",
        photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Panier de Fruits",
        subtitle: "Assortiment saison",
        categorie: "Fruits & Légumes",
        categorieImage: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#F5A623",
        price: "12.50",
        stock: 30,
        stock_reduc: 5,
        images: ["https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Un mélange de fruits frais de saison.",
        time: new Date(Date.now() + 86400000 * 3).toISOString(),
        deliveryTime: "24h",
        nouveau: true,
        stars: 4,
        prenom_du_proposant: "Le Maraîcher",
        photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Baguette Tradition",
        subtitle: "Faite main",
        categorie: "Boulangerie",
        categorieImage: "https://images.pexels.com/photos/461060/pexels-photo-461060.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#BD10E0",
        price: "1.10",
        stock: 100,
        stock_reduc: 0,
        images: ["https://images.pexels.com/photos/461060/pexels-photo-461060.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Pain croustillant cuit chaque matin.",
        time: new Date(Date.now() + 3600000 * 8).toISOString(),
        deliveryTime: "2h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Maître Boulanger",
        photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      }
    ];

    for (const prod of marketProducts) {
      await cardsCol.add({
        ...prod,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Catalogue de TEST consolidé avec images Pexels ultra-fiables. Allez sur /api/admin/setup-market pour rafraîchir.' 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
