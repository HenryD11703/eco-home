import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(x => x._id === item._id);
      if (exist) {
        return prevItems.map(x => x._id === exist._id ? { ...x, qty: x.qty + item.qty } : x);
      } else {
        return [...prevItems, item];
      }
    });
  };

  const value = { cartItems, addToCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};