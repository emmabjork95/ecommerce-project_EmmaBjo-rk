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
      <form className="create-product-form" onSubmit={handleSubmit}>
        <div className="create-product-group">
          <label className="create-product-label">Produktnamn:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Produktnamn" required className="create-product-input" />
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Beskrivning:</label>
          <textarea name="description" value={product.description} onChange={handleChange} placeholder="Beskrivning" required className="create-product-textarea"></textarea>
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Pris:</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Pris" required className="create-product-input" />
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Lagerantal:</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Lagerantal" required className="create-product-input" />
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Kategori:</label>
          <select name="category" value={product.category} onChange={handleChange} required className="create-product-select">
            <option value="">Välj kategori</option>
            <option value="Pennor">Pennor</option>
            <option value="Böcker">Böcker</option>
          </select>
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Bild-URL:</label>
          <input type="text" name="image" value={product.image} onChange={handleChange} placeholder="Bild-URL" required className="create-product-input" />
        </div>

        <div className="create-product-buttons">
          <button type="submit" className="pink-btn">Skapa produkt</button>
          <button type="button" onClick={() => navigate("/admin/products")} className="cancel-btn">Avbryt</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
