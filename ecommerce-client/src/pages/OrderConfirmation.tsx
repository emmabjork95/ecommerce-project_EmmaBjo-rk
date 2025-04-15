import { useEffect, useState } from "react";
import { getPaymentById, updateOrderStatus } from "../services/apiOrders";
import { IOrder } from "../types/IOrder";
import { useSearchParams } from "react-router";


export const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    //Snappa upp Querystring parametern session_id,
    //-> order-confirmation?session_id=cs_test....
    // från URL:en, med hjälp av useSearchParams()


    //Använd session_id värdet från URL:en för att hämta specifik order
    // med följande anrop: GET/orders/payment/:id
    // där :id är session_id



    // Se till att uppdatera ordern med följande
      // payment_status = "Paid",
      // payment_id = session_id
      // order_status= "Received"


   // Använd order för att visa orderinfo på denna sida
    const sessionId = searchParams.get("session_id");
    console.log("Session Id från URL:", sessionId);

    if (sessionId) {
      const fetchOrder = async () => {
        try {
          const response = await getPaymentById(sessionId);
          console.log("Hämtad order:", response);

          if(response) {
            setOrder(response);
            await updateOrderStatus(response.id, {
              order_status: "Received", 
              payment_status: "Paid", 
              payment_id: sessionId
            });
            console.log("Ordern har uppdaterats.");

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

    localStorage.removeItem('cart');
    localStorage.removeItem("checkoutCustomer");
    console.log("LocalStorage för cart och customer är nu tömt.");
  }, [searchParams]);

  if (!order) {
    return <p>Kunde inte visa order</p>
  }


  return (
    <div>
      <h1>Tack för din beställning!</h1>
      <p>Ordernummer: {order.id}</p>

      <h3>Produkter:</h3>
      <ul>
        {order.order_items.map((item: any) => (
          <li key={item.id}>
            {item.product_name} - {item.quantity} st - {item.unit_price} kr
          </li>
        ))}
      </ul>

      <p>Totalbelopp: {order.total_price} kr</p>
    </div>
  );
};

