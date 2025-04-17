import { ChangeEvent, FormEvent, useState } from "react";
import { createCustomer } from "../../services/apiCustomer";
import {  INewCustomer } from "../../types/ICustomer";
import { useNavigate } from "react-router";

const CreateCustomer = () => {
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState<INewCustomer>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    street_address: "",
    postal_code: "",
    city: "",
    country: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer(customer);
      navigate("/admin/customers");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="base-container">
      <h1 className="admin-header">Skapa ny kund</h1>
      <form className="create-edit-form" onSubmit={handleSubmit}>
        <label>Förnamn:</label>
        <input type="text" name="firstname" value={customer.firstname} onChange={handleChange} required />

        <label>Efternamn:</label>
        <input type="text" name="lastname" value={customer.lastname} onChange={handleChange} required />
   
        <label>Email:</label>
        <input type="email" name="email" value={customer.email} onChange={handleChange} required />
    
        <label>Telefon:</label>
        <input type="text" name="phone" value={customer.phone} onChange={handleChange} required />
    
        <label>Adress:</label>
        <input type="text" name="street_address" value={customer.street_address} onChange={handleChange} required />

        <label>Postkod:</label>
        <input type="text" name="postal_code" value={customer.postal_code} onChange={handleChange} required />
      
        <label>Stad:</label>
        <input type="text" name="city" value={customer.city} onChange={handleChange} required />
    
        <label>Land:</label>
        <input type="text" name="country" value={customer.country} onChange={handleChange} required />

        <div className="create-edit-btns">
          <button type="submit" className="pink-btn">Skapa kund</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/customers")}>Avbryt</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;