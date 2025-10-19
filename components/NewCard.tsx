"use client";
import React, { useState } from 'react';
import ScrollRestorationLink from './ScrollRestorationLink';
import { FaHeart, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { Sparkles, Timer } from 'lucide-react';
import StockProgressBar from './StockProgressBar';
import Countdown from './Countdown';
import RatingStars from './RatingStars';
import './NewCard.css';
import { Card } from '@/types';

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
  onAddToCart: (card: Card) => Promise<void>;
  onFavoriteToggle: (cardId: string) => Promise<void>;
  onCountdownEnd: (cardId: string) => void;
  fetchProducts: () => void;
  onCategoryClick: (category: string) => void;
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
}) => {
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);

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
        await onAddToCart(card);
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
          <img src={card.images[0]} alt={card.title} className="new-card-image" />
          {card.categorie && (
            <button className="new-card-category-button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCategoryClick(card.categorie); }}>
              <div className="new-card-category" style={{ backgroundColor: card.categorieBackgroundColor }}>
                {card.categorieImage && <img src={card.categorieImage} alt={card.categorie} className="new-card-category-image" />}
                <span>{card.categorie}</span>
              </div>
            </button>
          )}
          {hasBeenPurchased && (
            <div className="new-card-purchased-badge">
              <FaCheck size={12} />
              <span>Déjà commandé</span>
            </div>
          )}
          {card.nouveau && !hasBeenPurchased && (
            <div className="new-card-badge">
              <Sparkles size={14} />
            </div>
          )}
        </div>
        <div className="new-card-details">
          <div className="new-card-header">
            <h3 className="new-card-title" style={{ color: card.categorieBackgroundColor }}>{card.title}</h3>
            <button
              className={`new-card-favorite-button ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              disabled={isFavoriteLoading}
            >
              {isFavoriteLoading ? <AiOutlineLoading className="loading-spinner" /> : <FaHeart color={isFavorite ? '#FF5722' : 'rgb(118 111 111)'} />}
            </button>
          </div>

          <div className="new-card-body">
            <div className="new-card-rating">
              {card._id && (
                <RatingStars
                  productId={card._id}
                  averageRating={averageRating}
                  userHasRated={userHasRated}
                  onVote={fetchProducts}
                />
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
            {!(isExpired || isOutOfStock) && (
              <button
                className={`new-card-add-button ${isSelected ? 'selected' : ''}`}
                onClick={handleAddToCartClick}
                disabled={isMaxReached || isSelected || isCartLoading}
              >
                {isCartLoading ? <AiOutlineLoading className="loading-spinner" /> : (isSelected ? <FaCheck /> : <FaShoppingCart />)}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </ScrollRestorationLink>
  );
};

export default NewCard;