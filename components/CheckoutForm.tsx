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

    if (error) {
      setMessage(error.message || 'Une erreur est survenue lors du paiement.');
      setIsLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      setMessage('Paiement réussi ! Enregistrement de votre commande...');

      try {
        const orderData = {
          ...pendingOrder,
          paymentIntentId: paymentIntent.id,
          totalPaid: paymentIntent.amount / 100, // Amount in cents, convert to currency unit
          userId: user?.uid, // Attach user ID if available
          customer_email: user?.email || pendingOrder.deliveryInfo.email,
          displayName: user?.displayName || `${pendingOrder.deliveryInfo.firstName} ${pendingOrder.deliveryInfo.lastName}`
        };

        const response = await fetch('/api/add-order', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Erreur lors de l'enregistrement de la commande après paiement.");
        }

        // Send confirmation email
        await fetch('/api/send-confirmation-email', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        // Cleanup and redirect
        localStorage.removeItem('pendingOrder');
        await clearCart();
        router.push(`/success?email=${encodeURIComponent(orderData.customer_email)}`);

      } catch (orderError: any) {
        setMessage(`Erreur critique : Votre paiement a été accepté, mais nous n'avons pas pu enregistrer votre commande. Veuillez nous contacter. Erreur: ${orderError.message}`);
        // Do not set isLoading to false, to prevent retry of a successful payment.
      }

    } else {
        setMessage(paymentIntent.status);
    }

    // Keep loading state on success to prevent multiple submissions, as redirection will occur.
    if(paymentIntent?.status !== 'succeeded') {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{
        layout: 'tabs',
        defaultValues: {
          billingDetails: {
            email: user?.email || '',
          },
        },
      }} />
      <button
        disabled={isLoading || !stripe || !elements}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full font-semibold"
      >
        {isLoading ? message : 'Payer'}
      </button>
      {message && !isLoading && <div className="text-red-500 mt-2">{message}</div>}
    </form>
  );
}
