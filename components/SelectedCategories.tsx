'use client';
import React from 'react';
import { Card } from '@/types';
import { X } from 'lucide-react';
import './SelectedCategories.css';

interface SelectedCategoriesProps {
  selectedCategories: string[];
  allCards: Card[];
  onRemoveCategory: (category: string) => void;
  onClearAll: () => void;
}

const SelectedCategories: React.FC<SelectedCategoriesProps> = ({ 
  selectedCategories, 
  allCards, 
  onRemoveCategory,
  onClearAll
}) => {
  if (selectedCategories.length === 0) {
    return null;
  }

  const getCategoryInfo = (categoryName: string) => {
    return allCards.find(card => card.categorie === categoryName);
  };

  return (
    <div className="selected-categories-container">
      <div className="selected-categories-list">
        {selectedCategories.map(category => {
          const info = getCategoryInfo(category);
          return (
            <div key={category} className="category-chip">
              {info?.categorieImage && (
                <img src={info.categorieImage} alt={category} className="chip-image" />
              )}
              <span className="chip-label">{category}</span>
              <button onClick={() => onRemoveCategory(category)} className="chip-remove-button">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      {selectedCategories.length > 1 && (
        <button onClick={onClearAll} className="clear-all-button">
          Tout effacer
        </button>
      )}
    </div>
  );
};

export default SelectedCategories;
