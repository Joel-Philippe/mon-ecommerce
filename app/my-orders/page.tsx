'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MyOrders.module.css';

interface OrderItem {
  id: string;
  title: string;
  count: number;
  price: number;
  images: string[];
}

interface Order {
  id: string;
  createdAt: { seconds: number; nanoseconds: number } | Date | string;
  totalPaid: number;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      setLoading(false);
      setError('Veuillez vous connecter pour voir vos commandes.');
      return;
    }

    const fetchOrders = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Impossible de récupérer les commandes.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}></h1>
      {orders.length === 0 ? (
        <p>Tu n'as encore effectué aucun achat.</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h2 className={styles.orderId}>Commande #{order.id}</h2>
                  <p className={styles.orderDate}>
                    {new Date(order.createdAt && typeof order.createdAt === 'object' && 'seconds' in order.createdAt ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className={styles.orderTotal}>{(Number(order.totalPaid) || 0).toFixed(2)}€</div>
              </div>
              <div className={styles.itemList}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <Image 
                      src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.png'} 
                      alt={item.title} 
                      width={60} 
                      height={60} 
                      className={styles.itemImage} 
                    />
                    <div className={styles.itemInfo}>
                      <Link href={`/${item.id}`} className={styles.itemTitle}>{item.title}</Link>
                      <p className={styles.itemQuantity}>Quantité: {item.count}</p>
                    </div>
                    <p className={styles.itemPrice}>{(item.price * item.count).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
