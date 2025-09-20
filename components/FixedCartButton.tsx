'use client';

import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useGlobalCart } from '@/components/GlobalCartContext';
import GlobalPrice from '@/components/globalprice';

const FixedCartButton = () => {
  const { globalCart, loadingCart } = useGlobalCart();
  const totalItemsInCart = Object.values(globalCart).reduce((total, item) => total + item.count, 0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="fixed-cart-button" onClick={handleButtonClick}>
        <FaShoppingCart size={24} />
        {totalItemsInCart > 0 && (
          <span className="cart-badge">
            {totalItemsInCart}
          </span>
        )}
        <style jsx>{`
          .fixed-cart-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #ff8f00; /* Primary color from project */
            color: white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
          }
          .fixed-cart-button:hover {
            background-color: #764ba2; /* Darker shade on hover */
            transform: translateY(-2px);
          }
          .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #ef4444; /* Red for notification */
            color: white;
            border-radius: 50%;
            padding: 4px 8px;
            font-size: 12px;
            font-weight: bold;
            min-width: 24px;
            text-align: center;
          }
        `}</style>
      </div>

      <GlobalPrice isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default FixedCartButton;