import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, } from "react-router"
import { useCart } from "../hooks/useCart";
import { INewCustomer } from "../types/ICustomer";
import { createCustomer, getCustomerByEmail } from "../services/apiCustomer";
import { createOrder, updateOrderStatus } from "../services/apiOrders";
import { IOrderItem } from "../types/IOrderItem";


export const Checkout = () => {
  const {cart } = useCart();

  const [customer, setCustomer] = useState<INewCustomer>({
      firstname:"",
      lastname: "",
      email: "",
      phone: "",
      street_address: "",
      postal_code: "",
      city: "",
      country: "",
  });

  useEffect(() => {
    const savedCustomer = localStorage.getItem("checkoutCustomer");
    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedCustomer = { ...customer, [e.target.name]: e.target.value};
      setCustomer(updatedCustomer);
      localStorage.setItem("checkoutCustomer", JSON.stringify(updatedCustomer));
    };


  const handleCustomer = async () => {
    try {
      // Kontrollera om kunden finns via e-post
      let customerId = null;
      const existingCustomer = await getCustomerByEmail(customer.email);

      if (existingCustomer) {
          // Om kunden finns, använd den kundens ID
          customerId = existingCustomer.id;
      } else {
          // Om kunden inte finns, skapa en ny kund
          const newCustomer = await createCustomer({
                firstname: customer.firstname,
                lastname: customer.lastname,
                email: customer.email,
                phone: customer.phone,
                street_address: customer.street_address,
                postal_code: customer.postal_code,
                city: customer.city,
                country: customer.country,
            });

            customerId = newCustomer.id; 
          }
          return customerId;
        } catch (error){
          console.error("Något gick fel vid hantering av kund:", error);
          throw error;
        }
      };

 const handleOrder = async (customerId: number) => {
  try {
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const orderItems: IOrderItem[] = cart.map((item) => ({
    id: 0, 
    order_id: 0, 
    product_id: item.product.id, 
    product_name: item.product.name,
    quantity: item.quantity,
    unit_price: item.product.price,
    created_at: new Date().toISOString(), 
    image: item.product.image, 
    total_price: item.product.price * item.quantity
  }));

  // Skapa en ny order
  const order = await createOrder({
    customer_id: customerId,
    total_price: totalPrice,
    payment_status: "Unpaid",
    order_status: "Pending",
    order_items: orderItems,
    payment_id: "",
    customer_firstname: customer.firstname,
    customer_lastname: customer.lastname,
    customer_email: customer.email,
    customer_phone: customer.phone,
    customer_street_address: customer.street_address,
    customer_postal_code: customer.postal_code,
    customer_city: customer.city,
    customer_country: customer.country,
    customers_created_at: new Date().toISOString(),
});

console.log("Order skapad:", order);
return order.id;
 } catch (error) {
  console.error("Fel vid skapande av order:", error);
  throw error;
 }
};

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()
      
      const customerId = await handleCustomer();
      const orderID = await handleOrder(customerId);
      console.log("Ordern skapad med ID:", orderID);
      
      console.log("Kund-ID:", customerId);
      console.log("Order-ID:", orderID);
      console.log("Cart:", cart);

      const lineItems = cart.map(item=> ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      const payload = {
        line_items: lineItems,
        order_id: orderID
      }

      console.log("Payload som skickas:", payload);

      try {
        const response = await fetch('http://localhost:3000/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload) //
        });
  
        const data = await response.json();

        //// 

        if (data && data.session_id) {
          await updateOrderStatus(Number(orderID), {
            payment_status: "Unpaid",
            payment_id: data.session_id,
            order_status: "Pending",
          });
          console.log("Order uppdaterad med Stripe session ID:", data.session_id);
        }

        if (data && data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          console.error("Ingen checkout_url mottagen:", data);
        }
      } catch (error) {
        console.error("Något gick fel:", error);
      }
 
    }

  return (
      <>
      <form action="" onSubmit={handleSubmit}>
        <h1>Checkout</h1>
        
        <h3>Varukorg</h3>
          {cart.map((item) => (
              <li key={item.product.id}>
                  <div>
                      <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: "50px", height: "auto", marginRight: "10px" }}
                      />
                      <span>{item.product.name} - Antal: {item.quantity}</span>
                  </div>
              </li>
          ))}

        <div className="checkout-form">
          <h3>Kund info (formulär)</h3>
          <label>
            Förnamn:
          <input type="text" name="firstname" value={customer.firstname} onChange={handleInputChange} required />
          </label>
          <label>
            Efternamn:
            <input type="text" name="lastname" value={customer.lastname} onChange={handleInputChange} required />
          </label>
          <label>
            E-post:
            <input type="email" name="email" value={customer.email} onChange={handleInputChange} required />
          </label>
          <label>
            Telefon:
            <input type="text" name="phone" value={customer.phone} onChange={handleInputChange} required />
          </label>
          <label>
            Adress:
            <input type="text" name="street_address" value={customer.street_address} onChange={handleInputChange} required />
          </label>
          <label>
            Postkod:
            <input type="text" name="postal_code" value={customer.postal_code} onChange={handleInputChange} required />
          </label>
          <label>
            Stad:
            <input type="text" name="city" value={customer.city} onChange={handleInputChange} required />
          </label>
          <label>
            Land:
            <input type="text" name="country" value={customer.country} onChange={handleInputChange} required />
          </label>
        </div>
      
        <button type="submit" style={{ marginBottom: "20px" }}>Till betalning</button>
      </form>
    
  <div>
      <Link to="/cart">
          <button className='back-btn'>Tillbaka</button>
      </Link>
  </div>

</>
  )
}
