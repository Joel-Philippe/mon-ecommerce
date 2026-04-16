import { NextResponse } from 'next/server';
import { db, admin } from '@/utils/firebaseAdmin';

export async function GET() {
  try {
    const cardsCol = db.collection('cards');
    
    // 1. Nettoyage
    const snapshot = await cardsCol.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // 2. Catalogue visuel Family Market
    const marketProducts = [
      // --- PRODUITS FRAIS (Catégorie: Lait/Fromage PNG) ---
      {
        title: "Lait Demi-Écrémé (1L)",
        subtitle: "Brique avec bouchon",
        categorie: "Produits Frais",
        categorieImage: "https://i.pinimg.com/originals/f5/63/64/f563640b82f0607179f8546566270034.png", // Image détourée
        categorieBackgroundColor: "#4A90E2",
        price: "1.15",
        stock: 120,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/07/28/77/0728771439c099c26425424784408544.jpg"],
        description: "Lait collecté en France, riche en calcium. Idéal pour le petit-déjeuner.",
        time: new Date(Date.now() + 86400000 * 10).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Rayon Frais",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Beurre Doux (250g)",
        subtitle: "Beurre Gastronomique",
        categorie: "Produits Frais",
        categorieImage: "https://i.pinimg.com/originals/f5/63/64/f563640b82f0607179f8546566270034.png",
        categorieBackgroundColor: "#4A90E2",
        price: "2.45",
        stock: 60,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/8a/0a/6c/8a0a6c6e7a2b9e6c4c5a9b9a6c6e7a2b.jpg"],
        description: "Beurre onctueux pour vos tartines.",
        time: new Date(Date.now() + 86400000 * 20).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Rayon Frais",
        photo_du_proposant: "/ananas.png"
      },

      // --- FRUITS & LÉGUMES (Catégorie: Panier Fruits PNG) ---
      {
        title: "Bananes Cavendish",
        subtitle: "Le kilo",
        categorie: "Fruits & Légumes",
        categorieImage: "https://i.pinimg.com/originals/2d/7b/03/2d7b033d59648231362e6e651e737c02.png", // Panier fruits PNG
        categorieBackgroundColor: "#F5A623",
        price: "1.80",
        stock: 150,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/44/92/7d/44927d667c4856f71d53344605960717.jpg"],
        description: "Bananes mûres à point.",
        time: new Date(Date.now() + 86400000 * 4).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Primeur",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Tomates Grappe",
        subtitle: "Le kilo",
        categorie: "Fruits & Légumes",
        categorieImage: "https://i.pinimg.com/originals/2d/7b/03/2d7b033d59648231362e6e651e737c02.png",
        categorieBackgroundColor: "#F5A623",
        price: "2.90",
        stock: 100,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/72/7e/8e/727e8e667c4856f71d53344605960717.jpg"],
        description: "Tomates grappes fraîches.",
        time: new Date(Date.now() + 86400000 * 5).toISOString(),
        deliveryTime: "24h",
        nouveau: true,
        stars: 4,
        prenom_du_proposant: "Primeur",
        photo_du_proposant: "/ananas.png"
      },

      // --- ÉPICERIE (Catégorie: Sac Courses PNG) ---
      {
        title: "Pâtes Spaghetti (500g)",
        subtitle: "Semoule de blé dur",
        categorie: "Épicerie",
        categorieImage: "https://i.pinimg.com/originals/82/3b/6a/823b6a6e7a2b9e6c4c5a9b9a6c6e7a2b.png", // Sac courses PNG
        categorieBackgroundColor: "#7ED321",
        price: "1.20",
        stock: 200,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/4b/8e/8e/4b8e8e667c4856f71d53344605960717.jpg"],
        description: "Pâtes italiennes authentiques.",
        time: new Date(Date.now() + 86400000 * 30).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Riz Basmati (1kg)",
        subtitle: "Parfumé",
        categorie: "Épicerie",
        categorieImage: "https://i.pinimg.com/originals/82/3b/6a/823b6a6e7a2b9e6c4c5a9b9a6c6e7a2b.png",
        categorieBackgroundColor: "#7ED321",
        price: "2.85",
        stock: 200,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/6c/7a/2b/6c7a2b9e6c4c5a9b9a6c6e7a2b9e6c4c.jpg"],
        description: "Riz de qualité supérieure.",
        time: new Date(Date.now() + 86400000 * 365).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },

      // --- BOISSONS (Catégorie: Bouteille PNG) ---
      {
        title: "Eau Minérale (6x1.5L)",
        subtitle: "Pack familial",
        categorie: "Boissons",
        categorieImage: "https://i.pinimg.com/originals/4c/5a/9b/4c5a9b9a6c6e7a2b9e6c4c5a9b9a6c6e.png", // Bouteille PNG
        categorieBackgroundColor: "#50E3C2",
        price: "4.20",
        stock: 100,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/8e/4b/8e/8e4b8e667c4856f71d53344605960717.jpg"],
        description: "Hydratation quotidienne.",
        time: new Date(Date.now() + 86400000 * 180).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Boissons",
        photo_du_proposant: "/ananas.png"
      },

      // --- BOULANGERIE (Catégorie: Croissant PNG) ---
      {
        title: "Baguette Croustillante",
        subtitle: "Cuite sur place",
        categorie: "Boulangerie",
        categorieImage: "https://i.pinimg.com/originals/9e/6c/4c/9e6c4c5a9b9a6c6e7a2b9e6c4c5a9b9a.png", // Croissant PNG
        categorieBackgroundColor: "#BD10E0",
        price: "0.95",
        stock: 200,
        stock_reduc: 0,
        images: ["https://i.pinimg.com/564x/7a/2b/9e/7a2b9e6c4c5a9b9a6c6e7a2b9e6c4c5a.jpg"],
        description: "Fraîcheur garantie.",
        time: new Date(Date.now() + 3600000 * 12).toISOString(),
        deliveryTime: "2h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Boulanger",
        photo_du_proposant: "/ananas.png"
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
      message: 'Catalogue Family Market mis à jour avec images Pinterest et icônes sans fond.' 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
