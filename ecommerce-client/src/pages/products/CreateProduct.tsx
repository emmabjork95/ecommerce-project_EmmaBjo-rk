import { useState } from "react";
import { useNavigate } from "react-router";
import { createProduct } from "../../services/apiProducts";
import { INewProduct } from "../../types/IProduct";
import '../../styles/CreateProduct.css'

const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<INewProduct>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(product);
      navigate("/admin"); 
    } catch (error) {
      console.error("Fel vid skapande av produkt:", error);
    }
  };

  return (
    <div className="create-product-container">
      <h1 className="create-product-header">Skapa ny produkt</h1>
      <form className="create-edit-form" onSubmit={handleSubmit}>
        
          <label>Produktnamn:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Produktnamn" required/>
    
          <label>Beskrivning:</label>
          <textarea name="description" value={product.description} onChange={handleChange} placeholder="Beskrivning" required className="create-product-textarea"></textarea>

          <label>Pris:</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Pris" required/>
  
          <label>Lagerantal:</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Lagerantal" required/>
   
          <label>Kategori:</label>
          <select name="category" value={product.category} onChange={handleChange} required className="create-product-select">
            <option value="">Välj kategori</option>
            <option value="Pennor">Pennor</option>
            <option value="Böcker">Böcker</option>
          </select>

          <label>Bild-URL:</label>
          <input type="text" name="image" value={product.image} onChange={handleChange} placeholder="Bild-URL" required/>
      
        <div className="create-edit-btns">
          <button type="button" onClick={() => navigate("/admin/products")} className="cancel-btn">Avbryt</button>
          <button type="submit" className="pink-btn">Skapa produkt</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
