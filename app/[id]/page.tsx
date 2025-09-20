'use client';
import React, { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import { GlobalCartContext } from '@/components/GlobalCartContext';
import CommentSection from '@/components/CommentSection';
import styles from './ProductPage.module.css';

import { Card } from '@/types';

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Card | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const cartContext = useContext(GlobalCartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        const docRef = doc(db, 'products', params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as unknown as Card;
          setProduct(productData);
          if (productData.images && productData.images.length > 0) {
            setMainImage(productData.images[0]);
          }
        }
      }
    };

    fetchProduct();
  }, [params.id]);

  if (!product) {
    return <div>Chargement...</div>; // Or a loading spinner component
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
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>{product.price_promo}€</span>
          {product.price && <span className={styles.originalPrice}>{product.price}€</span>}
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.cartActions}>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            className={styles.quantityInput}
            min="1"
          />
          <button 
            className={styles.addToCartButton} 
            onClick={handleAddToCart}
            disabled={!cartContext}
          >
            Ajouter au panier
          </button>
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
