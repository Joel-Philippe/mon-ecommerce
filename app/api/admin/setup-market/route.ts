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

    // 2. Catalogue enrichi Family Market
    const marketProducts = [
      // --- PRODUITS FRAIS ---
      {
        title: "Lait Demi-Écrémé (1L)",
        subtitle: "Brique avec bouchon refermable",
        categorie: "Produits Frais",
        price: "1.15",
        stock: 120,
        stock_reduc: 0,
        images: ["/images/lait.jpg"],
        description: "Lait collecté en France, riche en calcium et vitamine D. Idéal pour le petit-déjeuner ou la cuisine.",
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
        price: "2.45",
        stock: 60,
        stock_reduc: 0,
        images: ["/images/beurre.jpg"],
        description: "Beurre onctueux idéal pour vos tartines et vos pâtisseries. Fabriqué à partir de crème sélectionnée.",
        time: new Date(Date.now() + 86400000 * 20).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Rayon Frais",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Fromage Emmental Râpé (200g)",
        subtitle: "Sachet fraîcheur",
        categorie: "Produits Frais",
        price: "1.95",
        stock: 85,
        stock_reduc: 0,
        images: ["/images/emmental.jpg"],
        description: "Fromage à pâte pressée cuite, idéal pour gratiner vos plats de pâtes ou vos pizzas.",
        time: new Date(Date.now() + 86400000 * 15).toISOString(),
        deliveryTime: "24h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Rayon Frais",
        photo_du_proposant: "/ananas.png"
      },

      // --- FRUITS & LÉGUMES ---
      {
        title: "Bananes Cavendish",
        subtitle: "Le kilo (environ 5-6 bananes)",
        categorie: "Fruits & Légumes",
        price: "1.80",
        stock: 150,
        stock_reduc: 0,
        images: ["/images/bananes.jpg"],
        description: "Bananes mûres à point, riches en potassium. Parfaites pour un encas sain ou un smoothie.",
        time: new Date(Date.now() + 86400000 * 4).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Primeur",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Pommes Gala",
        subtitle: "Sachet de 1kg",
        categorie: "Fruits & Légumes",
        price: "2.50",
        stock: 100,
        stock_reduc: 0,
        images: ["/images/pommes.jpg"],
        description: "Pommes croquantes et sucrées. Une variété appréciée de toute la famille.",
        time: new Date(Date.now() + 86400000 * 7).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Primeur",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Avocats (x2)",
        subtitle: "Prêts à consommer",
        categorie: "Fruits & Légumes",
        price: "3.20",
        stock: 40,
        stock_reduc: 0,
        images: ["/images/avocats.jpg"],
        description: "Duo d'avocats à la chair fondante. Idéal pour vos salades ou toasts de petit-déjeuner.",
        time: new Date(Date.now() + 86400000 * 3).toISOString(),
        deliveryTime: "24h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Primeur",
        photo_du_proposant: "/ananas.png"
      },

      // --- ÉPICERIE ---
      {
        title: "Riz Basmati (1kg)",
        subtitle: "Riz longue conservation",
        categorie: "Épicerie",
        price: "2.85",
        stock: 200,
        stock_reduc: 0,
        images: ["/images/riz.jpg"],
        description: "Riz parfumé de qualité supérieure. Idéal pour accompagner vos plats en sauce ou vos currys.",
        time: new Date(Date.now() + 86400000 * 365).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Huile de Tournesol (1L)",
        subtitle: "100% pure",
        categorie: "Épicerie",
        price: "2.30",
        stock: 150,
        stock_reduc: 0,
        images: ["/images/huile.jpg"],
        description: "Huile végétale polyvalente, parfaite pour la cuisson et les assaisonnements légers.",
        time: new Date(Date.now() + 86400000 * 180).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Café Moulu (250g)",
        subtitle: "Arabica & Robusta",
        categorie: "Épicerie",
        price: "3.10",
        stock: 90,
        stock_reduc: 0,
        images: ["/images/cafe.jpg"],
        description: "Un café équilibré et corsé pour bien commencer la journée. Arôme intense garanti.",
        time: new Date(Date.now() + 86400000 * 90).toISOString(),
        deliveryTime: "48h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Épicerie",
        photo_du_proposant: "/ananas.png"
      },

      // --- BOUCHERIE ---
      {
        title: "Filets de Poulet (x2)",
        subtitle: "Environ 300g - Origine locale",
        categorie: "Boucherie",
        price: "4.90",
        stock: 30,
        stock_reduc: 0,
        images: ["/images/poulet.jpg"],
        description: "Filets de poulet tendres et sans peau. Idéal pour une cuisson à la poêle ou au four.",
        time: new Date(Date.now() + 86400000 * 3).toISOString(),
        deliveryTime: "24h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Boucher",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Steaks Hachés (x2)",
        subtitle: "15% Matières Grasses - 200g",
        categorie: "Boucherie",
        price: "3.80",
        stock: 45,
        stock_reduc: 0,
        images: ["/images/steaks.jpg"],
        description: "Viande de bœuf sélectionnée, préparée quotidiennement pour une fraîcheur optimale.",
        time: new Date(Date.now() + 86400000 * 2).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Boucher",
        photo_du_proposant: "/ananas.png"
      },

      // --- BOULANGERIE ---
      {
        title: "Baguette de Pain",
        subtitle: "Cuite sur place",
        categorie: "Boulangerie",
        price: "0.95",
        stock: 200,
        stock_reduc: 0,
        images: ["/images/baguette.jpg"],
        description: "Baguette croustillante à la mie aérée. Cuite plusieurs fois par jour dans notre fournil.",
        time: new Date(Date.now() + 3600000 * 12).toISOString(),
        deliveryTime: "2h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Boulanger",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Pain de Mie (500g)",
        subtitle: "Nature - Sans croûte",
        categorie: "Boulangerie",
        price: "1.75",
        stock: 70,
        stock_reduc: 0,
        images: ["/images/pain-mie.jpg"],
        description: "Pain de mie extra-moelleux pour vos croque-monsieur ou vos tartines du matin.",
        time: new Date(Date.now() + 86400000 * 6).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Boulanger",
        photo_du_proposant: "/ananas.png"
      },

      // --- BOISSONS ---
      {
        title: "Eau Minérale (6x1.5L)",
        subtitle: "Pack familial",
        categorie: "Boissons",
        price: "4.20",
        stock: 100,
        stock_reduc: 0,
        images: ["/images/eau.jpg"],
        description: "Eau minérale naturelle plate, idéale pour l'hydratation quotidienne de toute la famille.",
        time: new Date(Date.now() + 86400000 * 180).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Boissons",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Jus d'Orange (1L)",
        subtitle: "100% pur fruit - Sans pulpe",
        categorie: "Boissons",
        price: "2.15",
        stock: 80,
        stock_reduc: 0,
        images: ["/images/jus-orange.jpg"],
        description: "Jus d'orange pressé sans sucres ajoutés. Riche en vitamine C pour faire le plein d'énergie.",
        time: new Date(Date.now() + 86400000 * 30).toISOString(),
        deliveryTime: "24h",
        nouveau: false,
        stars: 4,
        prenom_du_proposant: "Boissons",
        photo_du_proposant: "/ananas.png"
      },

      // --- HYGIÈNE & ENTRETIEN ---
      {
        title: "Papier Toilette (x6)",
        subtitle: "Double épaisseur",
        categorie: "Hygiène & Entretien",
        price: "2.95",
        stock: 140,
        stock_reduc: 0,
        images: ["/images/papier-toilette.jpg"],
        description: "Rouleaux de papier toilette doux et résistants. Un indispensable du quotidien.",
        time: new Date(Date.now() + 86400000 * 365).toISOString(),
        deliveryTime: "48h",
        nouveau: false,
        stars: 5,
        prenom_du_proposant: "Entretien",
        photo_du_proposant: "/ananas.png"
      },
      {
        title: "Lessive Liquide (1.5L)",
        subtitle: "Parfum Fraîcheur - 30 lavages",
        categorie: "Hygiène & Entretien",
        price: "6.80",
        stock: 50,
        stock_reduc: 0,
        images: ["/images/lessive.jpg"],
        description: "Lessive efficace dès 30°C sur tous types de textiles. Laisse un parfum frais sur votre linge.",
        time: new Date(Date.now() + 86400000 * 365).toISOString(),
        deliveryTime: "48h",
        nouveau: true,
        stars: 5,
        prenom_du_proposant: "Entretien",
        photo_du_proposant: "/ananas.png"
      }
    ];

    // 3. Insertion par lot
    for (const prod of marketProducts) {
      await cardsCol.add({
        ...prod,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Catalogue Family Market enrichi avec succès (17 nouveaux produits ajoutés).' 
    });
  } catch (error: any) {
    console.error('Erreur Setup Market:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
