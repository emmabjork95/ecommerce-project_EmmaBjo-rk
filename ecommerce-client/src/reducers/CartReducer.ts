import { IProduct } from "../types/IProduct";

export interface ICartAction {
  type: CartActionType;
  payload: ICartItem | any;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export enum CartActionType  {
  ADD_ITEM,
  REMOVE_ITEM,
  CHANGE_QUANTITY,
  RESET_CART
}

export const CartReducer = (cart: ICartItem[], action: ICartAction) => {
  const {payload, type} = action;

  switch(type) {
    case CartActionType.ADD_ITEM: {
      const itemExists = cart.find((item) => item.product.id === payload.product.id);
    
      if (!itemExists) {
        return [...cart, { product: payload.product, quantity: 1 }];
      }

      return cart.map((item) => (
        item.product.id === payload.product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    }
    
    case CartActionType.REMOVE_ITEM: {
      return cart.filter((item) => item.product.id !== payload);
    }
    
    case CartActionType.CHANGE_QUANTITY: {
      return cart.map((item) => {
        if (item.product.id === payload.product.id) {
          const totalQuantity = item.quantity + payload.quantity;
          return { ...item, quantity: totalQuantity > 0 ? totalQuantity : 1 };
        }
        return item;
      })
    }
    
    case CartActionType.RESET_CART:
      return [];
    
    default:
      return cart;
  }
};
