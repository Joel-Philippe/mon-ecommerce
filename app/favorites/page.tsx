'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { collection, query, where, getDocs, documentId, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/components/firebaseConfig';
import LoadingSpinner from '@/components/LoadingSpinner';
import NewCard from '@/components/NewCard'; // Import NewCard
import { Card } from '@/types';
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

import Link from '@/components/ScrollRestorationLink';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import '../favorites.css';
import '../Cards.css';
import RatingStars from '@/components/RatingStars';





export default function FavoritesPage() {
  const { user, userFavorites, toggleFavorite } = useAuth();
  const { globalCart, addToCart, removeCartItem } = useGlobalCart();

  const [favoriteCards, setFavoriteCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiredCards, setExpiredCards] = useState<Set<string>>(new Set()); // New state for expired cards
  const router = useRouter();



  // Helper function to fetch favorite cards
  const fetchFavoriteCards = async () => {
    if (!user) {
      setLoading(false);
      setFavoriteCards([]);
      return;
    }

    if (userFavorites.length === 0) {
      setFavoriteCards([]);
      setLoading(false);
      return;
    }

    try {
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

  useEffect(() => {
    fetchFavoriteCards();
  }, [user, userFavorites]);

  // Helper function for average rating (already exists)
  const calculateAverageRating = (reviews: any[] = []) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviews.length;
  };

  // Helper function for userHasRated (similar to app/page.tsx)
  const hasUserRated = (reviews: any[] = []) => {
    if (!user) return false;
    return reviews?.some((r) => r.userId === user.uid);
  };

  const handleAddToCart = async (card: Card) => {
    if (!user) {
      router.push('/signup');
      return;
    }

    try {
      await addToCart(card, 1); // Pass the whole card object
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      // Optionally, display a toast message here if needed
    }
  };

  const handleFavoriteToggle = async (cardId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      await toggleFavorite(cardId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Optionally, display a toast message here if needed
    }
  };

  const handleCountdownEnd = async (cardId: string) => {
    if (expiredCards.has(cardId)) {
      return; // Already processed
    }

    const cardToExpire = favoriteCards.find(card => card._id === cardId);
    if (!cardToExpire) return;

    try {
      // Only remove from cart if it's actually in the cart
      if (globalCart[cardId]) {
        await removeCartItem(cardId); // Use removeCartItem from context
      }
    } catch (err: any) {
      console.error("Error removing expired item from cart:", err);
    }

    setExpiredCards(prev => new Set(prev).add(cardId));

    console.log(`🗑️ Produit expiré automatiquement supprimé : ${cardToExpire.title}`);
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
        <p className="favorites-message">Connecte toi pour voir tes articles favoris.</p>
        <Link href="/login" className="favorites-login-button">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="favorites-page-container"> {/* Attach ref */}
      <h1 className="favorites-title"></h1>

      {favoriteCards.length === 0 ? (
        <p className="favorites-message">Tu n'as pas encore d'articles favoris.</p>
      ) : (
        <div className="cards-container">
          {favoriteCards.map((card) => {
            const isSelected = card._id ? !!globalCart[card._id]?.count : false; // Check by _id
            const available = Number(card.stock) - Number(card.stock_reduc);
            const isMaxReached = card._id ? (globalCart[card._id]?.count || 0) >= available : false;
            const isOutOfStock = available <= 0;
            const isExpiredCard = card._id ? expiredCards.has(card._id) : false;

            return (
              <NewCard
                key={card._id}
                card={card}
                isFavorite={true} // Always true in favorites page
                isSelected={isSelected}
                isExpired={isExpiredCard}
                isOutOfStock={isOutOfStock}
                isMaxReached={isMaxReached}
                currentCount={card._id ? globalCart[card._id]?.count || 0 : 0}
                averageRating={calculateAverageRating(card.reviews)}
                userHasRated={hasUserRated(card.reviews)}
                onAddToCart={handleAddToCart}
                onFavoriteToggle={handleFavoriteToggle}
                onCountdownEnd={handleCountdownEnd}
                fetchProducts={fetchFavoriteCards} // Re-fetch favorites after rating
                hasBeenPurchased={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}