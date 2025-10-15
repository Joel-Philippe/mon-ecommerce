'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import { GlobalCartContext } from '@/components/GlobalCartContext';
import CommentSection from '@/components/CommentSection';
import Countdown from '@/components/Countdown';
import ImageSlider from '@/components/ImageSlider'; // Import the new ImageSlider
import { FaPlus, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './ProductPage.module.css';


import { Card } from '@/types';

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isExpired, setIsExpired] = useState(false);
  const { globalCart, addToCart } = useContext(GlobalCartContext)!;



  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    const docRef = doc(db, 'cards', params.id as string);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const productData = { _id: docSnap.id, ...docSnap.data() } as unknown as Card;
        setProduct(productData);
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching real-time product:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);

  const isInCart = product && product._id && globalCart && globalCart[product._id];

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  return (
    <motion.div
      className={styles.productPageContainer}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.leftColumn}>
        {product.images && product.images.length > 0 && (
          <ImageSlider images={product.images} />
        )}
      </div>

      <div className={styles.rightColumn}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        {product.subtitle && <h2 className={styles.subtitle}>{product.subtitle}</h2>}
        
        <div className={styles.priceContainer}>
          {product.price_promo && Number(product.price_promo) > 0 ? (
            <>
              <span className={styles.price}>{product.price_promo}€</span>
              <span className={styles.originalPrice}>{product.price}€</span>
            </>
          ) : (
            <span className={styles.price}>{product.price}€</span>
          )}
        </div>

        <div className={styles.countdownContainer}>
          <Countdown endDate={new Date(product.time)} onExpired={() => setIsExpired(true)} title="" color="#28a745" />
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

        {product.stock - product.stock_reduc > 0 && !isExpired ? (
          <div className={styles.cartActions}>
            <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className={styles.quantityButton}><FaMinus /></button>
            <span className={styles.quantityDisplay}>{quantity}</span>
            <button onClick={() => setQuantity(prev => (product && prev < product.stock - product.stock_reduc) ? prev + 1 : prev)} className={styles.quantityButton}><FaPlus /></button>
            <button 
              className={`${styles.addToCartButton} ${isInCart ? styles.inCart : ''}`}
              onClick={handleAddToCart}
              disabled={isExpired || !!isInCart}
            >
              {isInCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
            </button>
          </div>
        ) : (
          <div className={styles.unavailableMessage}>
            Cette offre n'est plus disponible.
          </div>
        )}

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
    </motion.div>
  );
};

export default ProductPage;
