'use client';
import React, { useState } from 'react';
import { useGlobalCart } from '@/components/GlobalCartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import '../Panier.css'; // Réutiliser le style du panier

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CartPage() {
  const { globalCart, loadingCart, errorCart, updateCartItemQuantity, removeCartItem } = useGlobalCart();
  const toast = useToast();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (loadingCart) {
    return <LoadingSpinner />;
  }

  if (errorCart) {
    return <div>Erreur: {errorCart}</div>;
  }

  const cartItems = Object.values(globalCart);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity);
    } else {
      removeCartItem(productId);
    }
  };

  const total = cartItems.reduce((acc, item) => {
    const price = item.price_promo || item.price;
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
      const response = await fetch('/api/stripe/checkout-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const { sessionId, message, error } = await response.json();

      if (!response.ok) {
        throw new Error(error || message || 'Failed to create checkout session.');
      }

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
    <div className="panier-container">
      {cartItems.length === 0 ? (
        <div className="panier-empty">
          <p>Votre panier est vide.</p>
          <Link href="/" className="continuer-shopping">
            Continuer mes achats
          </Link>
        </div>
      ) : (
        <>
        <div className="panier-layout">
          <div className="panier-items">
            {cartItems.map(item => (
              <div key={item._id} className="panier-item">
                <div className="panier-item-image">
                  <Image src={item.images[0]} alt={item.title} width={150} height={150} />
                </div>
                <div className="panier-item-details">
                  <h2>{item.title}</h2>
                  <p>{(item.price_promo || item.price) && `Prix: ${item.price_promo || item.price}€`}</p>
                  <div className="panier-item-quantity">
                    <button onClick={() => handleQuantityChange(item._id, item.count - 1)} className="quantity-btn"><FaMinus /></button>
                    <span>{item.count}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.count + 1)} className="quantity-btn"><FaPlus /></button>
                    <button onClick={() => removeCartItem(item._id)} className="remove-item-btn">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="panier-summary">
            <h2>Total: {total.toFixed(2)}€</h2>
            <button className="checkout-btn" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? 'Redirection...' : 'Passer la commande'}
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
