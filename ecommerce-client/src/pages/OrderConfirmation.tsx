import { useContext, useEffect, useState } from "react";
import { getPaymentById, updateOrderStatus } from "../services/apiOrders";
import { IOrder } from "../types/IOrder";
import { useSearchParams } from "react-router";
import CartContext from "../contexts/CartContext";
import { CartActionType } from "../reducers/CartReducer";
import "../styles/OrderConfirmation.css"

export const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const {dispatch} = useContext(CartContext);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    console.log("Session Id från URL:", sessionId);

    if (sessionId) {
      const fetchOrder = async () => {
        try {
          const response = await getPaymentById(sessionId);

          if(response) {
            setOrder(response);
            await updateOrderStatus(response.id, {
              order_status: "Mottagen", 
              payment_status: "Betald", 
              payment_id: sessionId
            });
            console.log("Ordern har uppdaterats.");

            dispatch({ type: CartActionType.RESET_CART, payload: null });
            localStorage.removeItem("cart");
            localStorage.removeItem("checkoutCustomer");
            console.log("Varukorgen och kunddata har rensats.");

          } else {
            console.error("Ordern kunde inte hittas.");
            setOrder(null);
          }
        } catch (error) {
          console.error("Kunde inte hämta order:", error)
        }
      };
      fetchOrder();
    }
  }, [searchParams, dispatch]);

  if (!order) {
    return <p>Kunde inte visa order</p>
  }

  return (
    <div className="order-confirmation-container">
      <h1>Tack för din beställning, {order.customer_firstname}!</h1>
      <ul className="customer-list">
        <li><strong>Ordernummer:</strong> #{order.id}</li>
        <li><strong>Namn:</strong> {order.customer_firstname} {order.customer_lastname}</li>
        <li><strong>Email:</strong> {order.customer_email}</li>
        <li><strong>Telefon:</strong> {order.customer_phone}</li>
        <li><strong>Adress:</strong></li> 
        <li className="adress-confirmation">{order.customer_street_address}, {order.customer_postal_code}</li>
        <li className="adress-confirmation">{order.customer_city}, {order.customer_country}</li>
        <li></li>
      </ul>
      <h3>Produkter</h3>
      <ul className="order-confirmation-list">
        {order.order_items.map((item: any) => (
          <li key={item.id}>
           {item.quantity} x {item.product_name} — {item.unit_price} kr/st
          </li>
        ))}
      </ul>
      <p className="order-confirmation-total">Totalbelopp: {order.total_price} kr</p>
    </div>
  );
};