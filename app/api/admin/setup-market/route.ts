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

    // 2. Catalogue de TEST MASSIVELEMENT ENRICHI (~20 produits)
    const marketProducts = [
      // --- PRODUITS FRAIS ---
      {
        title: "Lait Frais Bio", subtitle: "Bouteille 1L", categorie: "Produits Frais",
        categorieImage: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#4A90E2", price: "1.95", stock: 50, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Lait frais issu de l'agriculture biologique.", time: new Date(Date.now() + 86400000 * 5).toISOString(),
        deliveryTime: "24h", nouveau: true, stars: 5, prenom_du_proposant: "Ferme Bio", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Plateau de Fromages", subtitle: "Assortiment 400g", categorie: "Produits Frais",
        categorieImage: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#4A90E2", price: "8.50", stock: 25, stock_reduc: 2,
        images: ["https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Brie, Comté, Roquefort et Chèvre.", time: new Date(Date.now() + 86400000 * 7).toISOString(),
        deliveryTime: "24h", nouveau: false, stars: 5, prenom_du_proposant: "Fromager", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Œufs de Plein Air (x12)", subtitle: "Calibre Gros", categorie: "Produits Frais",
        categorieImage: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#4A90E2", price: "3.90", stock: 40, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/162712/egg-white-food-isolated-162712.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Œufs frais pondus en plein air.", time: new Date(Date.now() + 86400000 * 12).toISOString(),
        deliveryTime: "24h", nouveau: false, stars: 4, prenom_du_proposant: "Ferme Bio", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },

      // --- FRUITS & LÉGUMES ---
      {
        title: "Avocats Hass", subtitle: "Lot de 2", categorie: "Fruits & Légumes",
        categorieImage: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#F5A623", price: "2.99", stock: 35, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Avocats onctueux, prêts à consommer.", time: new Date(Date.now() + 86400000 * 4).toISOString(),
        deliveryTime: "24h", nouveau: true, stars: 5, prenom_du_proposant: "Primeur", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Fraises Gariguette", subtitle: "Barquette 250g", categorie: "Fruits & Légumes",
        categorieImage: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#F5A623", price: "4.50", stock: 20, stock_reduc: 10,
        images: ["https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Fraises très parfumées et sucrées.", time: new Date(Date.now() + 86400000 * 2).toISOString(),
        deliveryTime: "24h", nouveau: true, stars: 5, prenom_du_proposant: "Saisonnier", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Mélange Salade", subtitle: "Sachet 200g", categorie: "Fruits & Légumes",
        categorieImage: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#F5A623", price: "1.50", stock: 50, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/4051608/pexels-photo-4051608.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Mélange de jeunes pousses croquantes.", time: new Date(Date.now() + 86400000 * 3).toISOString(),
        deliveryTime: "24h", nouveau: false, stars: 4, prenom_du_proposant: "Le Maraîcher", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },

      // --- ÉPICERIE ---
      {
        title: "Chocolat Noir 70%", subtitle: "Tablette 100g", categorie: "Épicerie",
        categorieImage: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#7ED321", price: "2.40", stock: 100, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Chocolat noir intense pur beurre de cacao.", time: new Date(Date.now() + 86400000 * 180).toISOString(),
        deliveryTime: "48h", nouveau: false, stars: 5, prenom_du_proposant: "Chocolatier", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Pâte à Tartiner Noisette", subtitle: "Pot 400g", categorie: "Épicerie",
        categorieImage: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#7ED321", price: "5.20", stock: 45, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/4109503/pexels-photo-4109503.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Sans huile de palme, riche en noisettes.", time: new Date(Date.now() + 86400000 * 120).toISOString(),
        deliveryTime: "48h", nouveau: true, stars: 5, prenom_du_proposant: "Épicier", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },

      // --- BOISSONS ---
      {
        title: "Thé Glacé Maison", subtitle: "Bouteille 50cl", categorie: "Boissons",
        categorieImage: "https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#50E3C2", price: "2.50", stock: 30, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Infusion de thé noir à la pêche.", time: new Date(Date.now() + 86400000 * 10).toISOString(),
        deliveryTime: "24h", nouveau: true, stars: 4, prenom_du_proposant: "Bar à Jus", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },
      {
        title: "Vin Rouge Bordeaux", subtitle: "75cl - 2021", categorie: "Boissons",
        categorieImage: "https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#50E3C2", price: "12.00", stock: 24, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/290316/pexels-photo-290316.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Vin élégant et équilibré.", time: new Date(Date.now() + 86400000 * 365).toISOString(),
        deliveryTime: "48h", nouveau: false, stars: 5, prenom_du_proposant: "Cave à Vin", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      },

      // --- BOULANGERIE ---
      {
        title: "Cookie Pépites Chocolat", subtitle: "Cuit du jour", categorie: "Boulangerie",
        categorieImage: "https://images.pexels.com/photos/461060/pexels-photo-461060.jpeg?auto=compress&cs=tinysrgb&w=100",
        categorieBackgroundColor: "#BD10E0", price: "1.50", stock: 40, stock_reduc: 0,
        images: ["https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600"],
        description: "Cookie moelleux avec gros éclats de chocolat.", time: new Date(Date.now() + 3600000 * 12).toISOString(),
        deliveryTime: "2h", nouveau: true, stars: 5, prenom_du_proposant: "Boulanger", photo_du_proposant: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
      }
    ];

    // Duplication de certains pour atteindre ~20
    const extraProducts = [
      { ...marketProducts[0], title: "Lait Amande", price: "2.50", images: ["https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=600"] },
      { ...marketProducts[3], title: "Poires Conférence", price: "3.20", images: ["https://images.pexels.com/photos/5946065/pexels-photo-5946065.jpeg?auto=compress&cs=tinysrgb&w=600"] },
      { ...marketProducts[4], title: "Tomates Grappe", price: "2.80", images: ["https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600"] },
      { ...marketProducts[6], title: "Chocolat au Lait", price: "2.10", images: ["https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=600"] },
      { ...marketProducts[8], title: "Limonade Artisanale", price: "2.90", images: ["https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=600"] },
      { ...marketProducts[10], title: "Pain de Campagne", price: "1.90", images: ["https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=600"] }
    ];

    const finalCatalog = [...marketProducts, ...extraProducts];

    for (const prod of finalCatalog) {
      await cardsCol.add({
        ...prod,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: `Catalogue de TEST massif généré (${finalCatalog.length} produits). Rafraîchissez sur /api/admin/setup-market.` 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
