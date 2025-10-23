"use client";
import React, { useState, useRef, useEffect } from 'react';
import { FiPower, FiUser, FiLogIn, FiShoppingBag, FiMail } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@chakra-ui/react';
import ScrollRestorationLink from '@/components/ScrollRestorationLink';
import './BurgerMenu.css';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="burger-menu-container" ref={menuRef}>
      {user ? (
        <button onClick={toggleMenu} className="profile-avatar-button" aria-label="Menu">
          <Avatar
            name={user?.displayName || undefined}
            src={user?.photoURL || undefined}
            size="sm"
            bg="rgb(251 0 255)"
            color="white"
          />
        </button>
      ) : (
        <button onClick={toggleMenu} className="burger-menu-button" aria-label="Menu">
          <div className={`burger-icon ${isOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="burger-menu-panel">
          {user ? (
            <div className="user-info-section">
              <Avatar
                name={user?.displayName || undefined}
                src={user?.photoURL || undefined}
                size="md"
                bg="rgb(251 0 255)"
                color="white"
              />
              <span className="user-name">{user.displayName}</span>
              {user.email && <span className="user-email">{user.email}</span>}
              <ScrollRestorationLink href="/account" passHref legacyBehavior>
                <a className="menu-item">
                  <FiUser />
                  <span>Mon Compte</span>
                </a>
              </ScrollRestorationLink>
              <ScrollRestorationLink href="/my-orders" passHref legacyBehavior>
                <a className="menu-item">
                  <FiShoppingBag />
                  <span>Mes Achats</span>
                </a>
              </ScrollRestorationLink>
              <a href="mailto:airpoolfan@gmail.com" className="menu-item">
                <FiMail />
                <span>Contact</span>
              </a>
              <button onClick={handleLogout} className="menu-item logout-button">
                <FiPower />
                <span>Déconnexion</span>
              </button>
            </div>
          ) : (
            <React.Fragment>
              <ScrollRestorationLink href="/login" passHref legacyBehavior>
                <a className="menu-item">
                  <FiLogIn />
                  <span>Connexion</span>
                </a>
              </ScrollRestorationLink>
              <a href="mailto:airpoolfan@gmail.com" className="menu-item">
                <FiMail />
                <span>Contact</span>
              </a>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;