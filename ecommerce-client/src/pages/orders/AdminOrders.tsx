import { useEffect, useState } from "react";
import { deleteOrder, getOrders, updateOrderStatus } from "../../services/apiOrders";
import { IOrder } from "../../types/IOrder";
import { Link } from "react-router";
import '../../styles/AdminOrders.css'


const AdminOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Fel vid hämtning av ordrar:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Är du säker på att du vill ta bort denna order?")) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter((order) => order.id !== id));
      } catch (error) {
        console.error("Fel vid borttagning av order:", error);
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: string, currentPaymentStatus: string) => {
    try {
      console.log(`Ändrar order ${id} till status: ${newStatus}`);
    
      const payload = {
        order_status: newStatus,
        payment_status: currentPaymentStatus 
      };
    
      await updateOrderStatus(id, payload);
    
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, order_status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Fel vid uppdatering av orderstatus:", error);
    }
  };
  
  return (
 <div className="admin-orders">
<h2 className="admin-orders-header">Hantera Ordrar</h2>
<table className="admin-orders-table">
  <thead>
    <tr>
      <th>Order ID</th>
      <th>Kund</th>
      <th>Email</th>
      <th>Telefon</th>
      <th>Pris</th>
      <th>Betalningsstatus</th>
      <th>Datum</th>
      <th>Orderstatus</th>
      <th>Åtgärder</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order.id}>
        <td>
          <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
        </td>
        <td>{order.customer_firstname} {order.customer_lastname}</td>
        <td>{order.customer_email}</td>
        <td>{order.customer_phone}</td>
        <td>{order.total_price} kr</td>
        <td>{order.payment_status}</td>
        <td>{new Date(order.created_at).toLocaleDateString()}</td>
        <td>
          <select
            className="order-status-select"
            value={order.order_status}
            onChange={(e) => handleStatusChange(order.id!, e.target.value, order.payment_status)}
          >
            <option value="Pending">Mottagen</option>
            <option value="Shipped">Skickad</option>
            <option value="Delivered">Levererad</option>
            <option value="Cancelled">Avbruten</option>
          </select>
        </td>
        <td className="admin-orders-actions">
          <button className="delete-button-admin" onClick={() => handleDelete(order.id)}>Ta bort</button>
          <Link to={`/admin/orders/${order.id}`}>
            <button className="edit-button-admin">Redigera</button>
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
  );
};

export default AdminOrders;
