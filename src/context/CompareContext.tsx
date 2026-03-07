import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/index';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const addToCompare = (product: Product) => {
    if (compareItems.find((item) => item.id === product.id)) return;
    if (compareItems.length >= 3) {
      alert('Bạn chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc.');
      return;
    }
    setCompareItems((prev) => [...prev, product]);
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId: string) => {
    return compareItems.some((item) => item.id === productId);
  };

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  return (
    <CompareContext.Provider value={{ 
      compareItems, 
      addToCompare, 
      removeFromCompare, 
      clearCompare, 
      isInCompare,
      isSearchModalOpen,
      openSearchModal,
      closeSearchModal
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
