import { useEffect, useState } from "react";
import { getPaymentById } from "../services/apiOrders";
import { IOrder } from "../types/IOrder";
import { useLocation } from "react-router";


export const OrderConfirmation = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const sessionId = query.get('session_id');

  console.log("Session ID:", sessionId); 

  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    if (sessionId) {
      const fetchOrder = async () => {
        try {
          const paymentData = await getPaymentById(sessionId);
          setOrder(paymentData[0]); 
        } catch (err) {
          console.error("Fel vid hämtning av order:", err);
        }
      };

      fetchOrder();
    }
  }, [sessionId]);


  return (
    <div>
      <h2>Orderbekräftelse</h2>
      {order ? (
        <div>
          <h3>Kundinformation</h3>
          <p>{order.customer_firstname} {order.customer_lastname}</p>
          <p>{order.customer_email}</p>
          <p>{order.customer_phone}</p>

          <h3>Orderdetaljer</h3>
          <ul>
            {order.order_items.map((item) => (
              <li key={item.product_id}>
                <img src={item.image} alt={item.product_name} style={{ width: "50px" }} />
                <p>{item.product_name} - {item.quantity} st</p>
                <p>Pris: {item.unit_price} kr</p>
              </li>
            ))}
          </ul>

          <h3>Totalt pris</h3>
          <p>{order.total_price} kr</p>
        </div>
      ) : (
        <p>Ingen orderinformation tillgänglig.</p>
      )}
    </div>
  );
};
