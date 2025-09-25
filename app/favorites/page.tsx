"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomMenuItem from '@/components/CustomMenuItem';
import { Card } from '@/types';
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useScrollSavingRouter } from '@/hooks/useScrollSavingRouter';
import Link from '@/components/ScrollRestorationLink';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import '../favorites.css';
import '../Cards.css';
import RatingStars from '@/components/RatingStars';


import { useScrollRestoration } from '@/hooks/useScrollRestoration';


export default function FavoritesPage() {
  const { user, userFavorites } = useAuth();
  const { globalCart, addToCart } = useGlobalCart();

  const [favoriteCards, setFavoriteCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useScrollSavingRouter();

  useScrollRestoration(loading, [favoriteCards]); // Call without pageContentRef

  useEffect(() => {
    const fetchFavoriteCards = async () => {
      if (!user) {
        setLoading(false);
        // Optionally redirect to login or show a message
        return;
      }

      if (userFavorites.length === 0) {
        setFavoriteCards([]);
        setLoading(false);
        return;
      }

      try {
        // Firestore 'in' query has a limit of 10, so we might need to batch if userFavorites is large
        const q = query(collection(db, 'cards'), where(documentId(), 'in', userFavorites));
        const querySnapshot = await getDocs(q);
        const fetchedCards: Card[] = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          ...(doc.data() as object),
        })) as Card[];
        setFavoriteCards(fetchedCards);
      } catch (err: any) {
        console.error("Error fetching favorite cards:", err);
        setError("Impossible de charger les articles favoris.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCards();
  }, [user, userFavorites]);

  const handleAddToCart = async (card: Card) => {
    if (!user) {
      router.push('/signup');
      return;
    }

    try {
      await addToCart(card, 1); // Pass the whole card object
    } catch (err: any) {
      console.error("Error adding to cart:", err);
    }
  };

  const calculateAverageRating = (reviews: any[] = []) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviews.length;
  };



  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!user) {
    return (
      <div className="favorites-page-container">
        <h1 className="favorites-title">Mes Articles Favoris</h1>
        <p className="favorites-message">Veuillez vous connecter pour voir vos articles favoris.</p>
        <Link href="/login" className="favorites-login-button">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="favorites-page-container"> {/* Attach ref */}
      <h1 className="favorites-title">Mes Articles Favoris</h1>

      {favoriteCards.length === 0 ? (
        <p className="favorites-message">Vous n'avez pas encore d'articles favoris.</p>
      ) : (
        <div className="cards-container">
          {favoriteCards.map((card) => {
            const isSelected = card._id ? !!globalCart[card._id]?.count : false; // Check by _id
            const available = Number(card.stock) - Number(card.stock_reduc);
            const isMaxReached = card._id ? (globalCart[card._id]?.count || 0) >= available : false;
            const isOutOfStock = available <= 0;

            return (
              <Link href={`/${card._id}`} passHref legacyBehavior key={card._id}>
                <div className="card-link" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card overlap-group-1">
                    {card.nouveau && (
                      <div className="nouveau-badge">
                        <Sparkles className="nouveau-icon" />
                        Nouveau
                      </div>
                    )}
                    <div className="header_card overlap-group-2">
                      <div className="picture_card-container">
                        <img 
                          className="picture_card" 
                          src={card.images[0]} 
                          alt={card.title.trim().toLowerCase()}
                        />
                        <div className="overlay-content">
                          <div className="title_card_1 vtt-cool-style valign-text-middle">
                            {card.title}
                          </div>
                          <div className="title_card_1 vtt-cool-style valign-text-middle">
                            {card._id && (
                              <RatingStars
                                productId={card._id}
                                averageRating={calculateAverageRating(card.reviews)}
                                userHasRated={false} // No rating from favorites page
                                onVote={() => {}} // No voting from favorites page
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-row">
                      <button
                        className={`add-to-cart-button ${isSelected ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(card);
                        }}
                        disabled={isOutOfStock || isMaxReached || isSelected}
                        style={isSelected ? { cursor: 'not-allowed' } : {}}
                      >
                        {card._id && globalCart[card._id]?.count > 0 && (
                          <FaCheck style={{ marginRight: '8px', color: 'green'}} />
                        )}
                        <div className="price_content">
                          {Number(card.price_promo) > 0 ? (
                            <>
                              {card.price && (
                                <div className="price_card price valign-text-middle inter-normal-white-20px">
                                  <span className="double-strikethrough">{card.price}€</span>
                                </div>
                              )}
                              <div className="price_card price valign-text-middle inter-normal-white-20px">
                                <span>{card.price_promo}€</span>
                              </div>
                            </>
                          ) : (
                            card.price && (
                              <div className="price_card price valign-text-middle inter-normal-white-20px">
                                <span>{card.price}€</span>
                              </div>
                            )
                          )}
                        </div>
                        {isOutOfStock
                          ? 'Stock épuisé ❌'
                          : isMaxReached
                            ? `Quantité max (${available}) atteinte`
                            : isSelected
                              ? 'Sélectionnée'
                              : 'Ajouter au panier'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
