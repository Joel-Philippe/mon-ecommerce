"use client";
import React, { useState, useEffect } from 'react';
import { FaRegListAlt, FaNewspaper } from 'react-icons/fa';
import './Menu.css';
import SearchBar from './SearchBar';
import { Card } from '@/types';

interface MenuProps {
  cards: Card[];
  onFilterChange: (category: string | null, filter: 'all' | 'new') => void;
  onSearch: (term: string) => void;
  resultsCount: number;
  searchTerm: string;
}

const Menu: React.FC<MenuProps> = ({ cards, onFilterChange, onSearch, resultsCount, searchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState('Tout');

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  const handleFilter = (category: string | null, filter: 'all' | 'new') => {
    onFilterChange(category, filter);
    setSelectedButton(category || (filter === 'new' ? 'Nouveau' : 'Tout'));
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  const categories = [...new Set(cards.map(card => card.categorie).filter(Boolean))] as string[];

  return (
    <div className="menu-container">
      <div className="menu-header">
        <button className="menu-toggle-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? 'Fermer' : 'Catégories'}
        </button>
        <div className="header-main-buttons">
          <button
            className={`header-categorie-button ${selectedButton === 'Tout' ? 'selected' : ''}`}
            onClick={() => handleFilter(null, 'all')}
          >
            <FaRegListAlt size="1.2em" />
            <span>Tout</span>
          </button>
          <button
            className={`header-categorie-button ${selectedButton === 'Nouveau' ? 'selected' : ''}`}
            onClick={() => handleFilter(null, 'new')}
          >
            <FaNewspaper size="1.2em" />
            <span>Nouveau</span>
          </button>
        </div>
      </div>
      <div className={`menu-content ${isMenuOpen ? 'open' : ''}`}>
        <div className="search-container">
          <SearchBar
            onSearch={onSearch}
            resultsCount={resultsCount}
            showResultsCount={searchTerm.length > 0}
            className="search-component"
          />
        </div>
        <div className="categories-container">
          {categories.map(category => {
            const card = cards.find(c => c.categorie === category);
            return (
              <button
                className={`categorie_button ${selectedButton === category ? 'selected' : ''}`}
                key={category}
                onClick={() => handleFilter(category, 'all')}
                style={{
                  backgroundColor: selectedButton === category ? card?.categorieBackgroundColor : '',
                }}
              >
                {card && card.categorieImage && (
                  <img
                    src={card.categorieImage}
                    alt={category}
                    className="categorie-image"
                  />
                )}
                <span className="categorie-text" style={{ color: selectedButton === category ? 'white' : card?.categorieBackgroundColor }}>
                  {category}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Menu;
