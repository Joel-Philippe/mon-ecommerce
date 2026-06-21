import Stripe from 'stripe';

export function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error('Stripe secret key is not configured');
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-08-27.basil',
  });
}
