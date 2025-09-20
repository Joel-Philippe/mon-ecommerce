'use client';
// CheckboxContext.js
import React, { createContext, useContext, useState } from 'react';

interface SelectedItem {
  title: string;
  deliveryDate: string;
}

interface CheckboxContextType {
  selectedItems: {
    purchases: SelectedItem[];
    messages: SelectedItem[];
  };
  toggleItemSelection: (item: SelectedItem, category: 'purchases' | 'messages') => void;
}

const CheckboxContext = createContext<CheckboxContextType | undefined>(undefined);

export const CheckboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedItems, setSelectedItems] = useState({
    purchases: [],
    messages: [],
  });

  const toggleItemSelection = (item: SelectedItem, category: 'purchases' | 'messages') => {
    setSelectedItems((prevState) => {
      const updatedCategory = (prevState[category] as SelectedItem[]).some(
        (i) => i.title === item.title && i.deliveryDate === item.deliveryDate
      )
        ? (prevState[category] as SelectedItem[]).filter(
            (i) => i.title !== item.title || i.deliveryDate !== item.deliveryDate
          )
        : [...prevState[category], item];

      return {
        ...prevState,
        [category]: updatedCategory,
      };
    });
  };

  return (
    <CheckboxContext.Provider value={{ selectedItems, toggleItemSelection }}>
      {children}
    </CheckboxContext.Provider>
  );
};

export const useCheckbox = () => {
  const context = useContext(CheckboxContext);
  if (context === undefined) {
    throw new Error('useCheckbox must be used within a CheckboxProvider');
  }
  return context;
};
