"use client";
import React, { useEffect, useState, useContext, useRef } from 'react';
import { FaNewspaper, FaRegListAlt, FaCheck, FaSearch, FaHeart } from 'react-icons/fa';
import { Button, Box, Text, useDisclosure, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import Image from 'next/image';
import { InfoIcon } from '@chakra-ui/icons';

import Countdown from '@/components/Countdown';
import Modal from '@/components/Modal';
import ImageSlider from '@/components/ImageSlider';
import { DonutChart } from '@/components/average';
import StockProgressBar from '@/components/StockProgressBar';
import { calculateDonutPercentage } from '@/components/calculateDonutPercentage';
import Link from 'next/link';
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGlobalCart } from '@/components/GlobalCartContext'; // Removed GlobalCartProvider as it should wrap the whole app
import CustomMenuItem from '@/components/CustomMenuItem';
import UpdateCardModal from '@/components/UpdateCardModal';
import GlobalPrice from '@/components/globalprice';
import { useAuth } from '@/contexts/AuthContext';
import SvgBackground from '@/components/SvgBackground';
import AnimatedBanner from '@/components/AnimatedBanner';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from '@/components/firebaseConfig.ts';
import './globals.css';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import RatingStars from '@/components/RatingStars';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { PlusCircle } from "lucide-react";
import Menu from '@/components/Menu';
import FilterButtons from "@/components/FilterButtons";
import NoSearchResults from "@/components/NoSearchResults";
import SelectedCategories from '@/components/SelectedCategories';
import { Grid3X3, Sparkles } from 'lucide-react';
import { Card } from '@/types';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import './Cards.css';


  export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  const [expiredCards, setExpiredCards] = useState<Set<string>>(new Set());
  const [specialRequests, setSpecialRequests] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const hideForm = () => {
    setIsFormVisible(false);
    setFormCard(null); // Also clear formCard when hiding the form
  };

  // Placeholder for updateCard function
  const updateCard = async (cardToUpdate: Card) => {
    console.log("Updating card:", cardToUpdate);
    // In a real application, you would add Firebase update logic here
    // For now, just a placeholder to resolve the compilation error
  };
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [formCard, setFormCard] = useState<Card | null>(null);
  const [imageValues, setImageValues] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  const closeCarousel = () => {
    setIsCarouselOpen(false);
    setCarouselImages([]); // Clear images when closing
  };
  const { user, userFavorites, addFavorite, removeFavorite } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const categoryIconsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);
  
  
  const [buttonText, setButtonText] = useState('Ajouter au panier'); // This state might become redundant
  const { globalCart, addToCart, updateCartItemQuantity, removeCartItem, loadingCart, errorCart } = useGlobalCart(); // Updated destructuring
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const [userVotes, setUserVotes] = useState<{ [cardId: string]: number }>({});
  const [products, setProducts] = useState<any[]>([]);
  
  const [selectedRating, setSelectedRating] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new'>('all');


  // cartInfo state is no longer needed as globalCart from context provides the data
  // const [cartInfo, setCartInfo] = useState<Array<{
  //   title: string;
  //   images: string[];
  //   price: number;
  //   pricePromo?: number;
  //   count: number;
  // }>>([]);

  const handleVideoEnd = () => {
    if (window.innerWidth > 768) {
      setVideoEnded(true);
    }
  };

  const fetchProducts = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const querySnapshot = await getDocs(collection(db, 'cards'));
    const products = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const reviews = data.reviews || [];

        const userHasRated = currentUser
          ? reviews.some((r: any) => r.userId === currentUser.uid)
          : false;

        const averageRating = data.stars || 0;

        return {
          id: docSnap.id,
          ...data,
          averageRating,
          userHasRated,
        };
      })
    );

    setProducts(products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "votes"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userVote = snapshot.docs[0].data().vote;
          setSelectedRating(userVote);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du vote :", error);
      }
    };

    fetchUserVotes();
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const cardsCol = collection(db, 'cards');
    const unsubscribe = onSnapshot(
      cardsCol,
      snapshot => {
        const data = snapshot.docs.map(doc => ({ ...(doc.data() as object), _id: doc.id } as Card));
        setCards(data);
        setLoading(false);
      },
      err => {
        console.error('Listener cards error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const hasUserRated = (reviews: any[] = []) => {
    if (!currentUser) return false;
    return reviews?.some((r) => r.userId === currentUser.uid);
  };

  const calculateAverageRating = (reviews: any[] = []) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviews.length;
  };

  // Removed useEffect that logs localStorage cart info

  const handleAddToCart = async (card: Card) => {
    if (!user) {
      router.push('/signup');
      return;
    }

    try {
      await addToCart(card, 1); // Pass the whole card object
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      // The context now sets the error message, so we can display it elsewhere
    }
  };

  useEffect(() => {
    const now = new Date();
    const expiredSet = new Set<string>();

    cards.forEach(card => {
      if (card._id && new Date(card.time) < now) {
        expiredSet.add(card._id);
      }
    });

    setExpiredCards(expiredSet);
  }, [cards]);

  // Removed handleAddClick, handleRemoveClick, handleIncreaseClick, handleDecreaseClick
  // as their logic is now handled by GlobalCartContext

  const handleCountdownEnd = async (cardId: string) => { // Made async
    if (expiredCards.has(cardId)) {
      return; // Already processed
    }

    const cardToExpire = cards.find(card => card._id === cardId);
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

  const handleRequestButtonClick = (card: Card) => {
    if (!user || !user.email) {
      window.location.href = '/login';
    } else {
      setCurrentCard(card);
      onOpen();
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryToggle = (category: string) => {
    setActiveFilter('all'); // Reset to 'all' when toggling categories
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
  };



  const allProductsWithDerives = (card: Card) => {
    const mainProduct = { title: card.title, price: card.price, price_promo: card.price_promo, images: card.images };
    const derivedProducts = card.produits_derives
      .filter(produit => produit.titre)
      .map(produit => ({
        title: produit.titre,
        price: produit.prix,
        images: produit.images,
      }));
    return [mainProduct, ...derivedProducts];
  };

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredBySearch = searchTerm
    ? cards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.categorie?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cards;

  const filteredByCategory = selectedCategories.length > 0
    ? filteredBySearch.filter(card => card.categorie && selectedCategories.includes(card.categorie))
    : filteredBySearch;

  const finalFilteredCards = activeFilter === 'new'
    ? filteredByCategory.filter((card) => card.nouveau)
    : filteredByCategory;

  return (
    <div>
      <CustomMenuItem />
      <div
        className={`video_animate video_animate-wrapper ${videoEnded ? 'collapsed' : ''}`}
        style={{ display: videoEnded ? 'none' : 'block' }}
      >
        <AnimatedBanner onEnd={handleVideoEnd} />
        <SvgBackground />
      </div>
      
      
      <Menu
        cards={cards}
        selectedCategories={selectedCategories}
        activeFilter={activeFilter}
        onCategoryToggle={handleCategoryToggle}
        onClearAll={() => {
          setSelectedCategories([]);
          setActiveFilter('all');
        }}
        onShowNew={() => {
          setSelectedCategories([]);
          setActiveFilter('new');
        }}
        onSearch={handleSearch}
        resultsCount={finalFilteredCards.length}
        searchTerm={searchTerm}
      />
      
      <div className="page-content">
        {searchTerm && finalFilteredCards.length === 0 && (
          <NoSearchResults 
            searchTerm={searchTerm}
            onClearSearch={clearSearch}
          />
        )}
        
        <div className="cards-container">
          {finalFilteredCards.map((card, index) => {
            const isSelected = card._id ? !!globalCart[card._id]?.count : false; // Check by _id
            const isExpired = card._id ? expiredCards.has(card._id) : false;
            const totalStock = Number(card.stock);
            const usedStock = Number(card.stock_reduc);
            const isOutOfStock = totalStock > 0 && usedStock >= totalStock;
            const available = totalStock - usedStock;
            const currentCount = card._id ? globalCart[card._id]?.count || 0 : 0; // Use _id
            const isMaxReached = currentCount >= available;

            return (
              <div className="card-link" style={{ textDecoration: "none", color: "inherit" }} key={card._id}>
                <div data-category={card.categorie} ref={(el) => { if (el) cardsRef.current[index] = el; }}>
                  <div className="card overlap-group-1">
                    {card.nouveau && (
                      <div className="nouveau-badge">
                        <Sparkles className="nouveau-icon" />
                        Nouveau
                      </div>
                    )}
                    
                    <div 
                      className="favorite-icon" 
                      onClick={(e) => {
                        e.stopPropagation(); // Empêche le clic de se propager au lien de la carte
                        if (!user) {
                          router.push('/login');
                          return;
                        }
                      if (card._id) {
                        if (userFavorites.includes(card._id)) {
                          removeFavorite(card._id);
                        } else {
                          addFavorite(card._id);
                        }
                      }
                      }}
                    >
                      <FaHeart color={userFavorites.includes(card._id) ? '#e63198' : 'white'} />
                    </div>
                    
                    <Link href={`/${card._id}`} passHref>
                      <div style={{ cursor: 'pointer' }}>
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
                                    userHasRated={hasUserRated(card.reviews)}
                                    onVote={() => fetchProducts()}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rectangle-14">
                          <StockProgressBar stock={card.stock} stock_reduc={card.stock_reduc} />
                        </div>
                        <div className={`time_card title_card_subtitle  ${isExpired ? 'expired' : ''}`}>
                          <Countdown endDate={new Date(card.time)} onExpired={() => { if (card._id) { handleCountdownEnd(card._id); } }} title={card.title} />
                        </div>
                      </div>
                    </Link>
                    <div className={`flex-row ${isExpired ? 'expired' : ''}`}>
                  
                      <button
                        className={`add-to-cart-button ${isSelected ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(card);
                        }}
                        disabled={isExpired || isOutOfStock || isMaxReached || isSelected}
                        style={isSelected ? { cursor: 'not-allowed' } : {}}
                      >
                        {card._id && globalCart[card._id]?.count > 0 && ( // Check by _id
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
                        {isExpired
                          ? 'Offre expirée ❌'
                          : isOutOfStock
                            ? 'Stock épuisé ❌'
                            : isMaxReached && !isSelected
                              ? `Quantité max (${available}) atteinte`
                              : isSelected
                                ? 'Sélectionnée'
                                : 'Ajouter au panier'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isFormVisible && formCard && (
          <UpdateCardModal
            formCard={formCard}
            hideForm={hideForm}
            handleInputChange={() => {}}
            handleAddImageProduitDerive={() => {}}
            handleRemoveProduitDerive={() => {}}
            handleAddProduitDerive={() => {}}
            handleAddCaracteristique={() => {}}
            handleRemoveCaracteristique={() => {}}
            handleAddTableauCaracteristiques={() => {}}
            handleImageChange={() => {}}
            updateCard={updateCard}
            setFormCard={setFormCard}
          />
        )}
        
        {isCarouselOpen && (
          <div className="fullscreen-overlay" onClick={closeCarousel}>
            <div className="fullscreen-carousel">
              {carouselImages.map((image, index) => (
                <div key={index} className="fullscreen-carousel-item">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="fullscreen-carousel-image"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        
        
      </div>
      
      

      
    </div>
  );
}
