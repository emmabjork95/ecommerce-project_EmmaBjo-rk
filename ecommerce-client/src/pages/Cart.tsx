import { Link } from 'react-router';
import { useCart } from '../hooks/useCart';
import { CartActionType } from '../reducers/CartReducer';
import { IProduct } from '../types/IProduct';
import '../styles/Cart.css'


export interface CartItem {
  product: IProduct;
  quantity: number;
}
export const Cart = () => {
  const { cart, dispatch } = useCart();


  const handleIncrease = (productId: number) => {
    const cartItem = cart.find((item) => item.product.id === productId);
    if (!cartItem) return; 
  
    dispatch({
      type: CartActionType.CHANGE_QUANTITY,
      payload: { product: cartItem.product, quantity: 1 }, 
    });
  };
  
  const handleDecrease = (productId: number) => {
    const cartItem = cart.find((item) => item.product.id === productId);
    if (!cartItem) return;
  
    dispatch({
      type: CartActionType.CHANGE_QUANTITY,
      payload: { product: cartItem.product, quantity: -1 }, 
    });
  };
  

  const handleRemove = (id: number) => {
    dispatch({ type: CartActionType.REMOVE_ITEM, payload: id });
  };

  const handleResetCart = () => {
    const confirmDelete = window.confirm("Är du säker på att du vill rensa kundvagnen?");
    
    if (confirmDelete) {
      dispatch({ type: CartActionType.RESET_CART, payload: null });
    }
  };
  
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);


  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Din varukorg är tom</h2>
        <p>Du måste lägga till varor i varukorgen innan du kan gå vidare till betalning.</p>
        <Link to="/">
          <button className="back-btn">Tillbaka</button>
        </Link>
      </div>
    );
  }


  return (
    <div className='cart-wrapper'>
      <h2 className="cart-header">Varukorg</h2>
      <ul className='cart-list'>
        {cart.map((item) => (
          <li key={item.product.id} className="cart-item">
            <img src={(item.product as IProduct).image} alt={(item.product as IProduct).name} width="80" height="80" />
         <h3>{item.product.name}</h3>
            <div className='price-quantity'>
            <p>Pris: {item.product.price} kr</p>
            <p>Antal: {item.quantity}</p>
            </div>
            <div className='cart-buttons'>
              <button className="increase-button" onClick={() => handleIncrease(item.product.id)}>+</button>
              <button className="decrease-button" onClick={() => handleDecrease(item.product.id)}>-</button>
              <button className="delete-button" onClick={() => handleRemove(item.product.id)}>
                Radera
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="cart-total">Totalt: {total} kr</h3>
      <div className='cart-action'>
      <Link to="/">
          <button className="pink-btn">Tillbaka</button>
        </Link>
        <button className="clear-cart-btn" onClick={handleResetCart}>
          Rensa kundvagn
        </button>
        <Link to="/checkout">
         <button className="pink-btn">Fortsätt</button>
         </Link>
      </div>
  
  </div>
)}
