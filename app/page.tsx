"use client";
import React, { useEffect, useState, useContext, useRef, Suspense } from 'react';
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
import Link from '@/components/ScrollRestorationLink';
import LoadingSpinner from "@/components/LoadingSpinner";
import MenuComponent from '@/components/Menu';
import FilterButtons from "@/components/FilterButtons";
import NewCard from '@/components/NewCard';
import NoSearchResults from '@/components/NoSearchResults';

import UpdateCardModal from '@/components/UpdateCardModal';
import { Card } from '@/types';
import GlobalPrice from '@/components/globalprice';
import { useAuth } from '@/contexts/AuthContext';
import SvgBackground from '@/components/SvgBackground';
import AnimatedBanner from '@/components/AnimatedBanner';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from '@/components/firebaseConfig.ts';
import './globals.css';
import './Cards.css';
// ... other imports
import { useRouter, usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext'; // Import the global search context
import { useGlobalCart } from '@/components/GlobalCartContext';

// Helper function for case-insensitive and accent-insensitive search
const normalizeString = (str: string | undefined | null) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
};

  export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  const [expiredCards, setExpiredCards] = useState<Set<string>>(new Set());
  const [specialRequests, setSpecialRequests] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { searchTerm, setSearchTerm } = useSearch(); // Use global search state
  const [userVotes, setUserVotes] = useState<{ [cardId: string]: number }>({});
  const [products, setProducts] = useState<any[]>([]);
  
  const [selectedRating, setSelectedRating] = useState(0);
  
  const pageContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only restore scroll if there are cards and a saved position exists
    if (cards.length > 0) {
      const savedScrollPos = sessionStorage.getItem(`scrollPos_/`);
      if (savedScrollPos) {
        console.log(`[Page] Restoring scroll to ${savedScrollPos} now that cards are loaded.`);
        window.scrollTo(0, parseInt(savedScrollPos, 10));
        sessionStorage.removeItem(`scrollPos_/`); // Clean up after restoring
      }
    }
  }, [cards]); // Depend on `cards` to ensure content is loaded



  // Effect to update URL when global searchTerm changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    else {
      params.delete('search');
    }
    // Only update the URL if we are on the homepage
    if (pathname === '/') {
      router.replace(`/?${params.toString()}`);
    }
  }, [searchTerm, pathname, router]);

  const handleCategoryToggle = (category: string) => {
    setActiveFilter('all'); // Reset to 'all' when toggling categories
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };







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
  const [activeFilter, setActiveFilter] = useState<'all' | 'new'>('all');
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedCategories = sessionStorage.getItem('selectedCategories');
    if (savedCategories) {
      setSelectedCategories(JSON.parse(savedCategories));
    }
    const savedFilter = sessionStorage.getItem('activeFilter');
    if (savedFilter) {
      setActiveFilter(savedFilter as 'all' | 'new');
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
      sessionStorage.setItem('activeFilter', activeFilter);
    }
  }, [selectedCategories, activeFilter]);

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  const closeCarousel = () => {
    setIsCarouselOpen(false);
    setCarouselImages([]); // Clear images when closing
  };
  const { user, userFavorites, toggleFavorite, purchasedProductIds } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const categoryIconsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);
  
  
  const [buttonText, setButtonText] = useState('Ajouter au panier'); // This state might become redundant
  const { globalCart, addToCart, updateCartItemQuantity, removeCartItem, loadingCart, errorCart, clearCart, clearCartError } = useGlobalCart(); // Updated destructuring
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());


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



  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredBySearch = searchTerm
    ? cards.filter(
        (card) => {
          const normalizedSearchTerm = normalizeString(searchTerm);
          return (
            normalizeString(card.title).includes(normalizedSearchTerm) ||
            normalizeString(card.subtitle).includes(normalizedSearchTerm) ||
            normalizeString(card.categorie).includes(normalizedSearchTerm)
          );
        }
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
      {loading && <LoadingSpinner />} {/* Render LoadingSpinner conditionally */}
      <div
        className={`video_animate video_animate-wrapper ${videoEnded ? 'collapsed' : ''}`}
        style={{ opacity: videoEnded ? 0 : 1, pointerEvents: videoEnded ? 'none' : 'auto' }}
      >
      </div>
            <div
        className={`video_animate video_animate-wrapper video_animate-wrapper ${videoEnded ? 'collapsed' : ''}`}
      >
        <AnimatedBanner onEnd={handleVideoEnd} />
      </div>
      
      <Suspense fallback={<div>Chargement du contenu...</div>}>
        <div className="page-content" ref={pageContentRef}> {/* Moved Menu inside here */}
          <MenuComponent
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
            resultsCount={finalFilteredCards.length}
          />
          {searchTerm && finalFilteredCards.length === 0 && (
            <NoSearchResults 
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm('')} // Use context setter
            />
          )}
          
          <div className="cards-container">
            {finalFilteredCards.map((card, index) => {
              const isSelected = card._id ? !!globalCart[card._id]?.count : false;
              const isExpired = card._id ? expiredCards.has(card._id) : false;
              const totalStock = Number(card.stock);
              const usedStock = Number(card.stock_reduc);
              const isOutOfStock = totalStock > 0 && usedStock >= totalStock;
              const available = totalStock - usedStock;
              const currentCount = card._id ? globalCart[card._id]?.count || 0 : 0;
              const isMaxReached = currentCount >= available;
              const averageRating = calculateAverageRating(card.reviews);
              const userHasRated = hasUserRated(card.reviews);
              const isFavorite = card._id ? userFavorites.includes(card._id) : false;
              const hasBeenPurchased = card._id ? purchasedProductIds.includes(card._id) : false;

              const handleFavoriteToggle = async (cardId: string) => {
                if (!user) {
                  router.push('/login');
                  return;
                }
                try {
                  await toggleFavorite(cardId);
                } catch (error) {
                  console.error("Error toggling favorite:", error);
                }
              };

              return (
                <NewCard
                  key={card._id}
                  card={card}
                  isFavorite={isFavorite}
                  isSelected={isSelected}
                  isExpired={isExpired}
                  isOutOfStock={isOutOfStock}
                  isMaxReached={isMaxReached}
                  currentCount={currentCount}
                  averageRating={averageRating}
                  userHasRated={userHasRated}
                  hasBeenPurchased={hasBeenPurchased} // Pass the new prop
                  onAddToCart={handleAddToCart}
                  onFavoriteToggle={handleFavoriteToggle}
                  onCountdownEnd={handleCountdownEnd}
                  fetchProducts={fetchProducts}
                  onCategoryClick={handleCategoryToggle}
                />
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
      </Suspense>
    </div>
  );
}
