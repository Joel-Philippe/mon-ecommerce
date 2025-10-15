'use client';
import { useState, useEffect } from 'react';
import CustomLink from '@/components/CustomLink';
import { usePathname } from 'next/navigation';
import { FaHome, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { useSearch } from '@/contexts/SearchContext'; // Import useSearch
import './BottomNav.css';

const BottomNav = () => {
  const { userFavorites } = useAuth();
  const { globalCart } = useGlobalCart();
  const pathname = usePathname();
  const { searchTerm } = useSearch(); // Get searchTerm from global context

  console.log('userFavorites:', userFavorites, 'length:', userFavorites.length);

  const [animateFavorites, setAnimateFavorites] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  const cartItemsCount = Object.values(globalCart).reduce((total, item) => total + item.count, 0);

  useEffect(() => {
    if (userFavorites.length > 0) {
      setAnimateFavorites(true);
      const timer = setTimeout(() => setAnimateFavorites(false), 500);
      return () => clearTimeout(timer);
    }
  }, [userFavorites.length]);

  useEffect(() => {
    if (cartItemsCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (userFavorites.length > 0) {
      interval = setInterval(() => {
        setAnimateFavorites(true);
        setTimeout(() => setAnimateFavorites(false), 500);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [userFavorites.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cartItemsCount > 0) {
      interval = setInterval(() => {
        setAnimateCart(true);
        setTimeout(() => setAnimateCart(false), 500);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [cartItemsCount]);

  return (
    <div className="bottom-nav">
      <CustomLink href="/favorites" passHref>
        <div className={`nav-item ${pathname === '/favorites' ? 'active' : ''} ${animateFavorites ? 'jiggle-animation' : ''}`}>
          <FaHeart size={24} />
          {userFavorites.length > 0 && <span className="nav-badge favorite-badge">{userFavorites.length}</span>}
        </div>
      </CustomLink>
      <CustomLink href={searchTerm ? `/?search=${searchTerm}` : '/'} passHref>
        <div className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <FaHome size={24} />
        </div>
      </CustomLink>
      <CustomLink href="/cart" passHref>
        <div className={`nav-item ${pathname === '/cart' ? 'active' : ''} ${animateCart ? 'jiggle-animation' : ''}`}>
          <FaShoppingCart size={24} />
          {cartItemsCount > 0 && <span className="nav-badge cart-badge">{cartItemsCount}</span>}
        </div>
      </CustomLink>
    </div>
  );
};

export default BottomNav;
