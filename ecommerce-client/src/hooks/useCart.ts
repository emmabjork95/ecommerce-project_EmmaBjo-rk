import { useContext } from 'react';
import CartContext from '../contexts/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart måste användas inom en CartProvider');
  }

  return context;
};
