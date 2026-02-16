'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Card } from '@/types';
import { doc, onSnapshot } from "firebase/firestore";
import { getCartId } from "@/utils/getCartId";
import { db } from "@/components/firebaseConfig";



// Define the structure of a cart item as stored in Firestore
interface FirestoreCartItem {
  productId: string;
  quantity: number;
}

// Define the structure of a cart item with full product details (for display)
interface CartItemWithDetails {
  _id: string; // This will be the productId
  count: number; // This will be the quantity
  price: any; // Price from product details
  price_promo?: any; // Promo price from product details
  images: any; // Images from product details
  deliveryTime?: any; // Delivery time from product details
  expiryDate?: any; // Expiry date from product details
  title: string; // Title from product details
  stock: number;
  stock_reduc: number;
}

interface GlobalCartContextType {
  globalCart: { [key: string]: CartItemWithDetails };
  loadingCart: boolean;
  errorCart: string | null;
  addToCart: (product: Card, quantity: number) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  removeCartItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartError: () => void;
}

export const GlobalCartContext = createContext<GlobalCartContextType | null>(null);

export const GlobalCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalCart, setGlobalCart] = useState<{ [key: string]: CartItemWithDetails }>({});
  const [loadingCart, setLoadingCart] = useState<boolean>(true);
  const [errorCart, setErrorCart] = useState<string | null>(null);
  const [productDetailsCache, setProductDetailsCache] = useState<{ [key: string]: Card }>({});

  // Function to fetch product details for items in the cart
  const fetchProductDetails = useCallback(async (items: FirestoreCartItem[]): Promise<{ [key: string]: CartItemWithDetails }> => {
    if (items.length === 0) return {};

    const detailedCart: { [key: string]: CartItemWithDetails } = {};
    const productIdsToFetch: string[] = [];

    items.forEach(item => {
      if (!productDetailsCache[item.productId]) {
        productIdsToFetch.push(item.productId);
      }
    });

    let fetchedProducts: Card[] = [];
    if (productIdsToFetch.length > 0) {
      try {
        const response = await fetch('/api/products/details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: productIdsToFetch }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        fetchedProducts = await response.json();
        const newCacheEntries: { [key: string]: Card } = {};
        fetchedProducts.forEach(p => {
          if (p._id) {
            newCacheEntries[p._id] = p;
          }
        });
        setProductDetailsCache(prevCache => ({ ...prevCache, ...newCacheEntries }));
      } catch (err: any) {
        console.error("Error fetching product details for cart:", err);
        setErrorCart(err.message || "Failed to load product details for cart.");
      }
    }

    items.forEach(cartItem => {
      const productDetail = productDetailsCache[cartItem.productId] || fetchedProducts.find((p: any) => p._id === cartItem.productId);
      if (productDetail) {
        detailedCart[cartItem.productId] = {
          _id: productDetail._id,
          count: cartItem.quantity,
          price: productDetail.price,
          price_promo: productDetail.price_promo,
          images: productDetail.images,
          deliveryTime: productDetail.deliveryTime,
          expiryDate: productDetail.time,
          title: productDetail.title,
          stock: productDetail.stock,
          stock_reduc: productDetail.stock_reduc,
        };
      }
    });
    return detailedCart;
  }, [productDetailsCache]);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const setupCartListener = async () => {
      setLoadingCart(true);
      setErrorCart(null);
      const currentCartId = await getCartId();

      if (currentCartId) {
        const cartRef = doc(db, "carts", currentCartId);
        unsubscribe = onSnapshot(cartRef, async (docSnap) => {
          if (docSnap.exists()) {
            const firestoreItems: FirestoreCartItem[] = docSnap.data().items || [];
            const detailedCart = await fetchProductDetails(firestoreItems);
            setGlobalCart(detailedCart);
          } else {
            setGlobalCart({});
          }
          setLoadingCart(false);
        }, (error) => {
          console.error("Error listening to cart:", error);
          setErrorCart(error.message || "Failed to load cart.");
          setLoadingCart(false);
        });
      } else {
        setGlobalCart({});
        setLoadingCart(false);
      }
    };

    setupCartListener();

    return () => unsubscribe();
  }, [fetchProductDetails]);

  const addToCart = useCallback(async (product: Card, quantity: number): Promise<void> => {
    setErrorCart(null);

    if (!product._id) {
      console.error("Error: Product ID is missing for product:", product);
      setErrorCart("Impossible d'ajouter le produit au panier: ID manquant.");
      throw new Error("Product ID is missing");
    }

    if (product.time && new Date(product.time) < new Date()) {
      const errorMessage = `Le produit "${product.title}" est expiré et ne peut pas être ajouté au panier.`;
      console.error(errorMessage);
      setErrorCart(errorMessage);
      throw new Error(errorMessage);
    }

    const availableStock = product.stock - product.stock_reduc;
    const itemInCart = globalCart[product._id];
    const currentQuantityInCart = itemInCart ? itemInCart.count : 0;
    const newTotalQuantity = currentQuantityInCart + quantity;

    if (newTotalQuantity > availableStock) {
      const errorMessage = `Stock insuffisant. Il ne reste que ${availableStock} exemplaire(s) disponible(s).`;
      console.error(errorMessage);
      setErrorCart(errorMessage);
      throw new Error(errorMessage);
    }

    setLoadingCart(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }
      // No need to call fetchCart here, onSnapshot will handle the update
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      setErrorCart(err.message || "Failed to add item to cart.");
      throw err;
    } finally {
      setLoadingCart(false);
    }
  }, [globalCart]);

  const updateCartItemQuantity = useCallback(async (productId: string, quantity: number) => {
    setErrorCart(null);
    const prevGlobalCart = { ...globalCart }; // Store current cart state for rollback

    // Optimistic UI update
    setGlobalCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId]) {
        newCart[productId] = { ...newCart[productId], count: quantity };
      }
      return newCart;
    });

    setLoadingCart(true); // Still show a loading indicator for the background operation
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart item quantity');
      }
      // No need to call fetchCart here, onSnapshot will handle the update
    } catch (err: any) {
      console.error("Error updating cart item quantity:", err);
      setErrorCart(err.message || "Failed to update cart item quantity.");
      setGlobalCart(prevGlobalCart); // Rollback on error
    } finally {
      setLoadingCart(false);
    }
  }, [globalCart]);



  const removeCartItem = useCallback(async (productId: string) => {
    setLoadingCart(true);
    setErrorCart(null);
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }
      // No need to call fetchCart here, onSnapshot will handle the update
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setErrorCart(err.message || "Failed to remove item from cart.");
    } finally {
      setLoadingCart(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setLoadingCart(true);
    setErrorCart(null);
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to clear cart on the server:", errorData.message);
        throw new Error(errorData.message || 'Failed to clear cart');
      }
    } catch (err: any) {
      console.error("Error clearing cart:", err);
      setErrorCart(err.message || "Failed to clear cart.");
    } finally {
      setLoadingCart(false);
    }
  }, []);

  const clearCartError = () => {
    setErrorCart(null);
  };

  return (
    <GlobalCartContext.Provider
      value={{
        globalCart,
        loadingCart,
        errorCart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        clearCartError,
      }}
    >
      {children}
    </GlobalCartContext.Provider>
  );
};

export const useGlobalCart = () => {
  const context = useContext(GlobalCartContext);
  if (!context) {
    console.error("useGlobalCart must be used within a GlobalCartProvider, but context is null. Returning dummy values for debugging.");
    return {
      globalCart: {},
      loadingCart: false,
      errorCart: "Context not available (debug mode)",
      addToCart: async () => {},
      updateCartItemQuantity: async () => {},
      removeCartItem: async () => {},
      clearCart: async () => {},
      clearCartError: () => {},
    };
  }
  return context;
};
