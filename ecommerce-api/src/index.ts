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
    const { line_items, order_id } = req.body;

    if (!line_items || !order_id) {
      return res.status(400).json({ error: 'line_items och order_id krävs' });
    }

    const lineItems = line_items.map((item: any) => ({
      price_data: {
        currency: 'sek',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/order/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: 'http://localhost:5173/checkout',
      client_reference_id: order_id,
    });

    res.json({ checkout_url: session.url, session_id: session.id});

  } catch (error: any) {
    console.error('Fel vid skapande av Stripe-session:', error.message);
    res.status(500).json({ error: 'Något gick fel med Stripe' });
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
