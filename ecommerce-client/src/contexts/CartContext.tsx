import { createContext, Dispatch, PropsWithChildren, useEffect, useReducer } from 'react';
import { CartReducer, ICartAction } from '../reducers/CartReducer';
import { ICartItem } from '../types/ICartItem';


export interface ICartContext {
  cart: ICartItem[];
  dispatch: Dispatch<ICartAction>;
}

const CartContext = createContext<ICartContext>({ cart: [], dispatch: () => null });

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, dispatch] = useReducer(CartReducer, [], () => {
    const cachedCart = localStorage.getItem('cart');
    return cachedCart ? JSON.parse(cachedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return <CartContext.Provider value={{ cart, dispatch }}>
    {children}
    </CartContext.Provider>;
};

export default CartContext;
