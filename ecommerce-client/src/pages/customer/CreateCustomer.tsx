import { ChangeEvent, FormEvent, useState } from "react";
import { createCustomer } from "../../services/apiCustomer";
import {  INewCustomer } from "../../types/ICustomer";
import { useNavigate } from "react-router";
import '../../styles/CreateCustomer.css'

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
    <div className="create-customer-container">
      <h1 className="create-customer-title">Skapa ny kund</h1>
      <form className="create-customer-form" onSubmit={handleSubmit}>

      <div className="create-customer-group">
        <label className="create-customer-label">Förnamn:</label>
        <input className="create-customer-input" type="text" name="firstname" value={customer.firstname} onChange={handleChange} required />
      </div>

      <div className="create-customer-group">
        <label className="create-customer-label">Efternamn:</label>
        <input className="create-customer-input" type="text" name="lastname" value={customer.lastname} onChange={handleChange} required />
      </div>

      <div className="create-customer-group">
        <label className="create-customer-label">Email:</label>
        <input className="create-customer-input" type="email" name="email" value={customer.email} onChange={handleChange} required />
      </div>


      <div className="create-customer-group">
        <label className="create-customer-label">Telefon:</label>
        <input className="create-customer-input" type="text" name="phone" value={customer.phone} onChange={handleChange} required />
      </div>

      <div className="create-customer-group">
        <label className="create-customer-label">Adress:</label>
        <input className="create-customer-input" type="text" name="street_address" value={customer.street_address} onChange={handleChange} required />
      </div>

      <div className="create-customer-group">
        <label className="create-customer-label">Postkod:</label>
        <input className="create-customer-input" type="text" name="postal_code" value={customer.postal_code} onChange={handleChange} required />
      </div>

      <div className="create-customer-group">
        <label className="create-customer-label">Stad:</label>
        <input className="create-customer-input" type="text" name="city" value={customer.city} onChange={handleChange} required />
      </div>

      <div className="create-customer-group">
        <label className="create-customer-label">Land:</label>
        <input className="create-customer-input" type="text" name="country" value={customer.country} onChange={handleChange} required />
      </div>

        <div className="create-customer-buttons">
          <button type="submit" className="pink-btn">Skapa kund</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/customers")} >
            Avbryt
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;
