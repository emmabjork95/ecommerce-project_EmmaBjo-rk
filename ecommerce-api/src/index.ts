import dotenv from "dotenv";
import express, { Request, Response} from "express"
import {connectDB} from "./config/db";
import cors from "cors";



dotenv.config();
const app = express();

// Middleware
app.use(express.json())
app.use(cors())

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req: Request, res: Response) => {

  try {
    const { customerId, cart } = req.body;
    console.log("CustomerId från klienten:", customerId)

    if (!customerId || !cart || cart.length === 0) {
      return res.status(400).json({error: "Customer ID and cart items are required"})
    }

    let customer = null
    if (customerId) {
      try {
        console.log("Hämtar kund med ID:", String(customerId)); 
        customer = await stripe.customers.retrieve(String(customerId));
        console.log("Kund hämtad:", customer);
      } catch (error: any) {
        console.error("Fel vid hämtning av kund:", error);
        if (error.type === 'StripeInvalidRequestError') {
          console.log("Kund hittades inte i Stripe.");
        } else {
          console.error("Okänt fel vid hämtning av kund:", error);
        }
      }
    }

    // Om kunden inte finns, skapa en ny kund
    if (!customer) {
      customer = await stripe.customers.create({
        email: req.body.email,
        name: req.body.id,
      });
    }
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'sek',
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: "http://localhost:5173/order/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: 'http://localhost:5173/checkout',
    client_reference_id: customerId
  });


  res.json({checkout_url: session.url, session_id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({error: "Failed to create checkout session"});
  }
});



app.get('/order/success', async (req: any, res: any) => {
  console.log(req)
  try {

    const sessionId = req.params.session_id as string;
    if (!sessionId) {
      console.error("Ingen session_id skickades");
      return res.status(400).json({ error: "Session ID saknas" });
    }

    console.log(" session_id mottagen:", sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Session hämtad:", session);

    if (!session.customer) {
      console.warn("Ingen kund kopplad till sessionen!");
      return res.status(400).json({ error:"Ingen kund kopplad till denna session" });
    }

    const customer = await stripe.customers.retrieve(session.customer as string);
    console.log("Kund hämtad:", customer);

    res.json({
      customerName:  customer.name || "Okänd",
      orderId: session.metadata?.order_id || "Saknas",
      total: session.amount_total ? session.amount_total / 100 : 0,
      paymentStatus: session.payment_status || "Okänd",
    });
  } catch (error) {
    console.error("Order retrieval error:", error);
    res.status(500).json({ error: "Misslyckades att hämta ordern." });
  }
});

app.get("/orders/payment/:id", async (req, res) => {
  try {
    const sessionId = req.params.id;
    console.log("Tommy", req.params)
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID saknas" });
    }

    // Hämta sessionen från Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customer = await stripe.customers.retrieve(session.customer_details);
    
  } catch (error) {
    console.error("Order retrieval error:", error);
    res.status(500).json({ error: "Misslyckades att hämta ordern." });
  }
});

// Routes
import productRouter from "./routes/products";
import customerRouter from "./routes/customers";
import orderRouter from "./routes/orders";
import orderItemRouter from "./routes/orderItems";
app.use('/products', productRouter)
app.use('/customers', customerRouter)
app.use('/orders', orderRouter)
app.use('/order-items', orderItemRouter)


// Attempt to connect to the database
connectDB()
// Start Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}`);
})
