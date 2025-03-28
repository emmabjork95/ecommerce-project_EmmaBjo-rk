import { useEffect, useState } from "react";
import axios from "axios";
import { IOrder } from "../../types/IOrder";
import { IProduct } from "../../types/IProduct";
import { Link, useNavigate, useParams } from "react-router";
import { getOrderById } from "../../services/apiOrders";


const OrderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<IOrder | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [error, setError] = useState<string | null>(null);

    
        const fetchOrder = async () => {
            if (!id) return;
            try{
                const data = await getOrderById(Number(id));
                setOrder(data);
            } catch (error) {
                setError("Kunde inte hämta order");
            }
        };

            const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/products");
                setProducts(response.data);
            } catch (error) {
                setError("Kunde inte hämta produkter.");
                console.error("Fel vid hämtning av produkter:", error);
            }
        };

        useEffect(() => {
            fetchOrder(),
            fetchProducts();
        }, [id]);

    const handleRemoveProduct = (order_item_id: number | null) => {
        if (order_item_id === null) {
            alert("Kunde inte ta bort produkten eftersom order-item saknar ID.");
            return;
        }
    
        console.log("Tar bort order-item med ID:", order_item_id);
    
        axios.delete(`http://localhost:3000/order-items/${order_item_id}`)
            .then(() => {
                alert("Produkten har tagits bort från ordern.");
                fetchOrder();
            })
            .catch(() => alert("Kunde inte ta bort produkten."));
      };
    
    const handleUpdateQuantity = (product_id: number, newQuantity: number) => {
        if (newQuantity < 1) return alert("Antalet måste vara minst 1.");
        console.log("Skickar PATCH till:", `http://localhost:3000/order-items/${product_id}`);
        console.log("Data som skickas:", { quantity: newQuantity });

        axios.patch(`http://localhost:3000/order-items/${product_id}`, { quantity: newQuantity })
            .then(() => {
                alert("Antalet har uppdaterats.");
                fetchOrder(); 
            })
            .catch(() => alert("Kunde inte uppdatera antalet."));
    };

    const handleDeleteOrder = () => {
        if (!window.confirm("Är du säker på att du vill ta bort hela ordern?")) return;

        axios.delete(`http://localhost:3000/orders/${id}`)
            .then(() => {
                alert("Ordern har tagits bort.");
                navigate("/admin/orders");
            })
            .catch(() => alert("Kunde inte ta bort ordern."));
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!order) return <p>Laddar order...</p>;

    return (
        <div>
            <h2>Order #{order.id}</h2>
            <p><strong>Kund1:</strong> {order.customer_firstname} {order.customer_lastname}</p>
            <p><strong>Email:</strong> {order.customer_email}</p>
            <p><strong>Telefon:</strong> {order.customer_phone}</p>
            <p><strong>Totalt pris:</strong> {order.total_price} kr</p>
            <p><strong>Betalningsstatus:</strong> {order.payment_status}</p>
            <p><strong>Datum:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Orderstatus:</strong> {order.order_status}</p>

            <h3>Produkter i ordern</h3>
            <table>
                <thead>
                    <tr>
                        <th>Bild</th>
                        <th>Produkt</th>
                        <th>Antal</th>
                        <th>Pris</th>
                        <th>Åtgärder</th>
                    </tr>
                </thead>
                <tbody>
                    {order.order_items?.map((item) => {
                        const product = products.find(p => p.id === item.product_id);
                        return (
                            <tr key={item.id}>
                                <td>
                                    {product?.image ? (
                                        <img src={product.image} alt={product.name} width="50" height="50" />
                                    ) : (
                                        "Ingen bild"
                                    )}
                                </td>
                                <td>{product ? product.name : "Okänd produkt"}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => item.id !== null && handleUpdateQuantity(item.id, Number(e.target.value))}

                                    />
                                </td>
                                <td>{item.unit_price} kr</td>
                                <td>
                                <button onClick={() => handleRemoveProduct(item.id)}>Ta bort</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <button onClick={handleDeleteOrder} style={{ backgroundColor: "red", color: "white" }}>
                Ta bort hela ordern
            </button>

            <Link to="/admin/orders">
                <button>Tillbaka till ordrar</button>
            </Link>
        </div>
    );
};

export default OrderDetails;
