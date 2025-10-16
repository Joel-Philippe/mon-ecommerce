"use client";
import React, { useState, useEffect } from 'react';
import SelectedCategories from './SelectedCategories';
import './Menu.css';
import SearchBar from './SearchBar';
import BurgerMenu from './BurgerMenu';
import { Sparkles, Filter, Search, X } from 'lucide-react';
import { Card } from '@/types';
import { useSearch } from '@/contexts/SearchContext';

interface MenuProps {
  cards: Card[];
  selectedCategories: string[];
  activeFilter: 'all' | 'new';
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  onShowNew: () => void;
  resultsCount: number;
}

const MenuComponent: React.FC<MenuProps> = ({
  cards,
  selectedCategories,
  activeFilter,
  onCategoryToggle,
  onClearAll,
  onShowNew,
  resultsCount,
}) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false); // New state for search bar

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
      console.log('[Menu] Added no-scroll class');
    } else {
      document.body.classList.remove('no-scroll');
      console.log('[Menu] Removed no-scroll class');
    }
    return () => {
      document.body.classList.remove('no-scroll');
      console.log('[Menu] Cleanup: Removed no-scroll class');
    };
  }, [isMenuOpen]);

  const handleCategoryClick = (category: string) => {
    onCategoryToggle(category);
  };

  const handleClearAll = () => {
    onClearAll();
    setSearchTerm('');
  };

  const handleShowNew = () => {
    onShowNew();
    setSearchTerm('');
  };

  const categories = [...new Set(cards.map(card => card.categorie).filter(Boolean))] as string[];

  console.log('[Menu] isMenuOpen:', isMenuOpen); // Log isMenuOpen state

  return (
    <div className="menu-container">
      <div className={`menu-header ${isSearchActive ? 'search-active' : ''}`}> {/* Add class for styling */}
        {isSearchActive ? (
          <> {/* Full search bar when active */}
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Rechercher un article..."
              className="search-component full-width-search"
            />
            <button className="menu-toggle-button close-search-button" onClick={() => {
              setIsSearchActive(false);
              setSearchTerm('');
            }} aria-label="Fermer la recherche">
              <X className="button-icon" />
            </button>
          </>
        ) : (
          <> {/* Normal menu buttons when not active */}
            <button className={`menu-toggle-button ${isMenuOpen ? 'validate-button-active' : ''} ${isMenuOpen && selectedCategories.length > 0 ? 'highlight-validate' : ''}`} onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              console.log('[Menu] Toggling isMenuOpen to:', !isMenuOpen); // Log toggle action
            }}>
              {isMenuOpen ? 'Valider' : <><Filter className="button-icon" />Filtre</>}
            </button>
            {/* Hide other buttons when validate is highlighted */}
            {!(isMenuOpen && selectedCategories.length > 0) && (
              <>
                <div className="header-main-buttons">
                  <button>
                    <span className={`header-categorie-button ${activeFilter === 'all' && selectedCategories.length === 0 ? 'selected' : ''}`}
                    onClick={handleClearAll}>Tout</span>
                  </button>
                  <button>
                    <span
                    className={`header-categorie-button ${activeFilter === 'new' ? 'selected' : ''}`}
                    onClick={handleShowNew}
                    ><Sparkles className="button-icon" />Nouveau</span>
                  </button>
                </div>
                <button className="menu-toggle-button search-icon-button" onClick={() => {
                  setIsSearchActive(true);
                  setIsMenuOpen(false); // Close filter menu when search is activated
                }} aria-label="Rechercher">
                  <Search className="button-icon" />
                </button>
              </>
            )}
            <BurgerMenu />
          </>
        )}
      </div>
      <div className={`menu-content ${isMenuOpen ? 'open' : ''}`}>
        <p className="category-selection-message">Tu peux sélectionner une ou plusieurs catégories.</p>
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
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default MenuComponent;
