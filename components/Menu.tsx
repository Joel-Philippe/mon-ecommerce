"use client";
import React, { useState, useEffect } from 'react';
import SelectedCategories from './SelectedCategories';
import './Menu.css';
import SearchBar from './SearchBar';
import { Card } from '@/types';

interface MenuProps {
  cards: Card[];
  selectedCategories: string[];
  activeFilter: 'all' | 'new';
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  onShowNew: () => void;
  onSearch: (term: string) => void;
  resultsCount: number;
  searchTerm: string;
}

const Menu: React.FC<MenuProps> = ({ 
  cards, 
  selectedCategories,
  activeFilter,
  onCategoryToggle,
  onClearAll,
  onShowNew,
  onSearch, 
  resultsCount, 
  searchTerm 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);

  const handleCategoryClick = (category: string) => {
    onCategoryToggle(category);
  };

  const handleSearch = (term: string) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    onSearch(term);
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
          >
            <span className={`header-categorie-button ${activeFilter === 'all' && selectedCategories.length === 0 ? 'selected' : ''}`}
            onClick={onClearAll}>Tout</span>
          </button>
          <button
          >
            <span
            className={`header-categorie-button ${activeFilter === 'new' ? 'selected' : ''}`}
            onClick={onShowNew}
            >Nouveau</span>
          </button>
        </div>
      </div>
      <div className={`menu-content ${isMenuOpen ? 'open' : ''}`}>
        <p className="category-selection-message">Vous pouvez sélectionner une ou plusieurs catégories.</p>
        <div className="categories-container">
          {categories.map(category => {
            const card = cards.find(c => c.categorie === category);
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                className={`categorie_button ${isSelected ? 'selected' : ''}`}
                key={category}
                onClick={() => handleCategoryClick(category)}
                style={{
                  backgroundColor: isSelected ? card?.categorieBackgroundColor : '',
                }}
              >
                {card && card.categorieImage && (
                  <img
                    src={card.categorieImage}
                    alt={category}
                    className="categorie-image"
                  />
                )}
                <span className="categorie-text" style={{ color: isSelected ? 'white' : card?.categorieBackgroundColor }}>
                  {category}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <SelectedCategories 
        allCards={cards}
        selectedCategories={selectedCategories}
        onRemoveCategory={onCategoryToggle} 
        onClearAll={onClearAll}
      />
      <div className="search-container">
        <SearchBar
          onSearch={handleSearch}
          resultsCount={resultsCount}
          showResultsCount={searchTerm.length > 0}
          className="search-component"
        />
      </div>
    </div>
  );
};

export default Menu;
