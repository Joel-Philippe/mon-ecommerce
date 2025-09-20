export interface Card {
  _id?: string;
  categorie: string;
  categorieImage: string;
  categorieBackgroundColor: string;
  affiche: string;
  nouveau: boolean;
  title: string;
  subtitle?: string;
  description: string;
  info_optionnel?: string;
  images: string[];
  stock: number;
  stock_reduc: number;
  price: string;
  price_promo: string;
  time: Date;
  deliveryTime: string;
  point_important_un: string;
  point_important_deux: string;
  point_important_trois: string;
  point_important_quatre: string;
  img_point_important_un: string;
  img_point_important_deux: string;
  img_point_important_trois: string;
  img_point_important_quatre: string;
  prenom_du_proposant: string;
  photo_du_proposant: string;
  origine: string;
  caracteristiques: { titre: string, caracteristiques: { nom: string, valeur: string }[] }[];
  produits_derives: { titre: string, description: string, prix: string, price_promo: string, images: string[], deliveryTime: string }[];
  reviews?: any[];
  localisation_gps?: string;
}

export interface SpecialRequest {
  id: string;
  status: 'pending' | 'accepted';
  senderEmail: string;
  senderDisplayName: string;
  senderPhoto?: string;
  sellerName?: string;
  sellerPhoto?: string;
  selectedProducts: { title: string }[];
}