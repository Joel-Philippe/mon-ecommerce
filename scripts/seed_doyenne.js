// Importer les dépendances nécessaires
const admin = require('firebase-admin');

// Initialiser Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Liste des catégories et produits à ajouter
const categories = [
  { name: 'Épices' },
  { name: 'Riz & féculents' },
  { name: 'Boissons' },
  { name: 'Conserves' },
  { name: 'Produits frais' },
  { name: 'Hygiène' }
];

const products = [
  { name: 'Cumin', category: 'Épices', price: 2.5, description: 'Cumin moulu de qualité optimale.' },
  { name: 'Riz Basmati', category: 'Riz & féculents', price: 3.0, description: 'Riz Basmati aromatique.' },
  { name: 'Jus d Orange', category: 'Boissons', price: 1.5, description: 'Jus d orange frais 100% naturel.' },
  { name: 'Sardines en conserve', category: 'Conserves', price: 1.0, description: 'Sardines de qualité en conserve.' },
  { name: 'Tomates fraîches', category: 'Produits frais', price: 2.0, description: 'Tomates fraîches de saison.' },
  { name: 'Savon de Marseille', category: 'Hygiène', price: 4.0, description: 'Savon doux pour la peau.' },
  { name: 'Paprika', category: 'Épices', price: 1.8, description: 'Paprika doux, idéal pour les plats.' },
  { name: 'Pâtes', category: 'Riz & féculents', price: 1.2, description: 'Pâtes de blé dur de qualité.' },
  { name: 'Eau Minérale', category: 'Boissons', price: 0.5, description: 'Eau minérale naturelle.' },
  { name: 'Haricots verts', category: 'Produits frais', price: 2.5, description: 'Haricots verts frais et croquants.' },
  { name: 'Thon en conserve', category: 'Conserves', price: 1.5, description: 'Thon en conserve, idéal pour les salades.' },
  { name: 'Gel Douche', category: 'Hygiène', price: 5.0, description: 'Gel douche parfumé et hydratant.' }
];

// Fonction pour ajouter les catégories et produits à Firestore
const seedDatabase = async () => {
  const categoryPromises = categories.map(async (category) => {
    const docRef = await db.collection('categories').add(category);
    console.log(`Catégorie ajoutée avec l'ID : ${docRef.id}`);
  });

  const productPromises = products.map(async (product) => {
    const categoryRef = await db.collection('categories').where('name', '==', product.category).get();
    if (!categoryRef.empty) {
      const categoryId = categoryRef.docs[0].id;
      await db.collection('products').add({ ...product, categoryId });
      console.log(`Produit ajouté : ${product.name}`);
    } else {
      console.log(`Catégorie non trouvée pour le produit : ${product.name}`);
    }
  });

  await Promise.all([...categoryPromises, ...productPromises]);
  console.log('Base de données initialisée avec succès.');
};

seedDatabase().catch(error => {
  console.error('Erreur d’initialisation de la base de données :', error);
  process.exit(1);
});
