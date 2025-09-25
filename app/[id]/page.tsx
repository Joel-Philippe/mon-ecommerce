'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import { GlobalCartContext } from '@/components/GlobalCartContext';
import CommentSection from '@/components/CommentSection';
import { FaPlus, FaMinus } from 'react-icons/fa';
import styles from './ProductPage.module.css';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

import { Card } from '@/types';

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const cartContext = useContext(GlobalCartContext);

  useScrollRestoration(loading, [product]); // Call without pageContentRef

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (params.id) {
        const docRef = doc(db, 'cards', params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as unknown as Card;
          setProduct(productData);
          if (productData.images && productData.images.length > 0) {
            setMainImage(productData.images[0]);
          }
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div>Chargement...</div>; // Or a loading spinner component
  }

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  const handleAddToCart = () => {
    if (product && cartContext) {
      cartContext.addToCart(product, quantity);
      // Optionally, show a confirmation message
    }
  };

  return (
    <div className={styles.productPageContainer}>
      <div className={styles.leftColumn}>
        {mainImage && <img src={mainImage} alt={product.title} className={styles.mainImage} />}
        <div className={styles.thumbnailContainer}>
          {product.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} thumbnail ${index + 1}`}
              className={`${styles.thumbnail} ${mainImage === image ? styles.active : ''}`}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>
      </div>

      <div className={styles.rightColumn}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        {product.subtitle && <h2 className={styles.subtitle}>{product.subtitle}</h2>}
        
        <div className={styles.priceContainer}>
          {product.price_promo && <span className={styles.price}>{product.price_promo}€</span>}
          {product.price && <span className={styles.originalPrice}>{product.price}€</span>}
        </div>

        <div className={styles.stockInfo}>
          <span>Stock: {product.stock - product.stock_reduc}</span>
          <span> | </span>
          <span>Livraison: {product.deliveryTime}</span>
        </div>
        {product.prenom_du_proposant && (
          <div className={styles.proposant}>
            <img 
              src={product.photo_du_proposant} 
              alt={product.prenom_du_proposant} 
              className={styles.proposantImage} 
            />
            <div>
              <div className={styles.proposantName}>Proposé par {product.prenom_du_proposant}</div>
              {product.origine && <div className={styles.proposantOrigine}>{product.origine}</div>}
            </div>
          </div>
        )}
        <p className={styles.description}>{product.description}</p>

        <div className={styles.cartActions}>
          <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className={styles.quantityButton}><FaMinus /></button>
          <span className={styles.quantityDisplay}>{quantity}</span>
          <button onClick={() => setQuantity(prev => prev + 1)} className={styles.quantityButton}><FaPlus /></button>
          <button 
            className={styles.addToCartButton} 
            onClick={handleAddToCart}
            disabled={!cartContext}
          >
            Ajouter au panier
          </button>
        </div>

        {product.point_important_un && (
          <div className={styles.importantPoints}>
            <h3>Points importants</h3>
            <ul>
              <li>{product.point_important_un}</li>
              <li>{product.point_important_deux}</li>
              <li>{product.point_important_trois}</li>
              <li>{product.point_important_quatre}</li>
            </ul>
          </div>
        )}

        {product.caracteristiques && product.caracteristiques.length > 0 && (
          <div className={styles.caracteristiques}>
            {product.caracteristiques.map((cat, index) => (
              <div key={index}>
                <h4>{cat.titre}</h4>
                <table>
                  <tbody>
                    {cat.caracteristiques.map((car, i) => (
                      <tr key={i}>
                        <td>{car.nom}</td>
                        <td>{car.valeur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {product.info_optionnel && <p className={styles.infoOptionnel}>Information: {product.info_optionnel}</p>}
        {product.localisation_gps && <p className={styles.localisation}>Localisation: {product.localisation_gps}</p>}
        {product._id && (
          <div className={styles.commentSection}>
            <h2>Avis et commentaires</h2>
            <CommentSection productId={product._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
