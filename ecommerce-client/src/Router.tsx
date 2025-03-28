import { createBrowserRouter } from "react-router";
import CreateProduct from "./pages/products/CreateProduct.tsx";
import AdminCustomers from "./pages/customer/AdminCustomers.tsx";
import EditCustomer from "./pages/customer/EditCustomer.tsx";
import Orders from "./pages/orders/AdminOrders.tsx";
import OrderDetails from "./pages/orders/OrderDetails.tsx.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import Home from "./pages/Home.tsx";
import { Cart } from "./pages/Cart.tsx";
import CreateCustomer from "./pages/customer/CreateCustomer.tsx";
import Layout from "./layouts/Layout.tsx";
import EditProduct from "./pages/products/EditProduct.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import AdminProducts from "./pages/products/AdminProducts.tsx";
import { Checkout } from "./pages/Checkout.tsx";
import { OrderConfirmation } from "./pages/OrderConfirmation.tsx";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout></Layout>,
        children: [
            {
                path: "",
                element: <Home></Home>
            },
            {
                path: "cart",
                element: <Cart></Cart>
            },
            {
                path: "/product/:id",
                element: <ProductDetails></ProductDetails>
            },
            {
                path: "checkout",
                element: <Checkout></Checkout>
            },
            {
                path: "order/success",
                element: <OrderConfirmation></OrderConfirmation>
            },
        
          
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout></AdminLayout>,
        children: [
           
            {
                path: "products",
                element: <AdminProducts></AdminProducts>
            },
            {
                path: "create",
                element: <CreateProduct></CreateProduct>
            },
            {
                path: "edit/:id",
                element: <EditProduct></EditProduct>
            },
            {
                path: "customers",
                element: <AdminCustomers></AdminCustomers>
            },
            {
                path: "edit-customer/:id",
                element: <EditCustomer></EditCustomer>
            },
            {
                path: "customers/create",
                element: <CreateCustomer></CreateCustomer>
            },
            {
                path: "orders",
                element: <Orders></Orders>
            },
            {
                path: "orders/:id",
                element: <OrderDetails></OrderDetails>
            },

        ]
    }
  
])

export default router;