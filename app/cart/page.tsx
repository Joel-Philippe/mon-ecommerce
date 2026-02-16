'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useGlobalCart } from '@/components/GlobalCartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from '@/components/ScrollRestorationLink';
import Image from 'next/image';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

import '../Panier.css'; // Réutiliser le style du panier

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CartPage() {
  const { globalCart, loadingCart, errorCart, updateCartItemQuantity, removeCartItem, clearCartError } = useGlobalCart();
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

  const toast = useToast();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevGlobalCart, setPrevGlobalCart] = useState(globalCart);

  // Effect to save scroll position before globalCart updates
  useEffect(() => {
    if (scrollRef.current && globalCart !== prevGlobalCart) {
      sessionStorage.setItem('cartScrollPos', scrollRef.current.scrollTop.toString());
    }
    setPrevGlobalCart(globalCart);
  }, [globalCart, prevGlobalCart]);

  // Effect to restore scroll position after globalCart updates
  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('cartScrollPos');
    if (scrollRef.current && savedScrollPos) {
      scrollRef.current.scrollTop = parseInt(savedScrollPos, 10);
      sessionStorage.removeItem('cartScrollPos'); // Clear after restoring
    }
  }, [globalCart]); // Run this effect after globalCart has been updated and rendered

  const showErrorToast = () => {
    toast({
      title: 'Erreur de panier',
      description: errorCart,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    clearCartError();
  };

  if (errorCart) {
    showErrorToast();
  }

  if (authLoading) { // Keep authLoading for full page spinner if not authenticated
    return <LoadingSpinner />;
  }

  const cartItems = Object.values(globalCart);
  const isAuthenticated = !!user;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (loadingCart) return; // Prevent multiple rapid updates
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity);
    } else {
      removeCartItem(productId);
    }
  };

  const total = cartItems.reduce((acc, item) => {
    const price = isAuthenticated && item.price_promo ? item.price_promo : item.price;
    return acc + (price ? Number(price) * item.count : 0);
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Panier vide',
        description: 'Veuillez ajouter des articles à votre panier avant de passer à la caisse.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsCheckingOut(true);

    const items = cartItems.map(item => ({
      _id: item._id,
      count: item.count,
      title: item.title,
      images: item.images,
    }));

    try {
      const idToken = isAuthenticated ? await user.getIdToken() : null;
      const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const response = await fetch('/api/stripe/checkout-sessions', {
        method: 'POST',
        headers,
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Failed to create checkout session.';
        throw new Error(errorMessage);
      }

      const { sessionId } = data;

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js has not loaded yet.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      toast({
        title: 'Erreur de paiement',
        description: err.message || 'Une erreur est survenue lors de la redirection vers le paiement.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="panier-container" ref={scrollRef}>
      {!isAuthenticated && (
        <div className="guest-message">
          <p>Vous n'êtes pas connecté. <Link href="/login">Connectez-vous</Link> pour bénéficier de nos réductions exclusives !</p>
        </div>
      )}
      {cartItems.length === 0 ? (
        <div className="panier-empty">
          <p>Ton panier est vide...</p>
          <Link href="/" className="continuer-shopping">
            Continuer mes achats
          </Link>
        </div>
      ) : (
        <>
        <div className="panier-layout">
            <div className="panier-summary">
              <h2>Total: {total.toFixed(2)}€</h2>
              <button className="checkout-btn" onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? <AiOutlineLoading className="loading-spinner" /> : 'Passer la commande'}
              </button>
            </div>
            <div className="panier-items">
              {cartItems.map(item => {
                const price = isAuthenticated && item.price_promo ? item.price_promo : item.price;
                return (
                  <div key={item._id} className="panier-item">
                    <Link href={`/${item._id}`} passHref legacyBehavior>
                      <div className="panier-item-image">
                        <Image src={item.images[0]} alt={item.title} width={150} height={150} />
                      </div>
                    </Link>
                    <div className="panier-item-details">
                      <h2>{item.title}</h2>
                      <p>{price && `${price}€`}</p>
                      <div className="panier-item-quantity">
                        <button onClick={() => handleQuantityChange(item._id, item.count - 1)} className="quantity-btn" disabled={loadingCart}><FaMinus /></button>
                        <span>{item.count}</span>
                        <button onClick={() => handleQuantityChange(item._id, item.count + 1)} className="quantity-btn" disabled={loadingCart}><FaPlus /></button>
                        <button onClick={() => removeCartItem(item._id)} className="remove-item-btn" disabled={loadingCart}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
          </>
        )}
      </div>
  );
}