"use client";
import React, { useEffect, useState, useContext, useRef } from 'react';
import { FaNewspaper, FaRegListAlt, FaCheck, FaSearch } from 'react-icons/fa';
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
import SearchBar from "@/components/SearchBar";
import FilterButtons from "@/components/FilterButtons";
import NoSearchResults from "@/components/NoSearchResults";
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  const closeCarousel = () => {
    setIsCarouselOpen(false);
    setCarouselImages([]); // Clear images when closing
  };
  const auth = useAuth();
  const user = auth?.user;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const categoryIconsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Card | null>(null);
  const [buttonText, setButtonText] = useState('Ajouter au panier'); // This state might become redundant
  const { globalCart, addToCart, updateCartItemQuantity, removeCartItem, loadingCart, errorCart } = useGlobalCart(); // Updated destructuring
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const [userVotes, setUserVotes] = useState<{ [cardId: string]: number }>({});
  const [products, setProducts] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new'>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleCategory, setVisibleCategory] = useState<string | null>(null);

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
        const data = snapshot.docs.map(doc => ({ _id: doc.id, ...(doc.data() as object) } as Card));
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
      setIsCartOpen(true); // Open the cart
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

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleShowAll = () => {
    setShowNew(false);
    setSelectedCategory(null);
    setSelectedButton('Tout');
    setClickedButton(null);
    setActiveFilter('all');
  };

  const handleShowNew = () => {
    setShowNew(true);
    setSelectedCategory(null);
    setSelectedButton('Nouveau');
    setClickedButton(null);
    setActiveFilter('new');
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

  const filteredByCategory = selectedCategory
    ? filteredBySearch.filter((card) => card.categorie === selectedCategory)
    : filteredBySearch;

  const finalFilteredCards = activeFilter === 'new'
    ? filteredByCategory.filter((card) => card.nouveau)
    : filteredByCategory;

  return (
    <div>
      <CustomMenuItem onCartOpen={() => setIsCartOpen(true)} />
      <div
        className={`video_animate video_animate-wrapper ${videoEnded ? 'collapsed' : ''}`}
        style={{ display: videoEnded ? 'none' : 'block' }}
      >
        <AnimatedBanner onEnd={handleVideoEnd} />
      </div>
      
      <div className="menu-container">
        <div className="menu-header">
          <button className="menu-toggle-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? 'Fermer' : 'Catégories'}
          </button>
          <button
            className={`header-categorie-button ${selectedButton === 'Tout' ? 'selected' : ''}`}
            onClick={() => {
              setShowNew(false);
              setSelectedCategory(null);
              setSelectedButton('Tout');
              setClickedButton(null);
              setActiveFilter('all');
            }}
          >
            <FaRegListAlt size="1.2em" />
            <span>Tout</span>
          </button>
          <button
            className={`header-categorie-button ${selectedButton === 'Nouveau' ? 'selected' : ''}`}
            onClick={() => {
              setShowNew(true);
              setSelectedCategory(null);
              setSelectedButton('Nouveau');
              setClickedButton(null);
              setActiveFilter('new');
            }}
          >
            <FaNewspaper size="1.2em" />
            <span>Nouveau</span>
          </button>
        </div>
        <div className={`menu-content ${isMenuOpen ? 'open' : ''}`}>
          <div className="categories-container">
            {[...new Set(cards.map(card => card.categorie))].map(category => {
              const card = cards.find(card => card.categorie === category);
              return (
                <button
                  className={`categorie_button ${(selectedButton === category || clickedButton === category) ? 'selected' : ''}`}
                  key={card ? card._id : category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowNew(false);
                    setSelectedButton(category);
                    setClickedButton(category);
                    setActiveFilter('all');
                    setVisibleCategory(category);
                  }}
                  onMouseEnter={() => {
                    setSelectedButton(category);
                  }}
                  onMouseLeave={() => {
                    setSelectedButton('');
                  }}
                  style={{ 
                    backgroundColor: (selectedButton === category || clickedButton === category || visibleCategory === category) 
                      ? card?.categorieBackgroundColor 
                      : '' 
                  }}
                  ref={(el) => { categoryIconsRef.current[category] = el; }}
                >
                  {card && card.categorieImage && (
                    <img
                      src={card.categorieImage}
                      alt={category}
                      style={{
                        margin: 'auto',
                        display: 'block',
                        height: '60%',
                        width: '50%',
                        objectFit: 'contain',
                        borderRadius: '100%',
                      }}
                    />
                  )}
                  <span className="categorie-text" style={{ color: card ? card.categorieBackgroundColor : '' }}>
                    {category}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="search-container">
            <SearchBar
              onSearch={handleSearch}
              resultsCount={finalFilteredCards?.length || 0}
              showResultsCount={searchTerm.length > 0}
              className="search-component"
            />
          </div>
        </div>
      </div>
      
      
      
      <div className={`page-content ${isPopupOpen ? 'slide-left' : ''}`}>
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
                    
                    <div className="header_card overlap-group-2">
                      <div className="picture_card-container">
                        <img 
                          className="picture_card" 
                          src={card.images[0]} 
                          alt={card.title.trim().toLowerCase()}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedProduct(card);
                            setIsPopupOpen(true);
                          }}
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
                              <div className="price_card price valign-text-middle inter-normal-white-20px">
                                <span className="double-strikethrough">{card.price}€</span>
                              </div>
                              <div className="price_card price valign-text-middle inter-normal-white-20px">
                                <span>{card.price_promo}€</span>
                              </div>
                            </>
                          ) : (
                            <div className="price_card price valign-text-middle inter-normal-white-20px">
                              <span>{card.price}€</span>
                            </div>
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
      
      <GlobalPrice isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <ProductDetailsModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
