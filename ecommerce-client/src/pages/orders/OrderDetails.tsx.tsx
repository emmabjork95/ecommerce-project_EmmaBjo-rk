import { useEffect, useState } from "react";
import { IOrder } from "../../types/IOrder";
import { IProduct } from "../../types/IProduct";
import { Link, useNavigate, useParams } from "react-router";
import { deleteOrder, deleteOrderItem, getOrderById, updateOrderItemQuantity } from "../../services/apiOrders";
import '../../styles/OrderDetails.css'
import { getProducts } from "../../services/apiProducts";

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
        }};

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            setError("Kunde inte hämta produkter.");
            console.error("Fel vid hämtning av produkter:", error);
        }};

     useEffect(() => {
        fetchOrder(),
        fetchProducts();
    }, [id]);


    const handleRemoveProduct = async (order_item_id: number | null) => {
        if (order_item_id === null) return;
        try {
            await deleteOrderItem(order_item_id);
            fetchOrder(); 
        } catch (error) {
            console.error("Kunde inte ta bort produkten", error);
        }
    };
    
    const handleUpdateQuantity = async (product_id: number, newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }
        try {
            await updateOrderItemQuantity(product_id, { quantity: newQuantity });
            fetchOrder();
        } catch (error) {
            console.error("Kunde inte uppdatera antalet", error);
        }
    };

    const handleDeleteOrder = async () => {
        if (!window.confirm("Är du säker på att du vill ta bort hela ordern?")) return;
        if (!id) {
            console.error("Order-ID saknas.");
            return;
        }
        try {
            await deleteOrder(Number(id));
            navigate("/admin/orders");
        } catch (error) {
            console.error("Kunde inte ta bort ordern", error);
        }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!order) return <p>Laddar order...</p>;

    return (
        <div className="order-details-wrapper">
            <h2>Order #{order.id}</h2>
            <p><strong>Kund:</strong> {order.customer_firstname} {order.customer_lastname}</p>
            <p><strong>Email:</strong> {order.customer_email}</p>
            <p><strong>Telefon:</strong> {order.customer_phone}</p>
            <p><strong>Totalt pris:</strong> {order.total_price} kr</p>
            <p><strong>Betalningsstatus:</strong> {order.payment_status}</p>
            <p><strong>Datum:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Orderstatus:</strong> {order.order_status}</p>

            <div className="product-wrapper">
            <h3>Produkter i ordern</h3>
            <table>
                <thead>
                    <tr>
                        <th></th>
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
                                        className="quantity-btn"
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => item.id !== null && handleUpdateQuantity(item.id, Number(e.target.value))}
                                    />
                                </td>
                                <td>{item.unit_price} kr</td>
                                <td>
                                    <button className="delete-btn-admin" onClick={() => handleRemoveProduct(item.id)}>Radera</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>

            <div className="order-actions-btn">
                <button className="clear-all-btn" onClick={handleDeleteOrder}>Radera hela ordern</button>
                <Link to="/admin/orders">
                    <button className="pink-btn">Tillbaka</button>
                </Link>
            </div>
        </div>
    );
};

export default OrderDetails;
