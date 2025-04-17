import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ICustomer } from "../../types/ICustomer";
import { getCustomerById, updateCustomer } from "../../services/apiCustomer";
import { useNavigate, useParams } from "react-router";

export const EditCustomer = () => {
  const { id } = useParams<{ id: string }>(); 
  const customerId = id ? parseInt(id, 10) : null; 
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<ICustomer | null>(null);


  const fetchCustomer = async () => {
    try {
      if (customerId) {
        const data = await getCustomerById(customerId);
        setCustomer(data);
      }
    } catch (error) {
      console.log(error)
    }
  };
  
  useEffect(() => {
    fetchCustomer();
  }, [customerId]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (customer) {
      setCustomer({ ...customer, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customer || customer.id === undefined) {
      return;
    }
    try {
      await updateCustomer(customer.id, customer);
      alert("Kunden har uppdaterats!");
      navigate("/admin/customers");
    } catch (error) {
    console.log(error);
    }
  };

  if (!customer) return <p>Ingen kund hittades</p>;

  return (
    <div className="base-container">
      <form onSubmit={handleSubmit} className="create-edit-form">
        <h2 className="admin-header">Redigera Kund</h2>
        
        <label>Förnamn</label>
        <input type="text" name="firstname" value={customer.firstname} onChange={handleChange} required />
        
        <label>Efternamn</label>
        <input type="text" name="lastname" value={customer.lastname} onChange={handleChange} required />
        
        <label>Email</label>
        <input type="email" name="email" value={customer.email} onChange={handleChange} required />
        
        <label>Telefon</label>
        <input type="text" name="phone" value={customer.phone} onChange={handleChange} required />
        
        <label>Gatuadress</label>
        <input type="text" name="street_address" value={customer.street_address} onChange={handleChange} required />
        
        <label>Postnummer</label>
        <input type="text" name="postal_code" value={customer.postal_code} onChange={handleChange} required />
        
        <label>Stad</label>
        <input type="text" name="city" value={customer.city} onChange={handleChange} required />
        
        <label>Land</label>
        <input type="text" name="country" value={customer.country} onChange={handleChange} required />

        <div className="create-edit-btns">
          <button type="button" onClick={() => navigate("/admin/customers")} className="cancel-btn">Avbryt</button>
          <button type="submit" className="pink-btn">Spara ändringar</button>
        </div>
        
      </form>
    </div>
  );
};

export default EditCustomer;
