'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalCart } from '@/components/GlobalCartContext';
import './BottomNav.css';

const BottomNav = () => {
  const { userFavorites } = useAuth();
  const { globalCart } = useGlobalCart();
  const pathname = usePathname();

  const cartItemsCount = Object.values(globalCart).reduce((total, item) => total + item.count, 0);

  return (
    <div className="bottom-nav">
      <Link href="/" passHref>
        <div className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <FaHome size={24} />
        </div>
      </Link>
      <Link href="/favorites" passHref>
        <div className={`nav-item ${pathname === '/favorites' ? 'active' : ''}`}>
          <FaHeart size={24} />
          {userFavorites.length > 0 && <span className="nav-badge favorite-badge">{userFavorites.length}</span>}
        </div>
      </Link>
      <Link href="/cart" passHref>
        <div className={`nav-item ${pathname === '/cart' ? 'active' : ''}`}>
          <FaShoppingCart size={24} />
          {cartItemsCount > 0 && <span className="nav-badge cart-badge">{cartItemsCount}</span>}
        </div>
      </Link>
    </div>
  );
};

export default BottomNav;
