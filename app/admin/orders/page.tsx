'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './OrdersPage.module.css';

// Définition du type pour une commande
interface Order {
  id: string;
  customer_email: string;
  displayName: string;
  totalPaid: number;
  createdAt: string;
  items: Array<{ title: string; count: number; price: number }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    const checkAdminAccess = async () => {
      if (user) {
        const adminEmail = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL;
        if (user.email === adminEmail) {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
      setLoadingAdminCheck(false);
    };

    checkAdminAccess();
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchOrders = async () => {
      try {
        const token = await user?.getIdToken();
        if (!token) {
          throw new Error('Authentication token not available.');
        }

        const response = await fetch('/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin, user]);

  if (authLoading || loadingAdminCheck || loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  if (!isAdmin) {
    return null; // Or redirect to an access denied page
  }

  if (error) {
    return <div className={`${styles.container} ${styles.error}`}><p>Error: {error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Toutes les commandes</h1>
      {orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <h2>Commande de {order.displayName}</h2>
                <p className={styles.orderDate}>Le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className={styles.cardBody}>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Montant Total:</strong> {(order.totalPaid || 0).toFixed(2)} €</p>
                <h4 className={styles.itemsTitle}>Articles :</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.count} x {item.title}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.cardFooter}>
                <p>ID Commande: {order.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
