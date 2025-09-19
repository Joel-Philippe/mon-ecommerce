import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';

export async function GET() {
  try {
    const cardsCol = collection(db, "cards");
    const snapshot = await getDocs(cardsCol);
    const cards = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify({ success: true, data: cards }), { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Conversion explicite en nombre
    const stock = Number(body.stock) || 0;
    const stock_reduc = Number(body.stock_reduc) || 0;
    const computedPourcentage = stock > 0 ? Math.round(((stock - stock_reduc) / stock) * 100) : 0;

    const newCard = {
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      images: body.images,
      stock: stock,
      stock_reduc: stock_reduc,
      pourcentage_disponible: computedPourcentage,
      price: body.price,
      price_promo: body.price_promo,
      time: body.time,
      deliveryTime: body.deliveryTime,
      point_important_un: body.point_important_un,
      point_important_deux: body.point_important_deux,
      point_important_trois: body.point_important_trois,
      point_important_quatre: body.point_important_quatre,
      img_point_important_un: body.img_point_important_un,
      img_point_important_deux: body.img_point_important_deux,
      img_point_important_trois: body.img_point_important_trois,
      img_point_important_quatre: body.img_point_important_quatre,
      prenom_du_proposant: body.prenom_du_proposant,
      photo_du_proposant: body.photo_du_proposant,
      origine: body.origine,
      caracteristiques: body.caracteristiques,
      produits_derives: body.produits_derives.map((produit: any) => ({
        ...produit,
        deliveryTime: produit.deliveryTime
      })),
      categorie: body.categorie,
      categorieImage: body.categorieImage,
      categorieBackgroundColor: body.categorieBackgroundColor,
      affiche: body.affiche,
      nouveau: true,

      // ⭐ Champs de notation
      reviews: [],     // Vide au départ
      stars: 0         // Moyenne initiale
    };

    const docRef = await addDoc(collection(db, "cards"), newCard);
    return new Response(JSON.stringify({ success: true, data: { _id: docRef.id, ...newCard } }), { status: 201 });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}