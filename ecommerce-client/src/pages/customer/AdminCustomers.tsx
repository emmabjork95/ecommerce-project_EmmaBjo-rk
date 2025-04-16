import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteCustomer, getCustomers } from "../../services/apiCustomer";
import { ICustomer } from "../../types/ICustomer";
import '../../styles/AdminCustomers.css'

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Är du säker på att du vill ta bort denna kund?")) {
      try {
        await deleteCustomer(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="admin-customers">
      <h2 className="admin-customers-header">Hantera Kunder</h2>
      <button className="pink-btn" onClick={() => navigate("/admin/customers/create")}>Lägg till kund</button>
      <table className="admin-customers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Förnamn</th>
            <th>Efternamn</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Adress</th>
            <th>Postkod</th>
            <th>Stad</th>
            <th>Land</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.firstname}</td>
              <td>{customer.lastname}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.street_address}</td>
              <td>{customer.postal_code}</td>
              <td>{customer.city}</td>
              <td>{customer.country}</td>
              <td className="admin-customers-actions">
                <button className="edit-btn" onClick={() => navigate(`/admin/edit-customer/${customer.id}`)}>
                   Redigera
                </button>
                <button className="delete-button-admin" onClick={() => handleDelete(customer.id!)} >
                   Ta bort
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomers;
