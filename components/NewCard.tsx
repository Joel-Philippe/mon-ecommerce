"use client";
import React, { useState, useEffect, useRef } from 'react';
import ScrollRestorationLink from './ScrollRestorationLink';
import { FaHeart, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { Sparkles, Timer } from 'lucide-react';
import StockProgressBar from './StockProgressBar';
import Countdown from './Countdown';
import RatingStars from './RatingStars';
import './NewCard.css';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from '@/types';
import { useColorModeValue } from '@chakra-ui/react';

import { AiOutlineLoading } from 'react-icons/ai';
import { motion } from 'framer-motion';

interface NewCardProps {
  card: Card;
  isFavorite: boolean;
  isSelected: boolean;
  isExpired: boolean;
  isOutOfStock: boolean;
  isMaxReached: boolean;
  currentCount: number;
  averageRating: number;
  userHasRated: boolean;
  hasBeenPurchased: boolean;
  onAddToCart: (card: Card, quantity: number) => Promise<void>;
  onFavoriteToggle: (cardId: string) => Promise<void>;
  onCountdownEnd: (cardId: string) => void;
  fetchProducts: () => void;
  onCategoryClick?: (category: string) => void;
}

const NewCard: React.FC<NewCardProps> = ({
  card,
  isFavorite,
  isSelected,
  isExpired,
  isOutOfStock,
  isMaxReached,
  averageRating,
  userHasRated,
  hasBeenPurchased,
  onAddToCart,
  onFavoriteToggle,
  onCountdownEnd,
  fetchProducts,
  onCategoryClick,
  currentCount,
}) => {
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { debouncedUpdateCartItemQuantity } = useGlobalCart();
  const debouncedQuantity = useDebounce(quantity, 500);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isSelected) {
      setQuantity(currentCount);
    }
  }, [currentCount, isSelected]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (card._id) {
        sessionStorage.setItem(`quantity_${card._id}`, quantity.toString());
      }
    }
  }, [quantity, card._id]);

  useEffect(() => {
    if (isSelected && card._id) {
      debouncedUpdateCartItemQuantity(card._id, debouncedQuantity);
    }
  }, [debouncedQuantity, isSelected, card._id, debouncedUpdateCartItemQuantity]);

  const availableStock = card.stock - card.stock_reduc;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (card._id && !isFavoriteLoading) {
      setIsFavoriteLoading(true);
      try {
        await onFavoriteToggle(card._id);
      } catch (error) {
        console.error("Error toggling favorite:", error);
      } finally {
        setIsFavoriteLoading(false);
      }
    }
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCartLoading) {
      setIsCartLoading(true);
      try {
        await onAddToCart(card, quantity);
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        setIsCartLoading(false);
      }
    }
  };

  return (
    <ScrollRestorationLink href={`/${card._id}`} passHref>
      <motion.div
        className={`new-card`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="new-card-image-container">
          <img src={card.images[0]} alt={card.title} className="new-card-image" style={{ borderColor: card.categorieBackgroundColor }} />
          {card.categorie && (
            <button className="new-card-category-button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCategoryClick && onCategoryClick(card.categorie); }}>
              <div className="new-card-category" style={{ borderColor: card.categorieBackgroundColor, color: card.categorieBackgroundColor }}>
                {card.categorieImage && <img src={card.categorieImage} alt={card.categorie} className="new-card-category-image" />}
                <span>{card.categorie}</span>
              </div>
            </button>
          )}
          {card.nouveau && !hasBeenPurchased && (
            <div className="new-card-badge">
              <Sparkles size={14} />
            </div>
          )}
        </div>
        <div className="new-card-details">
          <div className="new-card-header">
            <h3 className="new-card-title" style={{ color: useColorModeValue(card.categorieBackgroundColor, 'white') }}>{card.title}</h3>
            <button
              className={`new-card-favorite-button ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              disabled={isFavoriteLoading}
            >
              {isFavoriteLoading ? <AiOutlineLoading className="loading-spinner" /> : <FaHeart color={isFavorite ? '#FF5722' : '#e631987d'} />}
            </button>
          </div>

          <div className="new-card-body">
            <div className="new-card-price">
              {Number(card.price_promo) > 0 ? (
                <>
                  <span className="new-card-original-price">{card.price}€</span>
                  <span className="new-card-promo-price">{card.price_promo}€</span>
                </>
              ) : (
                <span>{card.price}€</span>
              )}
            </div>
            {card.time && !isNaN(new Date(card.time).getTime()) && (
              <div className={`new-card-countdown-container ${isExpired ? 'expired' : ''}`}>
                <Timer size={16} />
                <Countdown
                  endDate={new Date(card.time)}
                  onExpired={() => {
                    if (card._id) {
                      onCountdownEnd(card._id);
                    }
                  }}
                  title={card.title}
                />
              </div>
            )}

            <div className="new-card-stock">
              <StockProgressBar stock={card.stock} stock_reduc={card.stock_reduc} />
            </div>
          </div>
          <div className="new-card-footer">
            {hasBeenPurchased && (
              <span className="new-card-purchased-text">
                <FaCheck size={12} /> Déjà commandé
              </span>
            )}

            {!(isExpired || isOutOfStock) && (
              <div className="new-card-add-container">
                {!isSelected && (
                  <div className="new-card-quantity-controls">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}>-</button>
                    <span>{quantity}</span>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.min(q + 1, availableStock)); }} disabled={quantity >= availableStock}>+</button>
                  </div>
                )}
                <button
                  className={`new-card-add-button ${isSelected ? 'selected' : ''}`}
                  onClick={handleAddToCartClick}
                  disabled={isMaxReached || isSelected || isCartLoading}
                >
                  {isCartLoading ? <AiOutlineLoading className="loading-spinner" /> : (isSelected ? <FaCheck /> : <FaShoppingCart />)}
                </button>
              </div>
            )}
            {isOutOfStock && (
                <span className="out-of-stock-message">Épuisé</span>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollRestorationLink>
  );
};

export default NewCard;