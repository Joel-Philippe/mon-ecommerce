'use client';
// components/CheckoutForm.tsx
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useGlobalCart();
  const { user } = useAuth() || {};

  const paymentElementOptions = {
    layout: 'tabs',
    defaultValues: {
      billingDetails: {
        email: user?.email || '',
      },
    },
  };

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage('Confirmation du paiement...');

    const pendingOrderJSON = localStorage.getItem('pendingOrder');
    if (!pendingOrderJSON) {
      setMessage("Erreur: Détails de la commande non trouvés. Impossible de finaliser.");
      setIsLoading(false);
      return;
    }
    const pendingOrder = JSON.parse(pendingOrderJSON);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            email: user?.email || pendingOrder.deliveryInfo.email,
          },
        },
      },
      redirect: 'if_required'
    });
